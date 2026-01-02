'use client';

import { useState, useEffect, useCallback } from 'react';
import { SurgeConfig, Subscription, WireGuardConfig, ProxyGroup, Rule, DEFAULT_MITM_CONFIG } from '@/data/types';
import { DEFAULT_GENERAL_SETTINGS, GeneralSettings } from '@/data/base-template';
import { saveConfig, loadConfig, getDefaultConfig, generateId, exportConfigJson, importConfigJson } from '@/lib/storage';
import { generateSurgeConfig, downloadConfig } from '@/lib/generator';
import { POPULAR_RULES, FULL_RULE_LIST, getRuleUrl, RULE_CATEGORY_FILTERS, ALL_RULE_CATEGORIES, THIRD_PARTY_RULE_SOURCES, RuleCategoryInfo } from '@/data/rules-index';

type TabType = 'general' | 'subscriptions' | 'wireguard' | 'rules' | 'groups' | 'mitm' | 'preview';

export default function Home() {
  const [config, setConfig] = useState<SurgeConfig>(getDefaultConfig());
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const saved = loadConfig();
    if (saved) {
      setConfig(saved);
    }
    setIsLoaded(true);
  }, []);

  // Auto-save on config change
  useEffect(() => {
    if (isLoaded) {
      saveConfig(config);
    }
  }, [config, isLoaded]);

  const updateGeneral = useCallback((updates: Partial<GeneralSettings>) => {
    setConfig(prev => ({
      ...prev,
      general: { ...prev.general, ...updates }
    }));
  }, []);

  const handleDownload = useCallback(() => {
    const content = generateSurgeConfig(config);
    downloadConfig(content, 'surge.conf');
  }, [config]);

  const handleExportJson = useCallback(() => {
    exportConfigJson(config);
  }, [config]);

  const handleImportJson = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importConfigJson(content);
      if (imported) {
        setConfig(imported);
        alert('配置导入成功！');
      } else {
        alert('配置导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleReset = useCallback(() => {
    if (confirm('确定要重置所有配置吗？')) {
      setConfig(getDefaultConfig());
    }
  }, []);

  if (!isLoaded) {
    return <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>加载中...</div>;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>⚙️ Surge 配置生成器</h1>
        </div>
        <nav className="sidebar-nav">
          <NavItem icon="📋" label="通用设置" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
          <div className="nav-section-title">第一步：节点来源</div>
          <NavItem icon="📡" label="订阅配置" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} count={config.subscriptions.length} />
          <NavItem icon="🔒" label="WireGuard" active={activeTab === 'wireguard'} onClick={() => setActiveTab('wireguard')} count={config.wireGuardConfigs.length} />
          <div className="nav-section-title">第二步：策略组</div>
          <NavItem icon="🎯" label="策略组" active={activeTab === 'groups'} onClick={() => setActiveTab('groups')} count={config.proxyGroups.length} />
          <div className="nav-section-title">第三步：分流规则</div>
          <NavItem icon="📜" label="规则配置" active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} count={config.rules.length} />
          <div className="nav-section-title">其他</div>
          <NavItem icon="🔐" label="MITM" active={activeTab === 'mitm'} onClick={() => setActiveTab('mitm')} />
          <NavItem icon="👁️" label="预览配置" active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} />
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {activeTab === 'general' && <GeneralTab settings={config.general} onUpdate={updateGeneral} />}
        {activeTab === 'subscriptions' && <SubscriptionsTab subscriptions={config.subscriptions} setConfig={setConfig} />}
        {activeTab === 'wireguard' && <WireGuardTab configs={config.wireGuardConfigs} setConfig={setConfig} />}
        {activeTab === 'rules' && <RulesTab rules={config.rules} proxyGroups={config.proxyGroups} setConfig={setConfig} />}
        {activeTab === 'groups' && <ProxyGroupsTab groups={config.proxyGroups} setConfig={setConfig} subscriptions={config.subscriptions} wireGuardConfigs={config.wireGuardConfigs} />}
        {activeTab === 'mitm' && <MITMTab mitm={config.mitm} setConfig={setConfig} />}
        {activeTab === 'preview' && <PreviewTab config={config} />}

        {/* Action bar */}
        <div className="action-bar">
          <div className="action-bar-left">
            <button className="btn btn-secondary" onClick={handleReset}>🔄 重置</button>
            <label className="btn btn-secondary">
              📥 导入JSON
              <input type="file" accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-secondary" onClick={handleExportJson}>📤 导出JSON</button>
          </div>
          <div className="action-bar-right">
            <button className="btn btn-primary" onClick={handleDownload}>⬇️ 下载配置</button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Navigation item component
function NavItem({ icon, label, active, onClick, count }: { icon: string; label: string; active: boolean; onClick: () => void; count?: number }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="nav-item-icon">{icon}</span>
      <span>{label}</span>
      {count !== undefined && count > 0 && <span className="tag" style={{ marginLeft: 'auto' }}>{count}</span>}
    </div>
  );
}

// General settings tab
function GeneralTab({ settings, onUpdate }: { settings: GeneralSettings; onUpdate: (updates: Partial<GeneralSettings>) => void }) {
  return (
    <>
      <div className="content-header">
        <h2>通用设置</h2>
        <p>配置 Surge 的基本参数</p>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="section-title">网络设置</div>
          <div className="form-row">
            <label className="form-checkbox">
              <input type="checkbox" checked={settings.wifiAssist} onChange={e => onUpdate({ wifiAssist: e.target.checked })} />
              <span>Wi-Fi 助手</span>
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={settings.allHybrid} onChange={e => onUpdate({ allHybrid: e.target.checked })} />
              <span>混合网络模式</span>
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={settings.ipv6} onChange={e => onUpdate({ ipv6: e.target.checked })} />
              <span>启用 IPv6</span>
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={settings.udpPriority} onChange={e => onUpdate({ udpPriority: e.target.checked })} />
              <span>UDP 优先</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Wi-Fi 共享</div>
          <div className="form-row">
            <label className="form-checkbox">
              <input type="checkbox" checked={settings.allowWifiAccess} onChange={e => onUpdate({ allowWifiAccess: e.target.checked })} />
              <span>允许 Wi-Fi 访问</span>
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={settings.allowHotspotAccess} onChange={e => onUpdate({ allowHotspotAccess: e.target.checked })} />
              <span>允许热点访问</span>
            </label>
          </div>
          <div className="form-row" style={{ marginTop: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">HTTP 端口</label>
              <input type="number" className="form-input" value={settings.wifiAccessHttpPort} onChange={e => onUpdate({ wifiAccessHttpPort: parseInt(e.target.value) || 6152 })} />
            </div>
            <div className="form-group">
              <label className="form-label">SOCKS5 端口</label>
              <input type="number" className="form-input" value={settings.wifiAccessSocks5Port} onChange={e => onUpdate({ wifiAccessSocks5Port: parseInt(e.target.value) || 6153 })} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">DNS 设置</div>
          <div className="form-group">
            <label className="form-label">DNS 服务器</label>
            <input type="text" className="form-input" value={settings.dnsServers} onChange={e => onUpdate({ dnsServers: e.target.value })} placeholder="1.1.1.1, 8.8.8.8" />
          </div>
          <div className="form-group">
            <label className="form-label">加密 DNS 服务器</label>
            <input type="text" className="form-input" value={settings.encryptedDnsServer} onChange={e => onUpdate({ encryptedDnsServer: e.target.value })} placeholder="https://dns.alidns.com/dns-query" />
          </div>
          <div className="form-group">
            <label className="form-label">日志级别</label>
            <select className="form-select" value={settings.loglevel} onChange={e => onUpdate({ loglevel: e.target.value as GeneralSettings['loglevel'] })}>
              <option value="verbose">Verbose</option>
              <option value="info">Info</option>
              <option value="notify">Notify</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

// Subscriptions tab
function SubscriptionsTab({ subscriptions, setConfig }: { subscriptions: Subscription[]; setConfig: React.Dispatch<React.SetStateAction<SurgeConfig>> }) {
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const handleAdd = () => {
    setEditingSub({ id: generateId(), name: '', url: '', hidden: true, updateInterval: 1 });
    setShowModal(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub({ ...sub });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingSub || !editingSub.url) return;
    // Auto-generate name from URL if not provided
    const subToSave = { ...editingSub };
    if (!subToSave.name) {
      // Try to extract name from URL
      const urlMatch = subToSave.url.match(/\/download\/([^/?]+)/);
      if (urlMatch) {
        subToSave.name = urlMatch[1];
      } else {
        // Use domain or fallback
        try {
          const urlObj = new URL(subToSave.url);
          subToSave.name = urlObj.hostname.split('.')[0] || `订阅${Date.now()}`;
        } catch {
          subToSave.name = `订阅${Date.now()}`;
        }
      }
    }
    setConfig(prev => {
      const existing = prev.subscriptions.find(s => s.id === subToSave.id);
      let newSubscriptions: typeof prev.subscriptions;

      if (existing) {
        newSubscriptions = prev.subscriptions.map(s => s.id === subToSave.id ? subToSave : s);
      } else {
        newSubscriptions = [...prev.subscriptions, subToSave];
      }

      // Auto-add new subscription to all region groups
      const isNewSub = !existing;
      let newProxyGroups = prev.proxyGroups;
      if (isNewSub) {
        newProxyGroups = prev.proxyGroups.map(g => {
          if (g.groupCategory === 'region') {
            const includeGroups = g.includeOtherGroup || [];
            if (!includeGroups.includes(subToSave.name)) {
              return { ...g, includeOtherGroup: [...includeGroups, subToSave.name] };
            }
          }
          return g;
        });
      }

      return { ...prev, subscriptions: newSubscriptions, proxyGroups: newProxyGroups };
    });
    setShowModal(false);
    setEditingSub(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此订阅？')) {
      setConfig(prev => ({ ...prev, subscriptions: prev.subscriptions.filter(s => s.id !== id) }));
    }
  };

  return (
    <>
      <div className="content-header">
        <h2>订阅配置</h2>
        <p>管理代理订阅源（第一步）</p>
      </div>
      <div className="content-body">
        <div className="info-box">
          💡 添加订阅后会自动加入到所有<strong>地区组</strong>的引用中，无需手动配置。
        </div>
        <button className="btn btn-primary" onClick={handleAdd} style={{ marginBottom: 'var(--space-lg)' }}>➕ 添加订阅</button>

        {subscriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📡</div>
            <p>暂无订阅，点击上方按钮添加</p>
          </div>
        ) : (
          subscriptions.map(sub => (
            <div key={sub.id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-title">{sub.name}</div>
                <div className="list-item-subtitle">{sub.url}</div>
              </div>
              <div className="list-item-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(sub)}>编辑</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sub.id)}>删除</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && editingSub && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSub.id ? '编辑订阅' : '添加订阅'}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">名称</label>
                <input type="text" className="form-input" value={editingSub.name} onChange={e => setEditingSub({ ...editingSub, name: e.target.value })} placeholder="我的订阅" />
              </div>
              <div className="form-group">
                <label className="form-label">订阅地址</label>
                <input type="text" className="form-input" value={editingSub.url} onChange={e => setEditingSub({ ...editingSub, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">节点过滤 (正则表达式)</label>
                <input type="text" className="form-input" value={editingSub.filter || ''} onChange={e => setEditingSub({ ...editingSub, filter: e.target.value })} placeholder="^((?!机场|更新).)*$" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">更新间隔 (小时)</label>
                  <input type="number" className="form-input" value={editingSub.updateInterval || 1} onChange={e => setEditingSub({ ...editingSub, updateInterval: parseInt(e.target.value) || 1 })} />
                </div>
                <label className="form-checkbox" style={{ alignSelf: 'flex-end' }}>
                  <input type="checkbox" checked={editingSub.hidden ?? true} onChange={e => setEditingSub({ ...editingSub, hidden: e.target.checked })} />
                  <span>隐藏节点</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// WireGuard tab
function WireGuardTab({ configs, setConfig }: { configs: WireGuardConfig[]; setConfig: React.Dispatch<React.SetStateAction<SurgeConfig>> }) {
  const [showModal, setShowModal] = useState(false);
  const [editingWg, setEditingWg] = useState<WireGuardConfig | null>(null);

  const handleAdd = () => {
    setEditingWg({
      id: generateId(),
      name: '',
      privateKey: '',
      selfIp: '',
      mtu: 1280,
      publicKey: '',
      allowedIps: '0.0.0.0/0, ::/0',
      endpoint: '',
      keepalive: 25,
      testUrl: 'http://cp.cloudflare.com/generate_204',
    });
    setShowModal(true);
  };

  const handleEdit = (wg: WireGuardConfig) => {
    setEditingWg({ ...wg });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingWg || !editingWg.name || !editingWg.privateKey) return;
    setConfig(prev => {
      const existing = prev.wireGuardConfigs.find(w => w.id === editingWg.id);
      if (existing) {
        return { ...prev, wireGuardConfigs: prev.wireGuardConfigs.map(w => w.id === editingWg.id ? editingWg : w) };
      }
      return { ...prev, wireGuardConfigs: [...prev.wireGuardConfigs, editingWg] };
    });
    setShowModal(false);
    setEditingWg(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此 WireGuard 配置？')) {
      setConfig(prev => ({ ...prev, wireGuardConfigs: prev.wireGuardConfigs.filter(w => w.id !== id) }));
    }
  };

  const handleImportConf = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    // Parse WireGuard conf format
    const privateKey = content.match(/PrivateKey\s*=\s*(.+)/)?.[1]?.trim();
    const address = content.match(/Address\s*=\s*([^\s,/]+)/)?.[1]?.trim();
    const publicKey = content.match(/PublicKey\s*=\s*(.+)/)?.[1]?.trim();
    const endpoint = content.match(/Endpoint\s*=\s*(.+)/)?.[1]?.trim();
    const presharedKey = content.match(/PresharedKey\s*=\s*(.+)/)?.[1]?.trim();
    const allowedIps = content.match(/AllowedIPs\s*=\s*(.+)/)?.[1]?.trim();

    if (privateKey && address && publicKey && endpoint && editingWg) {
      setEditingWg({
        ...editingWg,
        privateKey,
        selfIp: address,
        publicKey,
        endpoint,
        presharedKey,
        allowedIps: allowedIps || '0.0.0.0/0, ::/0',
      });
    }
  };

  return (
    <>
      <div className="content-header">
        <h2>WireGuard 配置</h2>
        <p>管理 WireGuard VPN 配置</p>
      </div>
      <div className="content-body">
        <button className="btn btn-primary" onClick={handleAdd} style={{ marginBottom: 'var(--space-lg)' }}>➕ 添加 WireGuard</button>

        {configs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <p>暂无 WireGuard 配置</p>
          </div>
        ) : (
          configs.map(wg => (
            <div key={wg.id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-title">{wg.name} {wg.ipVersion && <span className="tag">{wg.ipVersion}</span>}</div>
                <div className="list-item-subtitle">{wg.endpoint}</div>
              </div>
              <div className="list-item-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(wg)}>编辑</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(wg.id)}>删除</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && editingWg && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>WireGuard 配置</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">粘贴 WireGuard .conf 内容 (自动解析)</label>
                <textarea className="form-textarea" placeholder="[Interface]&#10;PrivateKey = ...&#10;Address = ...&#10;&#10;[Peer]&#10;PublicKey = ..." onChange={handleImportConf} style={{ minHeight: '120px' }} />
              </div>
              <hr style={{ margin: 'var(--space-lg) 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">配置名称</label>
                  <input type="text" className="form-input" value={editingWg.name} onChange={e => setEditingWg({ ...editingWg, name: e.target.value })} placeholder="公寓v6" />
                </div>
                <div className="form-group">
                  <label className="form-label">IP 版本</label>
                  <select className="form-select" value={editingWg.ipVersion || 'auto'} onChange={e => setEditingWg({ ...editingWg, ipVersion: e.target.value as WireGuardConfig['ipVersion'] })}>
                    <option value="auto">自动</option>
                    <option value="v4-only">仅 IPv4</option>
                    <option value="v6-only">仅 IPv6</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Private Key</label>
                <input type="text" className="form-input" value={editingWg.privateKey} onChange={e => setEditingWg({ ...editingWg, privateKey: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Self IP</label>
                  <input type="text" className="form-input" value={editingWg.selfIp} onChange={e => setEditingWg({ ...editingWg, selfIp: e.target.value })} placeholder="192.168.33.2" />
                </div>
                <div className="form-group">
                  <label className="form-label">MTU</label>
                  <input type="number" className="form-input" value={editingWg.mtu} onChange={e => setEditingWg({ ...editingWg, mtu: parseInt(e.target.value) || 1280 })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Public Key</label>
                <input type="text" className="form-input" value={editingWg.publicKey} onChange={e => setEditingWg({ ...editingWg, publicKey: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Endpoint</label>
                <input type="text" className="form-input" value={editingWg.endpoint} onChange={e => setEditingWg({ ...editingWg, endpoint: e.target.value })} placeholder="1.2.3.4:51820" />
              </div>
              <div className="form-group">
                <label className="form-label">Allowed IPs</label>
                <input type="text" className="form-input" value={editingWg.allowedIps} onChange={e => setEditingWg({ ...editingWg, allowedIps: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preshared Key (可选)</label>
                  <input type="text" className="form-input" value={editingWg.presharedKey || ''} onChange={e => setEditingWg({ ...editingWg, presharedKey: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Keepalive</label>
                  <input type="number" className="form-input" value={editingWg.keepalive} onChange={e => setEditingWg({ ...editingWg, keepalive: parseInt(e.target.value) || 25 })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Test URL</label>
                <input type="text" className="form-input" value={editingWg.testUrl} onChange={e => setEditingWg({ ...editingWg, testUrl: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Rules tab
function RulesTab({ rules, proxyGroups, setConfig }: { rules: Rule[]; proxyGroups: ProxyGroup[]; setConfig: React.Dispatch<React.SetStateAction<SurgeConfig>> }) {
  const [ruleSubTab, setRuleSubTab] = useState<'manage' | 'add'>('manage');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAllRules, setShowAllRules] = useState(false);
  const [customRule, setCustomRule] = useState({ type: 'RULE-SET' as Rule['type'], value: '', policy: '保底', comment: '' });

  // Policy selection modal state
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [pendingRule, setPendingRule] = useState<RuleCategoryInfo | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState('保底');

  // Get selected rule paths
  const selectedRulePaths = new Set(rules.filter(r => r.type === 'RULE-SET').map(r => {
    const match = r.value.match(/\/Surge\/([^/]+)\//);
    return match ? match[1] : null;
  }).filter(Boolean));

  // When searching, use full list; otherwise use popular list or full list based on toggle
  // Default: show 20 popular rules; when searching: search from all 669
  const isSearching = search.trim() !== '';
  const sourceRules = isSearching || showAllRules ? FULL_RULE_LIST : POPULAR_RULES;

  const filteredRules = sourceRules.filter(rule => {
    const matchesSearch = !isSearching || rule.name.toLowerCase().includes(search.toLowerCase()) || (rule.description?.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    // In add mode, exclude already selected rules
    const notSelected = !selectedRulePaths.has(rule.path);
    return matchesSearch && matchesCategory && notSelected;
  }).slice(0, isSearching ? 100 : (showAllRules ? 669 : 20)); // Limit display: 20 default, 100 when searching, all when toggle on

  // Available policies for dropdown - only show service groups (not region/subscription groups)
  const availablePolicies = [
    'DIRECT',
    'REJECT',
    'REJECT-TINYGIF',
    ...proxyGroups.filter(g => !g.hidden && g.groupCategory === 'service').map(g => g.name),
  ];

  const handleAddRule = (ruleInfo: RuleCategoryInfo) => {
    setPendingRule(ruleInfo);
    // Set default policy based on category
    if (ruleInfo.category === 'Ad' || ruleInfo.category === 'Privacy') {
      setSelectedPolicy('REJECT');
    } else if (ruleInfo.category === 'Direct') {
      setSelectedPolicy('DIRECT');
    } else {
      setSelectedPolicy('保底');
    }
    setShowPolicyModal(true);
  };

  const confirmAddRule = () => {
    if (!pendingRule) return;
    const url = getRuleUrl(pendingRule.path);
    const newRule: Rule = {
      id: generateId(),
      type: 'RULE-SET',
      value: url,
      policy: selectedPolicy,
      comment: pendingRule.description || pendingRule.name,
    };
    setConfig(prev => ({
      ...prev,
      rules: [...prev.rules, newRule]
    }));
    setShowPolicyModal(false);
    setPendingRule(null);
  };

  const addThirdPartyRule = (source: typeof THIRD_PARTY_RULE_SOURCES[0]) => {
    const defaultPolicy = source.category === 'Direct' ? 'DIRECT' : source.category === 'Ad' ? 'REJECT' : '保底';
    setCustomRule({
      type: 'RULE-SET',
      value: source.url,
      policy: defaultPolicy,
      comment: source.name,
    });
    setShowCustomModal(true);
  };

  const addCustomRule = () => {
    if (!customRule.value) return;
    const newRule: Rule = {
      id: generateId(),
      ...customRule,
    };
    setConfig(prev => ({ ...prev, rules: [...prev.rules, newRule] }));
    setShowCustomModal(false);
    setCustomRule({ type: 'RULE-SET', value: '', policy: '保底', comment: '' });
  };

  const removeRule = (id: string) => {
    setConfig(prev => ({ ...prev, rules: prev.rules.filter(r => r.id !== id) }));
  };

  const updateRulePolicy = (id: string, newPolicy: string) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map(r => r.id === id ? { ...r, policy: newPolicy } : r)
    }));
  };

  return (
    <>
      <div className="content-header">
        <h2>规则配置</h2>
        <p>管理分流规则（第三步）| ios_rule_script 共 {ALL_RULE_CATEGORIES.length} 条</p>
      </div>
      <div className="content-body">
        {/* Sub-tabs for manage/add */}
        <div style={{ display: 'flex', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border-color)' }}>
          <button
            className={`category-tab ${ruleSubTab === 'manage' ? 'active' : ''}`}
            style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', flex: 1, padding: 'var(--space-md)' }}
            onClick={() => setRuleSubTab('manage')}
          >
            📋 管理规则 ({rules.length})
          </button>
          <button
            className={`category-tab ${ruleSubTab === 'add' ? 'active' : ''}`}
            style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', flex: 1, padding: 'var(--space-md)' }}
            onClick={() => setRuleSubTab('add')}
          >
            ➕ 添加规则
          </button>
        </div>

        {/* Manage tab */}
        {ruleSubTab === 'manage' && (
          <>
            {rules.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📜</div>
                <p>暂无规则，点击"添加规则"标签页添加</p>
              </div>
            ) : (
              <div className="card">
                {rules.map(rule => (
                  <div key={rule.id} className="list-item">
                    <div className="list-item-content">
                      <div className="list-item-title">{rule.comment || rule.value.split('/').pop()}</div>
                      <div className="list-item-subtitle">{rule.type}</div>
                    </div>
                    <select
                      className="form-select"
                      style={{ width: '140px', marginRight: 'var(--space-sm)' }}
                      value={rule.policy}
                      onChange={e => updateRulePolicy(rule.id, e.target.value)}
                    >
                      {availablePolicies.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <button className="btn btn-sm btn-danger" onClick={() => removeRule(rule.id)}>删除</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add tab */}
        {ruleSubTab === 'add' && (
          <>
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="搜索全部 669 条规则..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="category-tabs">
              {RULE_CATEGORY_FILTERS.map(cat => (
                <button key={cat.value} className={`category-tab ${categoryFilter === cat.value ? 'active' : ''}`} onClick={() => setCategoryFilter(cat.value)}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowCustomModal(true)}>📝 自定义URL规则</button>
              <label className="form-checkbox" style={{ marginLeft: 'var(--space-md)' }}>
                <input type="checkbox" checked={showAllRules} onChange={e => setShowAllRules(e.target.checked)} />
                <span>显示全部规则</span>
              </label>
              <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {isSearching ? `搜索结果 ${filteredRules.length} 条` : `显示 ${filteredRules.length} 条`}
              </span>
            </div>

            {/* Rule grid */}
            <div className="section-title">
              {isSearching ? '搜索结果 (点击添加)' : (showAllRules ? '全部规则 (点击添加)' : '推荐规则 (点击添加)')}
            </div>
            <div className="rule-grid">
              {filteredRules.map(rule => (
                <div key={rule.path} className="rule-card" onClick={() => handleAddRule(rule)}>
                  <div className="rule-card-header">
                    <span className="rule-card-name">{rule.name}</span>
                    <span className={`tag tag-${rule.category.toLowerCase()}`}>{rule.category}</span>
                  </div>
                  {rule.description && <div className="rule-card-desc">{rule.description}</div>}
                </div>
              ))}
            </div>

            {/* Third party rules */}
            <div className="section-title" style={{ marginTop: 'var(--space-xl)' }}>第三方规则源</div>
            <div className="rule-grid">
              {THIRD_PARTY_RULE_SOURCES.filter(s => !rules.some(r => r.value === s.url)).map(source => (
                <div key={source.url} className="rule-card" onClick={() => addThirdPartyRule(source)}>
                  <div className="rule-card-header">
                    <span className="rule-card-name">{source.name}</span>
                    <span className={`tag tag-${source.category.toLowerCase()}`}>{source.category}</span>
                  </div>
                  <div className="rule-card-desc">{source.description}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div >

      {/* Policy selection modal */}
      {
        showPolicyModal && pendingRule && (
          <div className="modal-overlay" onClick={() => setShowPolicyModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                <h3>选择策略组</h3>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowPolicyModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                  为 <strong>{pendingRule.name}</strong> 选择分流策略：
                </p>
                <div className="form-group">
                  <select className="form-select" value={selectedPolicy} onChange={e => setSelectedPolicy(e.target.value)}>
                    {availablePolicies.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPolicyModal(false)}>取消</button>
                <button className="btn btn-primary" onClick={confirmAddRule}>添加规则</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Custom rule modal */}
      {
        showCustomModal && (
          <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>添加自定义规则</h3>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowCustomModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">规则类型</label>
                  <select className="form-select" value={customRule.type} onChange={e => setCustomRule({ ...customRule, type: e.target.value as Rule['type'] })}>
                    <option value="RULE-SET">RULE-SET</option>
                    <option value="DOMAIN-SET">DOMAIN-SET</option>
                    <option value="DOMAIN">DOMAIN</option>
                    <option value="DOMAIN-SUFFIX">DOMAIN-SUFFIX</option>
                    <option value="DOMAIN-KEYWORD">DOMAIN-KEYWORD</option>
                    <option value="IP-CIDR">IP-CIDR</option>
                    <option value="IP-ASN">IP-ASN</option>
                    <option value="GEOIP">GEOIP</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">值 (URL 或匹配内容)</label>
                  <input type="text" className="form-input" value={customRule.value} onChange={e => setCustomRule({ ...customRule, value: e.target.value })} placeholder="https://... 或 example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">策略组</label>
                  <select className="form-select" value={customRule.policy} onChange={e => setCustomRule({ ...customRule, policy: e.target.value })}>
                    {availablePolicies.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">备注</label>
                  <input type="text" className="form-input" value={customRule.comment} onChange={e => setCustomRule({ ...customRule, comment: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCustomModal(false)}>取消</button>
                <button className="btn btn-primary" onClick={addCustomRule}>添加</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

// Proxy Groups tab
function ProxyGroupsTab({ groups, setConfig, subscriptions, wireGuardConfigs }: { groups: ProxyGroup[]; setConfig: React.Dispatch<React.SetStateAction<SurgeConfig>>; subscriptions: Subscription[]; wireGuardConfigs: WireGuardConfig[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProxyGroup | null>(null);

  const availableProxies = [
    ...wireGuardConfigs.map(w => w.name),
    ...subscriptions.map(s => s.name),
    'DIRECT',
    'REJECT',
  ];

  const handleAdd = () => {
    setEditingGroup({
      id: generateId(),
      name: '',
      type: 'select',
      proxies: [],
    });
    setShowModal(true);
  };

  const handleEdit = (group: ProxyGroup) => {
    setEditingGroup({ ...group });
    setShowModal(true);
  };

  const handleAddWithCategory = (category: 'region' | 'service') => {
    setEditingGroup({
      id: generateId(),
      name: '',
      type: category === 'region' ? 'smart' : 'select',
      proxies: [],
      groupCategory: category,
      hidden: category === 'region',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingGroup || !editingGroup.name) return;
    setConfig(prev => {
      const existing = prev.proxyGroups.find(g => g.id === editingGroup.id);
      if (existing) {
        return { ...prev, proxyGroups: prev.proxyGroups.map(g => g.id === editingGroup.id ? editingGroup : g) };
      }
      return { ...prev, proxyGroups: [...prev.proxyGroups, editingGroup] };
    });
    setShowModal(false);
    setEditingGroup(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此策略组？')) {
      setConfig(prev => ({ ...prev, proxyGroups: prev.proxyGroups.filter(g => g.id !== id) }));
    }
  };

  // Categorize groups
  const regionGroups = groups.filter(g => g.groupCategory === 'region');
  const serviceGroups = groups.filter(g => g.groupCategory === 'service');
  const otherGroups = groups.filter(g => !g.groupCategory);

  // Helper to render a group item
  const renderGroupItem = (group: ProxyGroup) => (
    <div key={group.id} className="list-item">
      <div className="list-item-content">
        <div className="list-item-title">
          {group.name}
          <span className="tag" style={{ marginLeft: 'var(--space-xs)' }}>{group.type}</span>
          {group.hidden && <span className="tag" style={{ marginLeft: 'var(--space-xs)' }}>隐藏</span>}
        </div>
        <div className="list-item-subtitle">
          {group.includeOtherGroup && group.includeOtherGroup.length > 0
            ? `引用: ${group.includeOtherGroup.join(', ')}`
            : group.proxies.join(', ') || '无代理'}
          {group.policyRegexFilter && ` | 过滤: ${group.policyRegexFilter}`}
        </div>
      </div>
      <div className="list-item-actions">
        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(group)}>编辑</button>
        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(group.id)}>删除</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="content-header">
        <h2>策略组</h2>
        <p>管理代理策略组（第二步）</p>
      </div>
      <div className="content-body">
        <div className="info-box">
          💡 <strong>订阅组</strong>由第一步的订阅自动生成 → <strong>地区组</strong>引用订阅并按正则筛选节点 → <strong>服务组</strong>供第三步的规则使用
        </div>

        {/* Always show subscription groups first */}
        <div className="section-title">📡 订阅组（自动生成）</div>
        {subscriptions.length === 0 ? (
          <div className="card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', color: 'var(--text-muted)' }}>
            暂无订阅，请先在"订阅配置"中添加
          </div>
        ) : (
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            {subscriptions.map(sub => (
              <div key={sub.id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">{sub.name} <span className="tag">smart</span></div>
                  <div className="list-item-subtitle">policy-path: {sub.url.substring(0, 50)}...</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add buttons for region and service groups */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          <button className="btn btn-primary" onClick={() => handleAddWithCategory('region')}>� 添加地区组</button>
          <button className="btn btn-primary" onClick={() => handleAddWithCategory('service')}>🎬 添加服务组</button>
        </div>

        {/* Region groups */}
        {regionGroups.length > 0 && (
          <>
            <div className="section-title">🌏 地区组（筛选节点）</div>
            {regionGroups.map(renderGroupItem)}
          </>
        )}

        {/* Service groups */}
        {serviceGroups.length > 0 && (
          <>
            <div className="section-title">🎬 服务组（供规则使用）</div>
            {serviceGroups.map(renderGroupItem)}
          </>
        )}

        {/* Other/uncategorized groups */}
        {otherGroups.length > 0 && (
          <>
            <div className="section-title">其他策略组</div>
            {otherGroups.map(renderGroupItem)}
          </>
        )}
      </div>

      {showModal && editingGroup && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>策略组配置</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">策略组分类</label>
                <select className="form-select" value={editingGroup.groupCategory || ''} onChange={e => setEditingGroup({ ...editingGroup, groupCategory: e.target.value as ProxyGroup['groupCategory'] || undefined })}>
                  <option value="">其他</option>
                  <option value="region">🌏 地区组（筛选节点，隐藏）</option>
                  <option value="service">🎬 服务组（供规则使用）</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">名称</label>
                  <input type="text" className="form-input" value={editingGroup.name} onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })} placeholder={editingGroup.groupCategory === 'region' ? '例如：香港節點' : '例如：影視服務'} />
                </div>
                <div className="form-group">
                  <label className="form-label">类型</label>
                  <select className="form-select" value={editingGroup.type} onChange={e => setEditingGroup({ ...editingGroup, type: e.target.value as ProxyGroup['type'] })}>
                    <option value="select">select (手动选择)</option>
                    <option value="smart">smart (智能选择)</option>
                    <option value="url-test">url-test (自动测速)</option>
                    <option value="fallback">fallback (故障转移)</option>
                    <option value="load-balance">load-balance (负载均衡)</option>
                  </select>
                </div>
              </div>

              {/* For region groups: show include-other-group and regex filter */}
              {editingGroup.groupCategory === 'region' && (
                <>
                  <div className="form-group">
                    <label className="form-label">引用订阅 (include-other-group)</label>
                    <select multiple className="form-select" style={{ minHeight: '80px' }} value={editingGroup.includeOtherGroup || []} onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                      setEditingGroup({ ...editingGroup, includeOtherGroup: selected });
                    }}>
                      {subscriptions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">正则过滤 (policy-regex-filter)</label>
                    <input type="text" className="form-input" value={editingGroup.policyRegexFilter || ''} onChange={e => setEditingGroup({ ...editingGroup, policyRegexFilter: e.target.value })} placeholder="(香港|HK|🇭🇰)" />
                  </div>
                </>
              )}

              {/* For service groups: show region groups to include */}
              {editingGroup.groupCategory === 'service' && (
                <div className="form-group">
                  <label className="form-label">包含的地区组 (多选)</label>
                  <select multiple className="form-select" style={{ minHeight: '120px' }} value={editingGroup.proxies} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                    setEditingGroup({ ...editingGroup, proxies: selected });
                  }}>
                    {regionGroups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                    <option value="DIRECT">DIRECT</option>
                    <option value="REJECT">REJECT</option>
                  </select>
                </div>
              )}

              {/* For other groups: show both options */}
              {!editingGroup.groupCategory && (
                <>
                  <div className="form-group">
                    <label className="form-label">包含代理/组 (多选)</label>
                    <select multiple className="form-select" style={{ minHeight: '120px' }} value={editingGroup.proxies} onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                      setEditingGroup({ ...editingGroup, proxies: selected });
                    }}>
                      {availableProxies.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">包含其他组 (include-other-group)</label>
                    <input type="text" className="form-input" value={editingGroup.includeOtherGroup?.join(', ') || ''} onChange={e => setEditingGroup({ ...editingGroup, includeOtherGroup: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="组1, 组2" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">正则过滤 (policy-regex-filter)</label>
                    <input type="text" className="form-input" value={editingGroup.policyRegexFilter || ''} onChange={e => setEditingGroup({ ...editingGroup, policyRegexFilter: e.target.value })} placeholder="(香港|HK)" />
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">容差 (tolerance)</label>
                  <input type="number" className="form-input" value={editingGroup.tolerance || ''} onChange={e => setEditingGroup({ ...editingGroup, tolerance: parseInt(e.target.value) || undefined })} />
                </div>
                <label className="form-checkbox" style={{ alignSelf: 'flex-end' }}>
                  <input type="checkbox" checked={editingGroup.hidden ?? (editingGroup.groupCategory === 'region')} onChange={e => setEditingGroup({ ...editingGroup, hidden: e.target.checked })} />
                  <span>隐藏</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}

// MITM tab
function MITMTab({ mitm, setConfig }: { mitm: import('@/data/types').MITMConfig; setConfig: React.Dispatch<React.SetStateAction<SurgeConfig>> }) {
  const updateMitm = (updates: Partial<typeof mitm>) => {
    setConfig(prev => ({ ...prev, mitm: { ...prev.mitm, ...updates } }));
  };

  return (
    <>
      <div className="content-header">
        <h2>MITM 配置</h2>
        <p>配置中间人解密证书</p>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="section-title">基本设置</div>
          <div className="form-row">
            <label className="form-checkbox">
              <input type="checkbox" checked={mitm.skipServerCertVerify} onChange={e => updateMitm({ skipServerCertVerify: e.target.checked })} />
              <span>跳过服务器证书验证</span>
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={mitm.tcpConnection} onChange={e => updateMitm({ tcpConnection: e.target.checked })} />
              <span>TCP 连接</span>
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={mitm.h2} onChange={e => updateMitm({ h2: e.target.checked })} />
              <span>HTTP/2</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Hostname</div>
          <div className="form-group">
            <label className="form-label">需要解密的主机名 (逗号分隔)</label>
            <textarea className="form-textarea" value={mitm.hostname} onChange={e => updateMitm({ hostname: e.target.value })} placeholder="*.example.com, api.app.com" />
          </div>
        </div>

        <div className="card">
          <div className="section-title">CA 证书</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
            从你的 Surge 配置中复制 CA 证书信息
          </p>
          <div className="form-group">
            <label className="form-label">ca-passphrase</label>
            <input type="text" className="form-input" value={mitm.caPassphrase || ''} onChange={e => updateMitm({ caPassphrase: e.target.value })} placeholder="证书密码" />
          </div>
          <div className="form-group">
            <label className="form-label">ca-p12 (Base64)</label>
            <textarea className="form-textarea" value={mitm.caP12 || ''} onChange={e => updateMitm({ caP12: e.target.value })} placeholder="MIIKPAIBAzCC..." style={{ minHeight: '150px' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// Preview tab
function PreviewTab({ config }: { config: SurgeConfig }) {
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    setPreviewContent(generateSurgeConfig(config));
  }, [config]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(previewContent);
    alert('已复制到剪贴板');
  };

  return (
    <>
      <div className="content-header">
        <h2>预览配置</h2>
        <p>查看生成的 Surge 配置文件</p>
      </div>
      <div className="content-body">
        <div className="preview-panel">
          <div className="preview-header">
            <span>surge.conf</span>
            <button className="btn btn-sm btn-secondary" onClick={copyToClipboard}>📋 复制</button>
          </div>
          <div className="preview-content">
            <pre>{previewContent}</pre>
          </div>
        </div>
      </div>
    </>
  );
}

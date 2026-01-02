// Surge configuration generator

import { SurgeConfig, WireGuardConfig, ProxyGroup, Rule, Subscription, MITMConfig } from '@/data/types';
import { GeneralSettings } from '@/data/base-template';

// Generate [General] section
function generateGeneralSection(settings: GeneralSettings): string {
  return `[General]

# --- 一般設置 ---
wifi-assist = ${settings.wifiAssist}
all-hybrid = ${settings.allHybrid}
udp-priority = ${settings.udpPriority}
internet-test-url = http://cp.cloudflare.com/generate_204
proxy-test-url = http://www.google.com/generate_204
test-timeout = 5
geoip-maxmind-url = https://raw.githubusercontent.com/NobyDa/geoip/release/Private-GeoIP-CN.mmdb
ipv6 = ${settings.ipv6}

# --- Wi-Fi 服務設置 ---
allow-wifi-access = ${settings.allowWifiAccess}
wifi-access-http-port = ${settings.wifiAccessHttpPort}
wifi-access-socks5-port = ${settings.wifiAccessSocks5Port}
http-listen = 0.0.0.0
socks5-listen = 0.0.0.0
allow-hotspot-access = ${settings.allowHotspotAccess}

# --- 兼容性設置 ---
compatibility-mode = 0
skip-proxy = 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, 100.64.0.0/10, 17.0.0.0/8, localhost, *.local
exclude-simple-hostnames = true

# --- DNS 設置 ---
read-etc-hosts = true
doh-skip-cert-verification = false
dns-server = ${settings.dnsServers}
encrypted-dns-server = ${settings.encryptedDnsServer}
use-local-host-item-for-proxy = false
encrypted-dns-follow-outbound-mode = true
include-all-networks = false
include-local-networks = false
loglevel = ${settings.loglevel}

# --- 高級設置 ---
show-error-page-for-reject = true
always-real-ip = link-ip.nextdns.io, *.msftconnecttest.com, *.msftncsi.com, *.srv.nintendo.net, *.stun.playstation.net, xbox.*.microsoft.com, *.xboxlive.com, *.logon.battlenet.com.cn, *.logon.battle.net, stun.l.google.com
hijack-dns = 8.8.8.8:53, 8.8.4.4:53
force-http-engine-hosts = *.ott.cibntv.net
use-default-policy-if-wifi-not-primary = false
udp-policy-not-supported-behaviour = REJECT
ipv6-vif = auto`;
}

// Generate WireGuard proxy line for [Proxy] section
function generateWireGuardProxyLine(config: WireGuardConfig): string {
  const parts = [
    `${config.name} = wireguard`,
    `section-name=${config.name}`,
    `test-url=${config.testUrl}`,
  ];
  if (config.ipVersion && config.ipVersion !== 'auto') {
    parts.push(`ip-version=${config.ipVersion}`);
  }
  return parts.join(', ');
}

// Generate [Proxy] section
function generateProxySection(wireGuardConfigs: WireGuardConfig[]): string {
  const lines = ['[Proxy]'];

  // Add WireGuard proxies
  for (const wg of wireGuardConfigs) {
    lines.push(generateWireGuardProxyLine(wg));
  }

  return lines.join('\n');
}

// Generate [Proxy Group] section
function generateProxyGroupSection(groups: ProxyGroup[], subscriptions: Subscription[]): string {
  const lines = ['[Proxy Group]'];

  // First, add subscription-based groups
  for (const sub of subscriptions) {
    const parts = [`${sub.name} = smart`];
    if (sub.hidden) parts.push('hidden=1');
    parts.push(`policy-path=${sub.url}`);
    if (sub.updateInterval) parts.push(`update-interval=${sub.updateInterval * 3600}`);
    if (sub.filter) parts.push(`policy-regex-filter=${sub.filter}`);
    if (sub.hidden !== false) parts.push('no-alert=1');
    lines.push(parts.join(', '));
  }

  // Then add custom proxy groups
  for (const group of groups) {
    const parts = [`${group.name} = ${group.type}`];
    if (group.hidden) parts.push('hidden=1');
    if (group.includeOtherGroup && group.includeOtherGroup.length > 0) {
      parts.push(`include-other-group="${group.includeOtherGroup.join(', ')}"`);
    }
    if (group.policyRegexFilter) parts.push(`policy-regex-filter=${group.policyRegexFilter}`);
    if (group.proxies.length > 0) parts.push(group.proxies.join(', '));
    if (group.tolerance) parts.push(`tolerance=${group.tolerance}`);
    if (group.noAlert) parts.push('no-alert=1');
    lines.push(parts.join(', '));
  }

  return lines.join('\n');
}

// Generate [Rule] section
function generateRuleSection(rules: Rule[]): string {
  const lines = ['[Rule]'];

  for (const rule of rules) {
    let line = '';

    if (rule.type === 'RULE-SET' || rule.type === 'DOMAIN-SET') {
      line = `${rule.type},${rule.value},${rule.policy}`;
    } else if (rule.type === 'AND' || rule.type === 'OR') {
      line = `${rule.type},${rule.value},${rule.policy}`;
    } else {
      line = `${rule.type},${rule.value},${rule.policy}`;
      if (rule.noResolve) line += ',no-resolve';
    }

    if (rule.comment) line += ` // ${rule.comment}`;
    lines.push(line);
  }

  // Add final rules
  lines.push('');
  lines.push('# ============ 最终规则 ============');
  lines.push('AND,((PROTOCOL,UDP), (DEST-PORT,443)),REJECT-NO-DROP');
  lines.push('IP-CIDR,0.0.0.0/32,REJECT,no-resolve');
  lines.push('OR,((GEOIP,CN), (RULE-SET,SYSTEM), (RULE-SET,LAN)),DIRECT');
  lines.push('FINAL,保底,dns-failed');

  return lines.join('\n');
}

// Generate [WireGuard xxx] sections
function generateWireGuardSections(configs: WireGuardConfig[]): string {
  const sections: string[] = [];

  for (const config of configs) {
    const peerParts = [
      `public-key = ${config.publicKey}`,
      `allowed-ips = "${config.allowedIps}"`,
      `endpoint = ${config.endpoint}`,
    ];
    if (config.presharedKey) {
      peerParts.push(`preshared-key = ${config.presharedKey}`);
    }
    peerParts.push(`keepalive = ${config.keepalive}`);

    sections.push(`[WireGuard ${config.name}]
private-key = ${config.privateKey}
self-ip = ${config.selfIp}
mtu = ${config.mtu}
peer = (${peerParts.join(', ')})`);
  }

  return sections.join('\n\n');
}

// Generate [MITM] section
function generateMITMSection(mitm: MITMConfig): string {
  const lines = ['[MITM]'];
  lines.push(`skip-server-cert-verify = ${mitm.skipServerCertVerify}`);
  lines.push(`tcp-connection = ${mitm.tcpConnection}`);
  lines.push(`h2 = ${mitm.h2}`);
  lines.push(`hostname = ${mitm.hostname || ''}`);

  if (mitm.caPassphrase) {
    lines.push(`ca-passphrase = ${mitm.caPassphrase}`);
  }
  if (mitm.caP12) {
    lines.push(`ca-p12 = ${mitm.caP12}`);
  }

  return lines.join('\n');
}

// Generate static sections (Host, URL Rewrite, Header Rewrite)
function generateStaticSections(): string {
  return `[Host]
mtalk.google.com = 108.177.125.188
dl.google.com = server:119.29.29.29
dl.l.google.com = server:119.29.29.29
update.googleapis.com = server:119.29.29.29
amplifi.lan = server:syslib
router.synology.com = server:syslib
router.asus.com = server:syslib
routerlogin.net = server:syslib
www.miwifi.com = server:syslib
miwifi.com = server:syslib
tplogin.cn = server:syslib
tplinklogin.net = server:syslib

[URL Rewrite]
^https?:\\/\\/(www.)?(g|google)\\.cn https://www.google.com 302
^https?:\\/\\/(ditu|maps).google\\.cn https://maps.google.com 302

[Header Rewrite]
http-request ^https?:\\/\\/.*\\.zhihu\\.com\\/(question|topic) header-replace User-Agent "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X)"`;
}

// Main generator function
export function generateSurgeConfig(config: SurgeConfig): string {
  const sections: string[] = [];

  // [General]
  sections.push(generateGeneralSection(config.general));

  // [Proxy]
  sections.push(generateProxySection(config.wireGuardConfigs));

  // [Proxy Group]
  sections.push(generateProxyGroupSection(config.proxyGroups, config.subscriptions));

  // [Rule]
  sections.push(generateRuleSection(config.rules));

  // Static sections
  sections.push(generateStaticSections());

  // [MITM]
  sections.push(generateMITMSection(config.mitm));

  // [WireGuard xxx] sections at the end
  if (config.wireGuardConfigs.length > 0) {
    sections.push(generateWireGuardSections(config.wireGuardConfigs));
  }

  return sections.join('\n\n');
}

// Download helper
export function downloadConfig(content: string, filename: string = 'surge.conf'): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

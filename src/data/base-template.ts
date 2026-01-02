// Base Surge configuration template
// Derived from 咕咕.conf with WireGuard, subscriptions, and sensitive data removed

export const BASE_TEMPLATE = `[General]

# --- 一般設置 ---
# 增強 Wi-Fi 助理
wifi-assist = true
# 混合網路模式
all-hybrid = false
# 遊戲優化
# 啟用後，當系統負載非常高且數據包處理出現延遲時，優先處理 UDP 數據包。
udp-priority = true
# 延遲測試基準網址
internet-test-url = http://cp.cloudflare.com/generate_204
proxy-test-url = http://www.google.com/generate_204
test-timeout = 5
# GeoIP 數據庫網址
geoip-maxmind-url = https://raw.githubusercontent.com/NobyDa/geoip/release/Private-GeoIP-CN.mmdb
# IPv6 支援（如無特殊需求，建議保持關閉）
ipv6 = true

# --- Wi-Fi 服務設置 ---
# 允許 Surge 作為 HTTP/SOCKS5 代理伺服器提供服務
allow-wifi-access = true
# Surge iOS 默認 HTTP 端口：6152，SOCKS5 端口：6153
wifi-access-http-port = 6152
wifi-access-socks5-port = 6153
# Surge Mac 默認 HTTP 端口：6152，SOCKS5 端口：6153
http-listen = 0.0.0.0
socks5-listen = 0.0.0.0
# 允許共享行動熱點
allow-hotspot-access = true

# --- 兼容性設置 ---
# 配置相容模式，用於修正某些應用的兼容性問題
compatibility-mode = 0
# 跳過代理的網域或 IP 清單，避免代理導致無法訪問
skip-proxy = 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, 100.64.0.0/10, 17.0.0.0/8, localhost, *.local
# 排除簡單主機名（不包含點的域名）
exclude-simple-hostnames = true

# --- DNS 設置 ---
# 從 /etc/hosts 文件中讀取 DNS 記錄
read-etc-hosts = true
# 跳過 DoH 憑證驗證（建議保持關閉）
doh-skip-cert-verification = false
# 傳統 DNS 伺服器設置
dns-server = 1.1.1.1, 114.114.114.114, 2606:4700:4700::1111, 2400:3200:baba::1, system
# 加密 DNS 伺服器設置
encrypted-dns-server = https://dns.alidns.com/dns-query
# 代理請求本地 DNS 映射，若配置為 false 則不會使用本地 DNS 進行解析
use-local-host-item-for-proxy = false
# 加密 DNS 請求是否遵循代理規則，建議設為 true 以確保安全
encrypted-dns-follow-outbound-mode = true
# 包含所有網路請求
include-all-networks = false
# 包含本地網路請求
include-local-networks = false
# 日誌等級
loglevel = notify

# --- 高級設置 ---
# 遇到 REJECT 規則時返回錯誤頁面
show-error-page-for-reject = true
# 指定部分域名必須返回真實 IP，而非虛假 IP（通常用於遊戲主機的 NAT 穿透）
always-real-ip = link-ip.nextdns.io, *.msftconnecttest.com, *.msftncsi.com, *.srv.nintendo.net, *.stun.playstation.net, xbox.*.microsoft.com, *.xboxlive.com, *.logon.battlenet.com.cn, *.logon.battle.net, stun.l.google.com
# 劫持 DNS 查詢，強制將 Google 的 DNS 請求轉發到本地 DNS 伺服器
hijack-dns = 8.8.8.8:53, 8.8.4.4:53
# 強制將指定的 TCP 連接視為 HTTP 請求
force-http-engine-hosts = *.ott.cibntv.net, 123.59.31.1, 119.18.193.135, 122.14.246.33, 175.102.178.52, 116.253.24.*, 175.6.26.*, 220.169.153.*
# 當 Wi-Fi 不是主要網路時，使用預設的代理策略
use-default-policy-if-wifi-not-primary = false
# 當 UDP 流量匹配到不支援 UDP 轉發的策略時的行為
udp-policy-not-supported-behaviour = REJECT
ipv6-vif = auto

[Proxy]
# 代理配置将在此处生成

[Proxy Group]
# 策略組配置将在此处生成

[Rule]
# 规则配置将在此处生成

# ============ 最终规则 ============
# 禁用QUIC强制TCP
AND,((PROTOCOL,UDP), (DEST-PORT,443)),REJECT-NO-DROP
# 防止循环
IP-CIDR,0.0.0.0/32,REJECT,no-resolve
# 国内直连
OR,((GEOIP,CN), (RULE-SET,SYSTEM), (RULE-SET,LAN)),DIRECT
# 兜底
FINAL,保底,dns-failed

[Host]
# Firebase Cloud Messaging
mtalk.google.com = 108.177.125.188
# Google Dl
dl.google.com = server:119.29.29.29
dl.l.google.com = server:119.29.29.29
update.googleapis.com = server:119.29.29.29
# 路由器管理面板
amplifi.lan = server:syslib
router.synology.com = server:syslib
sila.razer.com = server:syslib
router.asus.com = server:syslib
routerlogin.net = server:syslib
orbilogin.com = server:syslib
www.LinksysSmartWiFi.com = server:syslib
LinksysSmartWiFi.com = server:syslib
myrouter.local = server:syslib
www.miwifi.com = server:syslib
miwifi.com = server:syslib
mediarouter.home = server:syslib
tplogin.cn = server:syslib
tplinklogin.net = server:syslib
melogin.cn = server:syslib
falogin.cn = server:syslib

[URL Rewrite]
# Redirect Google Search Service
^https?:\\/\\/(www.)?(g|google)\\.cn https://www.google.com 302
# Redirect Google Maps Service
^https?:\\/\\/(ditu|maps).google\\.cn https://maps.google.com 302
# Redirect HTTP to HTTPS
^https?:\\/\\/(www.)?taobao\\.com\\/ https://taobao.com/ 302
^https?:\\/\\/(www.)?jd\\.com\\/ https://www.jd.com/ 302
^https?:\\/\\/(www.)?mi\\.com\\/ https://www.mi.com/ 302
^https?:\\/\\/you\\.163\\.com\\/ https://you.163.com/ 302
^https?:\\/\\/(www.)?suning\\.com\\/ https://suning.com/ 302
^https?:\\/\\/(www.)?yhd\\.com\\/ https://yhd.com/ 302
# AbeamTV
^https?:\\/\\/api\\.abema\\.io\\/v\\d\\/ip\\/check - reject

[Header Rewrite]
http-request ^https?:\\/\\/.*\\.zhihu\\.com\\/(question|topic) header-replace User-Agent "osee2unifiedRelease/4432 osee2unifiedReleaseVersion/7.8.0 Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"

[MITM]
# 跳过服务端证书验证
skip-server-cert-verify = true
# MITM over HTTP/2
tcp-connection = true
h2 = true
hostname = 
# CA 证书配置
# ca-passphrase = YOUR_PASSPHRASE
# ca-p12 = YOUR_P12_BASE64
`;

// Default General settings that users can modify
export interface GeneralSettings {
  wifiAssist: boolean;
  allHybrid: boolean;
  udpPriority: boolean;
  ipv6: boolean;
  allowWifiAccess: boolean;
  wifiAccessHttpPort: number;
  wifiAccessSocks5Port: number;
  allowHotspotAccess: boolean;
  dnsServers: string;
  encryptedDnsServer: string;
  loglevel: 'verbose' | 'info' | 'notify' | 'warning' | 'error';
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  wifiAssist: true,
  allHybrid: false,
  udpPriority: true,
  ipv6: true,
  allowWifiAccess: true,
  wifiAccessHttpPort: 6152,
  wifiAccessSocks5Port: 6153,
  allowHotspotAccess: true,
  dnsServers: '1.1.1.1, 114.114.114.114, 2606:4700:4700::1111, 2400:3200:baba::1, system',
  encryptedDnsServer: 'https://dns.alidns.com/dns-query',
  loglevel: 'notify',
};

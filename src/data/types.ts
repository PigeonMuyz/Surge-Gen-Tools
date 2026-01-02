// Type definitions for Surge configuration

export interface Subscription {
    id: string;
    name: string;
    url: string;
    target?: 'Surge' | 'SurgeMac';
    filter?: string; // policy-regex-filter
    updateInterval?: number; // hours
    hidden?: boolean;
}

export interface WireGuardConfig {
    id: string;
    name: string;
    privateKey: string;
    selfIp: string;
    mtu: number;
    publicKey: string;
    allowedIps: string;
    endpoint: string;
    presharedKey?: string;
    keepalive: number;
    ipVersion?: 'v4-only' | 'v6-only' | 'auto';
    testUrl: string;
}

export interface ProxyGroup {
    id: string;
    name: string;
    type: 'select' | 'smart' | 'url-test' | 'fallback' | 'load-balance';
    proxies: string[]; // proxy names or group names
    hidden?: boolean;
    includeOtherGroup?: string[];
    policyRegexFilter?: string;
    tolerance?: number;
    noAlert?: boolean;
    // 策略组分类: subscription=订阅组(自动生成), region=地区组(筛选节点), service=服务组(供规则使用)
    groupCategory?: 'subscription' | 'region' | 'service';
}

export interface Rule {
    id: string;
    type: 'DOMAIN' | 'DOMAIN-SUFFIX' | 'DOMAIN-KEYWORD' | 'IP-CIDR' | 'IP-CIDR6' | 'GEOIP' | 'IP-ASN' | 'RULE-SET' | 'DOMAIN-SET' | 'PROCESS-NAME' | 'AND' | 'OR';
    value: string;
    policy: string;
    comment?: string;
    noResolve?: boolean;
}

export interface RuleCategory {
    name: string;
    path: string;
    description?: string;
}

export interface MITMConfig {
    enabled: boolean;
    skipServerCertVerify: boolean;
    tcpConnection: boolean;
    h2: boolean;
    hostname: string;
    caPassphrase?: string;
    caP12?: string;
}

export interface SurgeConfig {
    general: import('./base-template').GeneralSettings;
    subscriptions: Subscription[];
    wireGuardConfigs: WireGuardConfig[];
    proxyGroups: ProxyGroup[];
    rules: Rule[];
    mitm: MITMConfig;
}

export const DEFAULT_MITM_CONFIG: MITMConfig = {
    enabled: false,
    skipServerCertVerify: true,
    tcpConnection: true,
    h2: true,
    hostname: '',
};

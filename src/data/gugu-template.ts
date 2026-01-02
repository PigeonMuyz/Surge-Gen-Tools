// Default configuration template based on 咕咕.conf
// Contains the complete proxy group structure ready for customization

import { SurgeConfig, Subscription, ProxyGroup, Rule, DEFAULT_MITM_CONFIG } from './types';
import { DEFAULT_GENERAL_SETTINGS } from './base-template';
import { getRuleUrl } from './rules-index';

// Generate unique ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

// Default subscriptions - one demo with filter regex
export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
    {
        id: generateId(),
        name: '示例订阅',
        url: 'https://example.com/your-subscription-url',
        filter: '^((?!机场|节点|更新订阅|过期).)*$',
        updateInterval: 1,
        hidden: true,
    },
];

// Default proxy groups based on 咕咕.conf structure
export const DEFAULT_PROXY_GROUPS: ProxyGroup[] = [
    // ========== 地区节点组（筛选节点，隐藏） ==========
    {
        id: generateId(),
        name: '台灣節點',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '(🇨🇳)|(台湾)|(Tai)|(TW)',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: '香港節點',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '(🇭🇰)|(港)|(Hong)|(HK)',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: '美國節點',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '(🇺🇸)|(美)|(旧金山)|(States)|(US)',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: '日本節點',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '(🇯🇵)|(日)|(Japan)|(JP)',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: '新加坡節點',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '(🇸🇬)|(坡)|(Singapore)|(SG)',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: '韓國節點',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '(🇰🇷)|(韩)|(Korea)|(KR)',
        tolerance: 100,
        groupCategory: 'region',
    },
    // AI专用节点（地区组）
    {
        id: generateId(),
        name: 'AI台灣',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '^(?=.*(🇨🇳|台湾|Tai|TW))(?!.*\\[\\d+\\.\\d\\]$).*$',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: 'AI美國',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: ['示例订阅'],
        policyRegexFilter: '^(?=.*(🇺🇸|美|旧金山|States|US))(?!.*\\[\\d+\\.\\d\\]$).*$',
        tolerance: 100,
        groupCategory: 'region',
    },
    {
        id: generateId(),
        name: 'AI日本',
        type: 'smart',
        proxies: [],
        hidden: true,
        includeOtherGroup: [],
        policyRegexFilter: '^(?=.*(🇯🇵|日|Japan|JP))(?!.*\\[\\d+\\.\\d\\]$).*$',
        tolerance: 100,
        groupCategory: 'region',
    },
    // ========== 服务策略组（供规则使用，显示） ==========
    {
        id: generateId(),
        name: 'AI服務',
        type: 'select',
        proxies: ['AI台灣', 'AI美國', 'AI日本'],
        hidden: false,
        groupCategory: 'service',
    },
    {
        id: generateId(),
        name: '影視服務',
        type: 'select',
        proxies: ['香港節點', '台灣節點', '日本節點', '美國節點', '新加坡節點'],
        hidden: false,
        groupCategory: 'service',
    },
    {
        id: generateId(),
        name: '社交媒體',
        type: 'select',
        proxies: ['日本節點', '香港節點', '台灣節點', '新加坡節點', '美國節點'],
        hidden: false,
        groupCategory: 'service',
    },
    {
        id: generateId(),
        name: '下載服務',
        type: 'select',
        proxies: ['香港節點', '日本節點', '台灣節點', 'DIRECT'],
        hidden: false,
        groupCategory: 'service',
    },
    {
        id: generateId(),
        name: '遊戲服務',
        type: 'select',
        proxies: ['日本節點', '香港節點', '台灣節點', '韓國節點', 'DIRECT'],
        hidden: false,
        groupCategory: 'service',
    },
    {
        id: generateId(),
        name: '學術服務',
        type: 'select',
        proxies: ['香港節點', '日本節點', '美國節點', '新加坡節點', 'DIRECT'],
        hidden: false,
        groupCategory: 'service',
    },
    {
        id: generateId(),
        name: '保底',
        type: 'select',
        proxies: ['香港節點', '台灣節點', '日本節點', '新加坡節點', '美國節點', '韓國節點', 'DIRECT'],
        hidden: false,
        groupCategory: 'service',
    },
];

// Default rules based on 咕咕.conf
export const DEFAULT_RULES: Rule[] = [
    // 广告拦截
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Hijacking'), policy: 'REJECT', comment: '反劫持' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Privacy'), policy: 'REJECT', comment: '隐私保护' },
    { id: generateId(), type: 'RULE-SET', value: 'https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo_surge.list', policy: 'REJECT', comment: '广告拦截' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('AdvertisingLite'), policy: 'REJECT-TINYGIF', comment: '广告拦截' },
    { id: generateId(), type: 'RULE-SET', value: 'https://anti-ad.net/surge.txt', policy: 'REJECT', comment: 'Anti-AD' },

    // 国内直连
    { id: generateId(), type: 'RULE-SET', value: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/WeChat.list', policy: 'DIRECT', comment: '微信' },
    { id: generateId(), type: 'RULE-SET', value: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Download.list', policy: 'DIRECT', comment: '下载工具' },
    { id: generateId(), type: 'RULE-SET', value: 'https://github.com/VirgilClyne/GetSomeFries/raw/main/ruleset/ASN.China.list', policy: 'DIRECT', comment: '中国ASN' },

    // AI 服务
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('OpenAI'), policy: 'AI服務', comment: 'OpenAI' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Claude'), policy: 'AI服務', comment: 'Claude' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Anthropic'), policy: 'AI服務', comment: 'Claude API' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Gemini'), policy: 'AI服務', comment: 'Gemini' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('BardAI'), policy: 'AI服務', comment: 'Bard' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Copilot'), policy: 'AI服務', comment: 'GitHub Copilot' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Civitai'), policy: 'AI服務', comment: 'AI模型社区' },

    // 代理服务
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Google'), policy: '保底', comment: 'Google' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('YouTube'), policy: '保底', comment: 'YouTube' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('GitHub'), policy: '下載服務', comment: 'GitHub' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Bing'), policy: 'AI服務', comment: 'Bing' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Microsoft'), policy: '下載服務', comment: 'Microsoft' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('OneDrive'), policy: '下載服務', comment: 'OneDrive' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('iCloud'), policy: '下載服務', comment: 'iCloud' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('AppleMusic'), policy: '影視服務', comment: 'Apple Music' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Siri'), policy: 'AI服務', comment: 'Siri' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('TestFlight'), policy: '下載服務', comment: 'TestFlight' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Apple'), policy: '保底', comment: 'Apple' },

    // 社交媒体
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Telegram'), policy: '社交媒體', comment: 'Telegram' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Twitter'), policy: '社交媒體', comment: 'Twitter/X' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Instagram'), policy: '社交媒體', comment: 'Instagram' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Facebook'), policy: '社交媒體', comment: 'Facebook' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Reddit'), policy: '社交媒體', comment: 'Reddit' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('TikTok'), policy: '社交媒體', comment: 'TikTok' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Threads'), policy: '社交媒體', comment: 'Threads' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Discord'), policy: '社交媒體', comment: 'Discord' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Whatsapp'), policy: '社交媒體', comment: 'WhatsApp' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Slack'), policy: '社交媒體', comment: 'Slack' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Line'), policy: '社交媒體', comment: 'Line' },

    // 流媒体
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Netflix'), policy: '影視服務', comment: 'Netflix' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Disney'), policy: '影視服務', comment: 'Disney+' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Bahamut'), policy: '影視服務', comment: '巴哈姆特' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('KKTV'), policy: '影視服務', comment: 'KKTV' },
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Niconico'), policy: '影視服務', comment: 'Niconico' },

    // 学术
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Scholar'), policy: '學術服務', comment: '学术网站' },

    // 全球
    { id: generateId(), type: 'RULE-SET', value: getRuleUrl('Global'), policy: '保底', comment: '海外漏网之鱼' },
];

// Get complete default config (based on 咕咕.conf)
export function getGuguTemplateConfig(): SurgeConfig {
    return {
        general: { ...DEFAULT_GENERAL_SETTINGS },
        subscriptions: DEFAULT_SUBSCRIPTIONS.map(s => ({ ...s, id: generateId() })),
        wireGuardConfigs: [],
        proxyGroups: DEFAULT_PROXY_GROUPS.map(g => ({ ...g, id: generateId() })),
        rules: DEFAULT_RULES.map(r => ({ ...r, id: generateId() })),
        mitm: { ...DEFAULT_MITM_CONFIG },
    };
}

// Get empty config (for starting from scratch)
export function getEmptyConfig(): SurgeConfig {
    return {
        general: { ...DEFAULT_GENERAL_SETTINGS },
        subscriptions: [],
        wireGuardConfigs: [],
        proxyGroups: [
            {
                id: generateId(),
                name: '保底',
                type: 'select',
                proxies: ['DIRECT'],
                hidden: false,
                groupCategory: 'service',
            },
        ],
        rules: [],
        mitm: { ...DEFAULT_MITM_CONFIG },
    };
}

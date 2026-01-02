// iOS Rule Script - Complete Surge Rule Categories Index (669 rules)
// Source: https://github.com/blackmatrix7/ios_rule_script

export interface RuleCategoryInfo {
  name: string;
  path: string;
  category: 'AI' | 'Media' | 'Social' | 'Game' | 'Dev' | 'Ad' | 'Privacy' | 'Direct' | 'Proxy' | 'Other';
  description?: string;
}

const BASE_URL = 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge';

// Generate rule URL from path
export function getRuleUrl(path: string): string {
  return `${BASE_URL}/${path}/${path}.list`;
}

// Complete list of all 669 Surge rule categories
export const ALL_RULE_CATEGORIES: string[] = [
  '115', '12306', '1337x', '17173', '178', '17zuoye', '2KGames', '360', '36kr', '3Type', '3dm', '4399',
  '4Paradigm', '4chan', '51Job', '51nod', '56', '58TongCheng', '6JianFang', '6park', '8btc', '9News',
  '9to5', 'ABC', 'AFP', 'ALJazeera', 'AMD', 'AMP', 'AOL', 'APKCombo', 'ATTWatchTV', 'Abema', 'AbemaTV',
  'AcFun', 'Accuweather', 'Acer', 'Acplay', 'Actalis', 'AdColony', 'AdGuardSDNSFilter', 'AddToAny',
  'Addthis', 'Adidas', 'Adobe', 'AdobeActivation', 'Advertising', 'AdvertisingLite', 'AdvertisingMiTV',
  'AdvertisingTest', 'Aerogard', 'Afdian', 'Agora', 'AiQiCha', 'AirChina', 'AirWick', 'Akamai', 'Ali213',
  'AliPay', 'Alibaba', 'All4', 'Amazon', 'AmazonCN', 'AmazonIP', 'AmazonPrimeVideo', 'AmazonTrust',
  'Americasvoice', 'AnTianKeJi', 'Anaconda', 'AnandTech', 'Android', 'Anime', 'Anjuke', 'Anonv',
  'Anthropic', 'Antutu', 'Apifox', 'Apkpure', 'AppLovin', 'AppStore', 'Apple', 'AppleDaily', 'AppleDev',
  'AppleFirmware', 'AppleHardware', 'AppleID', 'AppleMail', 'AppleMedia', 'AppleMusic', 'AppleNews',
  'AppleProxy', 'AppleTV', 'Arphic', 'Asahi', 'AsianMedia', "Assassin'sCreed", 'Atlassian', 'Atomdata',
  'BBC', 'BMW', 'BOC', 'BOCOM', 'Bahamut', 'BaiDuTieBa', 'BaiFenDian', 'BaiShanYunKeJi', 'Baidu',
  'BaoFengYingYin', 'BardAI', 'Battle', 'BeStore', 'Beats', 'BesTV', 'Bestbuy', 'BianFeng', 'BiliBili',
  'BiliBiliIntl', 'Binance', 'Bing', 'Blizzard', 'BlockHttpDNS', 'Bloomberg', 'Blued', 'BoXun', 'Bootcss',
  'BrightCove', 'BritboxUK', 'Buypass', 'ByteDance', 'CAS', 'CBS', 'CCB', 'CCTV', 'CEB', 'CETV', 'CGB',
  'CHT', 'CIBN', 'CKJR', 'CMB', 'CNKI', 'CNN', 'CNNIC', 'CSDN', 'CWSeed', 'CableTV', 'CaiNiao',
  'CaiXinChuanMei', 'Cake', 'Camera360', 'Canon', 'ChengTongWangPan', 'China', 'ChinaASN', 'ChinaDNS',
  'ChinaIPs', 'ChinaIPsBGP', 'ChinaMax', 'ChinaMaxNoIP', 'ChinaMaxNoMedia', 'ChinaMedia', 'ChinaMobile',
  'ChinaNews', 'ChinaNoMedia', 'ChinaTelecom', 'ChinaTest', 'ChinaUnicom', 'Chromecast', 'ChuangKeTie',
  'ChunYou', 'Cisco', 'Civitai', 'Classic', 'Claude', 'Cloud', 'Cloudflare', 'Cloudflarecn', 'Clubhouse',
  'ClubhouseIP', 'Cnet', 'Collabora', 'Comodo', 'Contentful', 'Coolapk', 'Copilot', 'Crypto',
  'Cryptocurrency', 'CyberTrust', 'DAZN', 'DMM', 'DNS', 'DaMai', 'Dailymail', 'Dailymotion', 'DanDanZan',
  'Dandanplay', 'DangDang', 'Dedao', 'Deepin', 'Deezer', 'Dell', 'Developer', 'DiDi', 'DiLianWangLuo',
  'DiSiFanShi', 'DiabloIII', 'DianCeWangKe', 'DigiCert', 'DigitalOcean', 'DingTalk', 'DingXiangYuan',
  'Direct', 'Discord', 'DiscoveryPlus', 'Disney', 'Disqus', 'Docker', 'Domob', 'Dood', 'DouBan', 'DouYin',
  'Douyu', 'Download', 'Dropbox', 'DtDNS', 'Dubox', 'Duckduckgo', 'DuoWan', 'Duolingo', 'DynDNS', 'Dynu',
  'EA', 'EHGallery', 'EastMoney', 'EasyPrivacy', 'Electron', 'Eleme', 'Embl', 'Emby', 'Emojipedia',
  'EncoreTVB', 'Entrust', 'Epic', 'Espn', 'FOXNOW', 'FOXPlus', 'Facebook', 'FanFou', 'FangZhengDianZi',
  'Faronics', 'FeiZhu', 'FengHuangWang', 'FengXiaWangLuo', 'Figma', 'Fiio', 'FindMy', 'FitnessPlus',
  'FlipBoard', 'Flurry', 'Fox', 'FreeCodeCamp', 'FuboTV', 'Funshion', 'Game', 'GaoDe', 'Garena', 'Geely',
  'Gemini', 'Gettyimages', 'Gigabyte', 'GitBook', 'GitHub', 'GitLab', 'Gitee', 'Global', 'GlobalMedia',
  'GlobalScholar', 'GlobalSign', 'Gog', 'Google', 'GoogleDrive', 'GoogleEarth', 'GoogleFCM', 'GoogleSearch',
  'GoogleVoice', 'GovCN', 'Gucci', 'GuiGuDongLi', 'HBO', 'HBOAsia', 'HBOHK', 'HBOUSA', 'HKBN', 'HKOpenTV',
  'HKedcity', 'HP', 'HWTV', 'HaiNanHangKong', 'HamiVideo', 'HanYi', 'HashiCorp', 'Haveibeenpwned', 'HeMa',
  'Hearthstone', 'HeroesoftheStorm', 'Heroku', 'HibyMusic', 'Hijacking', 'Himalaya', 'Hkgolden', 'HoYoverse',
  'Hpplay', 'HuYa', 'HuaShuTV', 'HuanJu', 'Huawei', 'Huffpost', 'Hulu', 'HuluJP', 'HuluUSA', 'HunanTV',
  'Hupu', 'IBM', 'ICBC', 'IKEA', 'IMDB', 'IPTVMainland', 'IPTVOther', 'ITV', 'Identrust', 'Imgur',
  'Instagram', 'Intel', 'Intercom', 'JOOX', 'Japonx', 'Jetbrains', 'Jfrog', 'JiGuangTuiSong', 'JianGuoYun',
  'JianShu', 'JinJiangWenXue', 'JingDong', 'Jquery', 'Jsdelivr', 'JueJin', 'Jwplayer', 'KKBOX', 'KKTV',
  'KakaoTalk', 'Kantv', 'Keep', 'KingSmith', 'Kingsoft', 'KouDaiShiShang', 'Ku6', 'KuKeMusic', 'KuaiDi100',
  'KuaiShou', 'KuangShi', 'KugouKuwo', 'LG', 'Lan', 'LanZouYun', 'LastFM', 'LastPass', 'LeJu', 'LeTV',
  'Lenovo', 'LiTV', 'LianMeng', 'Limelight', 'Line', 'LineTV', 'Linguee', 'LinkedIn', 'Linux', 'LivePerson',
  'Logitech', 'LondonReal', 'LuDaShi', 'LvMiLianChuang', 'MEGA', 'MIUIPrivacy', 'MOMOShop', 'MOOMusic',
  'MOOV', 'Mail', 'Mailru', 'Majsoul', 'Manorama', 'Maocloud', 'Marketing', 'McDonalds', 'MeWatch', 'MeiTu',
  'MeiTuan', 'MeiZu', 'MiWu', 'Microsoft', 'MicrosoftEdge', 'Migu', 'MingLueZhaoHui', 'Mogujie', 'Mojitianqi',
  'Movefree', 'Mozilla', 'My5', 'NBC', 'NGA', 'NGAA', 'NTPService', 'NYPost', 'NYTimes', 'NaSDDNS', 'Naver',
  'NaverTV', 'NetEase', 'NetEaseMusic', 'Netflix', 'Niconico', 'Nike', 'Nikkei', 'Nintendo', 'NivodTV',
  'Notion', 'NowE', 'Npmjs', 'Nvidia', 'OKX', 'OP', 'OPPO', 'Olevod', 'OneDrive', 'OnePlus', 'OpenAI',
  'Opera', 'Oracle', 'Oreilly', 'Origin', 'OuPeng', 'Overcast', 'Overwatch', 'PBS', 'PCCW', 'PChome',
  'PChomeTW', 'PPTV', 'PSBC', 'Pandora', 'PandoraTV', 'ParamountPlus', 'Patreon', 'PayPal', 'Peacock',
  'Picacg', 'Picsee', 'PikPak', 'Pinduoduo', 'PingAn', 'Pinterest', 'Pixiv', 'Pixnet', 'PlayStation',
  'PotatoChat', 'PrimeVideo', 'Privacy', 'PrivateTracker', 'Protonmail', 'Proxy', 'ProxyLite', 'Pubmatic',
  'Purikonejp', 'Python', 'QiNiuYun', 'QingCloud', 'Qobuz', 'Qualcomm', 'QuickConnect', 'Qyyjt', 'RTHK',
  'Rakuten', 'Rarbg', 'Razer', 'Reabble', 'Reddit', 'Riot', 'Rockstar', 'RuanMei', 'SFExpress', 'SMG',
  'SMZDM', 'STUN', 'Salesforce', 'Samsung', 'Scaleflex', 'Scholar', 'Sectigo', 'ShangHaiJuXiao', 'Shanling',
  'Sharethis', 'ShenMa', 'ShiJiChaoXing', 'ShiNongZhiKe', 'Shopee', 'Shopify', 'Sina', 'Siri', 'SkyGO',
  'Slack', 'SlideShare', 'Sling', 'SmarTone', 'Snap', 'Sohu', 'Sony', 'SouFang', 'SoundCloud', 'SourceForge',
  'Spark', 'Speedtest', 'Spotify', 'Stackexchange', 'StarCraftII', 'Starbucks', 'Steam', 'SteamCN', 'Stripe',
  'SuNing', 'SublimeText', 'SuiShiChuanMei', 'Supercell', 'Synology', 'SystemOTA', 'TCL', 'TIDAL', 'TVB',
  'TVer', 'TaiKang', 'TaiWanGood', 'TaiheMusic', 'TapTap', 'TeamViewer', 'Teambition', 'Teams', 'Telegram',
  'TelegramNL', 'TelegramSG', 'TelegramUS', 'Tencent', 'TencentVideo', 'TeraBox', 'Tesla', 'TestFlight',
  'ThomsonReuters', 'Threads', 'TianTianKanKan', 'TianWeiChengXin', 'TianYaForum', 'TigerFintech', 'TikTok',
  'Tmdb', 'TongCheng', 'TrustWave', 'TruthSocial', 'Tumblr', 'Twitch', 'Twitter', 'U17', 'UBI', 'UC',
  'UCloud', 'UKMedia', 'UPYun', 'USMedia', 'Ubisoft', 'Ubuntu', 'Udacity', 'UnionPay', 'Unity', 'VISA',
  'VK', 'VOA', 'Vancl', 'Vercel', 'Verisign', 'Verizon', 'VidolTV', 'VikACG', 'Viki', 'Vimeo', 'VipShop',
  'ViuTV', 'Vivo', 'Voxmedia', 'W3schools', 'WIX', 'WanKaHuanJu', 'WanMeiShiJie', 'Wanfang', 'WangSuKeJi',
  'WangXinKeJi', 'WeChat', 'WeTV', 'WeType', 'WeiZhiYunDong', 'Weibo', 'WenJuanXing', 'Westerndigital',
  'Whatsapp', 'WiFiMaster', 'Wikimedia', 'Wikipedia', 'WildRift', 'WoLai', 'Wordpress', 'WorldofWarcraft',
  'Wteam', 'Xbox', 'XiamiMusic', 'XianYu', 'XiaoGouKeJi', 'XiaoHongShu', 'XiaoMi', 'XiaoYuanKeJi', 'XieCheng',
  'XingKongWuXian', 'XueErSi', 'XueQiu', 'Xunlei', 'YYeTs', 'Yandex', 'YiChe', 'YiXiaKeJi', 'YiZhiBo',
  'YouMengChuangXiang', 'YouTube', 'YouTubeMusic', 'YouZan', 'Youku', 'YuanFuDao', 'YunFanJiaSu', 'ZDNS',
  'Zalo', 'Zee', 'ZeeTV', 'Zendesk', 'ZhangYue', 'ZhiYinManKe', 'ZhiYunZhong', 'Zhihu', 'ZhihuAds',
  'ZhongGuoShiHua', 'ZhongWeiShiJi', 'ZhongXingTongXun', 'ZhongYuanYiShang', 'ZhuanZhuan', 'Zoho', 'aiXcoder',
  'eBay', 'friDay', 'iCloud', 'iCloudPrivateRelay', 'iFlytek', 'iQIYI', 'iQIYIIntl', 'iTalkBB', 'ifanr',
  'myTVSUPER', 'zhanqi',
];

// Auto-categorize rules based on name patterns
function categorizeRule(name: string): RuleCategoryInfo['category'] {
  // AI Services
  if (/^(OpenAI|Claude|Gemini|Copilot|BardAI|Anthropic|Civitai|Siri|Bing)$/i.test(name)) return 'AI';
  // Media/Streaming
  if (/^(YouTube|Netflix|Disney|Spotify|AppleMusic|TikTok|Twitch|BiliBili|Bahamut|KKTV|Niconico|HBO|Hulu|iQIYI|Youku|TencentVideo|Abema|Amazon.*Video|Prime|DAZN|DMM|Vimeo)$/i.test(name)) return 'Media';
  if (/Media|TV|Video|Music|Anime|Movie/i.test(name)) return 'Media';
  // Social
  if (/^(Telegram|Twitter|Instagram|Facebook|Reddit|Discord|Whatsapp|Line|Slack|Threads|WeChat|Weibo|Clubhouse|LinkedIn|Tumblr|Pinterest|VK)$/i.test(name)) return 'Social';
  // Games
  if (/^(Steam|Epic|Nintendo|PlayStation|Xbox|Blizzard|EA|Riot|Rockstar|Ubisoft|Supercell|HoYoverse|Garena|Gog|Origin|Battle|TapTap)$/i.test(name)) return 'Game';
  if (/Game|Warcraft|Diablo|Overwatch|Hearthstone|StarCraft/i.test(name)) return 'Game';
  // Developer Tools
  if (/^(GitHub|GitLab|Docker|Vercel|Notion|Figma|Atlassian|Heroku|Npmjs|Python|Anaconda|Jetbrains|HashiCorp|Developer)$/i.test(name)) return 'Dev';
  // Ads/Privacy
  if (/^(Advertising|AdvertisingLite|AdGuard|EasyPrivacy|Hijacking|Privacy|BlockHttpDNS)$/i.test(name)) return 'Ad';
  if (/Ads?$|Privacy/i.test(name)) return 'Privacy';
  // Direct/China
  if (/^(China|ChinaMax|ChinaMedia|ChinaASN|ChinaIPs|Direct|Lan|WeChat|Baidu|Alibaba|Tencent|JingDong|Taobao|Eleme|MeiTuan|DiDi)$/i.test(name)) return 'Direct';
  if (/China|^CN/i.test(name)) return 'Direct';
  // Proxy/Global
  if (/^(Global|GlobalMedia|Proxy|ProxyLite)$/i.test(name)) return 'Proxy';
  // Default
  return 'Other';
}

// Generate full rule info list with auto-categorization
export const FULL_RULE_LIST: RuleCategoryInfo[] = ALL_RULE_CATEGORIES.map(name => ({
  name,
  path: name,
  category: categorizeRule(name),
}));

// Popular/recommended rules for quick access
export const POPULAR_RULES: RuleCategoryInfo[] = [
  // AI Services
  { name: 'OpenAI', path: 'OpenAI', category: 'AI', description: 'ChatGPT, OpenAI API' },
  { name: 'Claude', path: 'Claude', category: 'AI', description: 'Anthropic Claude' },
  { name: 'Anthropic', path: 'Anthropic', category: 'AI', description: 'Claude API' },
  { name: 'Gemini', path: 'Gemini', category: 'AI', description: 'Google Gemini' },
  { name: 'Copilot', path: 'Copilot', category: 'AI', description: 'GitHub Copilot' },
  { name: 'BardAI', path: 'BardAI', category: 'AI', description: 'Google Bard' },
  { name: 'Civitai', path: 'Civitai', category: 'AI', description: 'AI Model Community' },
  { name: 'Siri', path: 'Siri', category: 'AI' },
  { name: 'Bing', path: 'Bing', category: 'AI', description: 'Bing Search & Copilot' },

  // Media Services
  { name: 'YouTube', path: 'YouTube', category: 'Media' },
  { name: 'Netflix', path: 'Netflix', category: 'Media' },
  { name: 'Disney', path: 'Disney', category: 'Media', description: 'Disney+' },
  { name: 'Spotify', path: 'Spotify', category: 'Media' },
  { name: 'AppleMusic', path: 'AppleMusic', category: 'Media' },
  { name: 'TikTok', path: 'TikTok', category: 'Media' },
  { name: 'Twitch', path: 'Twitch', category: 'Media' },
  { name: 'BiliBili', path: 'BiliBili', category: 'Media' },
  { name: 'Bahamut', path: 'Bahamut', category: 'Media', description: '巴哈姆特動畫瘋' },
  { name: 'KKTV', path: 'KKTV', category: 'Media' },
  { name: 'Niconico', path: 'Niconico', category: 'Media' },
  { name: 'HBO', path: 'HBO', category: 'Media' },

  // Social Media
  { name: 'Telegram', path: 'Telegram', category: 'Social' },
  { name: 'Twitter', path: 'Twitter', category: 'Social', description: 'X (Twitter)' },
  { name: 'Instagram', path: 'Instagram', category: 'Social' },
  { name: 'Facebook', path: 'Facebook', category: 'Social' },
  { name: 'Reddit', path: 'Reddit', category: 'Social' },
  { name: 'Discord', path: 'Discord', category: 'Social' },
  { name: 'Whatsapp', path: 'Whatsapp', category: 'Social' },
  { name: 'Line', path: 'Line', category: 'Social' },
  { name: 'Slack', path: 'Slack', category: 'Social' },
  { name: 'Threads', path: 'Threads', category: 'Social' },

  // Developer Tools
  { name: 'GitHub', path: 'GitHub', category: 'Dev' },
  { name: 'GitLab', path: 'GitLab', category: 'Dev' },
  { name: 'Docker', path: 'Docker', category: 'Dev' },
  { name: 'Vercel', path: 'Vercel', category: 'Dev' },
  { name: 'Notion', path: 'Notion', category: 'Dev' },
  { name: 'Figma', path: 'Figma', category: 'Dev' },

  // Games
  { name: 'Steam', path: 'Steam', category: 'Game' },
  { name: 'Epic', path: 'Epic', category: 'Game' },
  { name: 'Nintendo', path: 'Nintendo', category: 'Game' },
  { name: 'PlayStation', path: 'PlayStation', category: 'Game' },
  { name: 'Xbox', path: 'Xbox', category: 'Game' },
  { name: 'Blizzard', path: 'Blizzard', category: 'Game' },
  { name: 'EA', path: 'EA', category: 'Game' },
  { name: 'Riot', path: 'Riot', category: 'Game', description: 'League of Legends, Valorant' },

  // Ad Blocking
  { name: 'AdvertisingLite', path: 'AdvertisingLite', category: 'Ad', description: '广告过滤（轻量版）' },
  { name: 'Advertising', path: 'Advertising', category: 'Ad', description: '广告过滤（完整版）' },
  { name: 'Hijacking', path: 'Hijacking', category: 'Privacy', description: '防劫持' },
  { name: 'Privacy', path: 'Privacy', category: 'Privacy', description: '隐私保护' },

  // Direct Connection
  { name: 'China', path: 'China', category: 'Direct', description: '国内网站' },
  { name: 'ChinaMax', path: 'ChinaMax', category: 'Direct', description: '国内网站（完整版）' },
  { name: 'ChinaMedia', path: 'ChinaMedia', category: 'Direct', description: '国内媒体' },
  { name: 'WeChat', path: 'WeChat', category: 'Direct', description: '微信' },

  // Global Proxy
  { name: 'Global', path: 'Global', category: 'Proxy', description: '国外网站' },
  { name: 'GlobalMedia', path: 'GlobalMedia', category: 'Proxy', description: '国外媒体' },
  { name: 'Proxy', path: 'Proxy', category: 'Proxy', description: '代理列表' },

  // Cloud & Services
  { name: 'Google', path: 'Google', category: 'Other' },
  { name: 'Microsoft', path: 'Microsoft', category: 'Other' },
  { name: 'Apple', path: 'Apple', category: 'Other' },
  { name: 'Amazon', path: 'Amazon', category: 'Other' },
  { name: 'iCloud', path: 'iCloud', category: 'Other' },
  { name: 'OneDrive', path: 'OneDrive', category: 'Other' },
  { name: 'TestFlight', path: 'TestFlight', category: 'Other' },
  { name: 'Scholar', path: 'Scholar', category: 'Other', description: '学术网站' },
  { name: 'Wikipedia', path: 'Wikipedia', category: 'Other' },
  { name: 'Cloudflare', path: 'Cloudflare', category: 'Other' },
  { name: 'Adobe', path: 'Adobe', category: 'Other' },
];

// Category filters for the rule browser
export const RULE_CATEGORY_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'AI', label: 'AI 服务' },
  { value: 'Media', label: '影音媒体' },
  { value: 'Social', label: '社交通讯' },
  { value: 'Game', label: '游戏平台' },
  { value: 'Dev', label: '开发工具' },
  { value: 'Ad', label: '广告过滤' },
  { value: 'Privacy', label: '隐私保护' },
  { value: 'Direct', label: '国内直连' },
  { value: 'Proxy', label: '代理规则' },
  { value: 'Other', label: '其他' },
];

// Third-party rule sources
export const THIRD_PARTY_RULE_SOURCES = [
  {
    name: 'Anti-AD',
    url: 'https://anti-ad.net/surge.txt',
    description: '广告过滤列表',
    category: 'Ad',
  },
  {
    name: 'Adblock4limbo',
    url: 'https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo_surge.list',
    description: 'Limbo 广告过滤',
    category: 'Ad',
  },
  {
    name: 'NobyDa WeChat',
    url: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/WeChat.list',
    description: '微信规则',
    category: 'Direct',
  },
  {
    name: 'NobyDa Download',
    url: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Download.list',
    description: '下载工具规则',
    category: 'Direct',
  },
  {
    name: 'VirgilClyne China ASN',
    url: 'https://github.com/VirgilClyne/GetSomeFries/raw/main/ruleset/ASN.China.list',
    description: '中国 ASN 列表',
    category: 'Direct',
  },
];

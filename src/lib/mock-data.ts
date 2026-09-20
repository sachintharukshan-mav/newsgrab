import { Article, MarketPulse } from './types';

export const mockMarketPulse: MarketPulse = {
  updatedAt: new Date().toISOString(),
  cbslRates: [
    { code: 'USD', name: 'US Dollar', buyRate: 301.25, sellRate: 310.80, change24h: -0.15 },
    { code: 'EUR', name: 'Euro', buyRate: 326.40, sellRate: 339.10, change24h: 0.32 },
    { code: 'GBP', name: 'British Pound', buyRate: 388.90, sellRate: 403.50, change24h: 0.18 },
    { code: 'AUD', name: 'Australian Dollar', buyRate: 198.10, sellRate: 207.45, change24h: -0.05 },
    { code: 'AED', name: 'UAE Dirham', buyRate: 82.02, sellRate: 84.62, change24h: 0.00 }
  ],
  goldPrice24kPerSovereign: {
    lkr: 204500,
    change24h: 1200
  },
  cseIndex: {
    aspi: 12480.65,
    change: 85.20,
    changePercent: 0.69
  },
  colomboWeather: {
    tempC: 30,
    condition: 'Partly Cloudy',
    icon: 'CloudSun'
  }
};

export const mockArticles: Article[] = [
  {
    id: 'cbsl-rate-cut-2026',
    title: {
      en: 'Central Bank of Sri Lanka Cuts Policy Interest Rates by 50 Basis Points to Boost Economic Recovery',
      si: 'ආර්ථික පුනර්ජීවනය ඉලක්ක කරමින් ශ්‍රී ලංකා මහ බැංකුව ප්‍රතිපත්ති පොලී අනුපාත පදනම් අංක 50 කින් පහත හෙළයි',
      ta: 'பொருளாதார மீட்சியை ஊக்குவிக்க இலங்கை மத்திய வங்கி கொள்கை வட்டி விகிதங்களை 50 அடிப்படை புள்ளிகளால் குறைத்துள்ளது'
    },
    summary: {
      en: 'The Monetary Board of the Central Bank of Sri Lanka has reduced the Standing Deposit Facility Rate (SDFR) and Standing Lending Facility Rate (SLFR) by 50 basis points to support sustained credit growth and industrial revival.',
      si: 'ශ්‍රී ලංකා මහ බැංකුවේ මුදල් මණ්ඩලය විසින් ණය වර්ධනය හා කාර්මික පුනර්ජීවනය දිරිගැන්වීම සඳහා නිත්‍ය තැන්පතු සහ ණය පහසුකම් අනුපාත පදනම් අංක 50 කින් පහත දැමීමට තීරණය කර ඇත.',
      ta: 'நிலையான கடன் வளர்ச்சி மற்றும் தொழில்துறை மீட்சிக்கு ஆதரவாக இலங்கை மத்திய வங்கியின் நாணயக் குழு வட்டி விகிதங்களைக் குறைத்துள்ளது.'
    },
    aiBullets: {
      en: [
        'Standing Deposit Facility Rate reduced to 8.25%, and Lending Rate reduced to 9.25%.',
        'Inflation remains well-anchored below the target 5% band, giving room for monetary easing.',
        'Commercial banks requested to immediately pass down rate cuts to small and medium enterprise (SME) borrowers.'
      ],
      si: [
        'නිත්‍ය තැන්පතු පහසුකම් අනුපාතය 8.25% දක්වාත්, ණය පහසුකම් අනුපාතය 9.25% දක්වාත් අඩු කෙරිණි.',
        'උද්ධමනය 5% ඉලක්කගත මට්ටමට වඩා පහළින් පවතින බැවින් ලිහිල් මුදල් ප්‍රතිපත්තියකට ඉඩ සැලසී ඇත.',
        'සුළු හා මධ්‍ය පරිමාණ ව්‍යාපාරිකයන් වෙත පොලී සහනය කඩිනමින් ලබාදෙන ලෙස වාණිජ බැංකුවලින් ඉල්ලා තිබේ.'
      ],
      ta: [
        'வைப்பு வசதி விகிதம் 8.25% ஆகவும், கடன் வசதி விகிதம் 9.25% ஆகவும் குறைக்கப்பட்டது.',
        'பணவீக்கம் 5% இலக்குக்குக் கீழே நிலையாக உள்ளதால் தளர்வு நடவடிக்கை எடுக்கப்பட்டுள்ளது.',
        'சிறிய மற்றும் நடுத்தர வர்த்தகர்களுக்கு இதன் பலனை உடனடியாக வழங்குமாறு வங்கிகள் கேட்டுக்கொள்ளப்பட்டுள்ளன.'
      ]
    },
    sentiment: 'positive',
    category: 'economy',
    region: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    publisherName: 'EconomyNext',
    publisherLogo: 'https://economynext.com/favicon.ico',
    sourceUrl: 'https://economynext.com',
    publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    readTimeMinutes: 3,
    isBreaking: true,
    isFeatured: true,
    clusterCount: 4,
    perspectives: [
      {
        publisherName: 'Daily FT',
        publisherSlug: 'daily-ft',
        sourceUrl: 'https://www.ft.lk',
        headline: 'Markets rally as Central Bank loosens monetary policy to stimulate private credit',
        publishedAt: '28m ago'
      },
      {
        publisherName: 'Ada Derana',
        publisherSlug: 'ada-derana',
        sourceUrl: 'http://www.adaderana.lk',
        headline: 'CBSL Monetary Board announces 50 bps policy rate reduction',
        publishedAt: '35m ago'
      },
      {
        publisherName: 'Daily Mirror',
        publisherSlug: 'daily-mirror',
        sourceUrl: 'https://www.dailymirror.lk',
        headline: 'Borrowing costs to drop further as Central Bank slashes key lending rates',
        publishedAt: '40m ago'
      }
    ]
  },
  {
    id: 'sri-lanka-digital-id-rollout',
    title: {
      en: 'Sri Lanka Accelerates National Digital Identity Project with Biometric Integration by Year-End',
      si: 'ජෛවමිතික තාක්ෂණය සහිත ජාතික ඩිජිටල් හැඳුනුම්පත් ව්‍යාපෘතිය වසර අවසානය වනවිට කඩිනම් කිරීමට පියවර',
      ta: 'ஆண்டு இறுதிக்குள் பயோமெட்ரிக் ஒருங்கிணைப்புடன் தேசிய டிஜிட்டல் அடையாள அட்டை திட்டம் துரிதப்படுத்தப்படுகிறது'
    },
    summary: {
      en: 'The Ministry of Technology has finalized procurement protocols for the Sri Lanka Unique Digital Identity (SL-UDI) framework, paving the way for seamless access to banking, health, and welfare benefits.',
      si: 'ශ්‍රී ලංකා අනන්‍ය ඩිජිටල් හැඳුනුම්පත් (SL-UDI) රාමුව සඳහා ප්‍රසම්පාදන කටයුතු අවසන් කර ඇති අතර එමඟින් බැංකු, සෞඛ්‍ය සහ සුබසාධන ප්‍රතිලාභ කාර්යක්ෂමව ලබාගැනීමට හැකිවනු ඇත.',
      ta: 'இலங்கையின் பிரத்தியேக டிஜிட்டல் அடையாள அட்டைக்கான கொள்முதல் விதிமுறைகளை தொழில்நுட்ப அமைச்சு இறுதி செய்துள்ளது.'
    },
    aiBullets: {
      en: [
        'SL-UDI will consolidate NIC, passport, driving license, and tax file registration.',
        'High-security biometric encryption safeguards personal privacy according to the Personal Data Protection Act.',
        'Pilot registration begins across Western Province divisional secretariats next month.'
      ],
      si: [
        'ජාතික හැඳුනුම්පත, විදේශ ගමන් බලපත්‍රය, රියදුරු බලපත්‍රය සහ බදු ලිපිගොනු ඒකාබද්ධ කෙරේ.',
        'පුද්ගලික දත්ත ආරක්ෂණ පනතට අනුකූලව අධි-ආරක්ෂිත සංකේතාංකන ක්‍රමවේද ක්‍රියාත්මක වේ.',
        'නියමු ලියාපදිංචිය ලබන මාසයේ බස්නාහිර පළාතේ ප්‍රාදේශීය ලේකම් කාර්යාලවලින් ආරම්භ වේ.'
      ],
      ta: [
        'அடையாள அட்டை, கடவுச்சீட்டு, சாரதி அனுமதிப்பத்திரம் மற்றும் வரி இலக்கங்கள் ஒன்றிணைக்கப்படும்.',
        'தனிநபர் தரவுப் பாதுகாப்புச் சட்டத்திற்கு அமைய பயோமெட்ரிக் தகவல்கள் பாதுகாக்கப்படும்.',
        'அடுத்த மாதம் மேல் மாகாணத்தில் மாதிரிப் பதிவுப் பணிகள் தொடங்கப்படும்.'
      ]
    },
    sentiment: 'positive',
    category: 'tech',
    region: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    publisherName: 'Readme.lk',
    sourceUrl: 'https://readme.lk',
    publishedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    readTimeMinutes: 4,
    isBreaking: false,
    clusterCount: 2,
    perspectives: [
      {
        publisherName: 'The Morning',
        publisherSlug: 'the-morning',
        sourceUrl: 'https://www.themorning.lk',
        headline: 'SL-UDI rollout to streamline public service delivery across ministries',
        publishedAt: '1h ago'
      }
    ]
  },
  {
    id: 'ceylon-tea-exports-surge',
    title: {
      en: 'Ceylon Tea Export Earnings Hit Highest Mark in 3 Years Amid Strong Middle East & European Demand',
      si: 'මැදපෙරදිග සහ යුරෝපීය ඉල්ලුම හමුවේ ලංකා තේ අපනයන ආදායම වසර 3 ක උපරිම අගය සටහන් කරයි',
      ta: 'மத்திய கிழக்கு மற்றும் ஐரோப்பிய தேவையின் மத்தியில் சிலோன் தேயிலை ஏற்றுமதி வருமானம் 3 ஆண்டுகளில் சாதனை'
    },
    summary: {
      en: 'Sri Lanka Tea Board reports monthly export revenue crossing $135 million, driven by high auction prices for orthodox black tea and renewed demand from Turkish and UAE buyers.',
      si: 'ඕතඩොක්ස් කළු තේ සඳහා ලැබුණු ඉහළ වෙන්දේසි මිල සහ තුර්කි හා එක්සත් අරාබි එමීර් රාජ්‍යයේ ඉහළ ඉල්ලුම හේතුවෙන් මාසික අපනයන ආදායම ඩොලර් මිලියන 135 ඉක්මවා ඇත.',
      ta: 'துருக்கி மற்றும் ஐக்கிய அரபு இராச்சியத்தின் கேள்வி காரணமாக இலங்கை தேயிலை ஏற்றுமதி வருவாய் 135 மில்லியன் டொலர்களைத் தாண்டியுள்ளது.'
    },
    aiBullets: {
      en: [
        'Total export volume expanded by 14.8% year-on-year in the high-grown and medium-grown orthodox categories.',
        'Average auction prices reached LKR 1,320 per kilo at the Colombo Tea Auction.',
        'Planters push for increased automation and soil enrichment to counter fertilizer cost fluctuations.'
      ],
      si: [
        'උඩරට සහ මැදරට ඕතඩොක්ස් තේ අපනයන පරිමාව පසුගිය වසරට සාපේක්ෂව 14.8% කින් වර්ධනය විය.',
        'කොළඹ තේ වෙන්දේසියේදී සාමාන්‍ය කිලෝවක මිල රුපියල් 1,320 ක් ලෙස සටහන් විය.',
        'පොහොර පිරිවැය කළමනාකරණය සඳහා නවීන තාක්ෂණය යොදාගැනීමට වතු සමාගම් යොමුවෙයි.'
      ],
      ta: [
        'உயர் மற்றும் நடுத்தர தேயிலை ஏற்றுமதி அளவு கடந்த ஆண்டை விட 14.8% அதிகரித்துள்ளது.',
        'கொழும்பு தேயிலை ஏலத்தில் சராசரி கிலோ விலை 1,320 ரூபாயாகப் பதிவாகியுள்ளது.'
      ]
    },
    sentiment: 'positive',
    category: 'economy',
    region: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    publisherName: 'Daily FT',
    sourceUrl: 'https://www.ft.lk',
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    readTimeMinutes: 3,
    isBreaking: false,
    clusterCount: 3
  },
  {
    id: 'sl-cricket-asia-cup-preview',
    title: {
      en: 'Sri Lanka Cricket Unveils Revamped T20 Squad with Young Pace Talent Ahead of Continental Tournament',
      si: 'මහාද්වීපික තරගාවලිය ඉලක්ක කරමින් තරුණ වේගපන්දු බලඇණියක් සහිතව ශ්‍රී ලංකා විස්සයි20 සංචිතය නම් කෙරේ',
      ta: 'ஆசியக் கிண்ணத் தொடருக்கு முன்னதாக இளம் வேகப்பந்து வீச்சாளர்களுடன் இலங்கை ரி20 அணி அறிவிப்பு'
    },
    summary: {
      en: 'Sri Lanka Cricket selectors have finalized a balanced 16-member squad featuring promising fast bowlers from the National Super League alongside seasoned spinners Wanindu Hasaranga and Maheesh Theekshana.',
      si: 'වනිඳු හසරංග සහ මහීෂ් තීක්ෂණ සමඟින් නැෂනල් සුපර් ලීග් තරගාවලියේ දස්කම් දැක්වූ තරුණ වේගපන්දු යවන්නන් ඇතුළත් සාමාජිකයින් 16 දෙනෙකුගෙන් යුත් සංචිතයක් නම් කෙරිණි.',
      ta: 'வனிந்து ஹசரங்க மற்றும் மகீஷ் தீக்ஷன ஆகியோருடன் வளர்ந்து வரும் இளம் வேகப்பந்து வீச்சாளர்களை உள்ளடக்கிய 16 பேர் கொண்ட அணி அறிவிக்கப்பட்டுள்ளது.'
    },
    aiBullets: {
      en: [
        'Two uncapped fast bowlers clocking 145km/h+ drafted into the senior lineup for depth.',
        'Aggressive top-order batting approach reinforced following recent series performance in England.',
        'High-intensity training camp begins at the R. Premadasa International Cricket Stadium on Thursday.'
      ],
      si: [
        'පැයට කිලෝමීටර් 145 ඉක්මවන වේගයෙන් පන්දු යවන නවක ක්‍රීඩකයින් දෙදෙනෙක් සංචිතයට.',
        'ආක්‍රමණශීලී පිතිකරණ සැලසුම් පිළිබඳ අවධානය යොමුකෙරේ.',
        'විශේෂ පුහුණු කඳවුර බ්‍රහස්පතින්දා ආර්. ප්‍රේමදාස ක්‍රීඩාංගණයේදී ඇරඹේ.'
      ],
      ta: [
        '145 கி.மீ வேகத்தில் பந்துவீசக்கூடிய இரண்டு இளம் வீரர்கள் அணியில் சேர்க்கப்பட்டுள்ளனர்.',
        'ஆர். பிரேமதாச மைதானத்தில் தீவிர பயிற்சி முகாம் வியாழக்கிழமை ஆரம்பமாகிறது.'
      ]
    },
    sentiment: 'neutral',
    category: 'sports',
    region: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    publisherName: 'Daily Mirror',
    sourceUrl: 'https://www.dailymirror.lk',
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    readTimeMinutes: 2,
    isBreaking: false,
    clusterCount: 2
  },
  {
    id: 'colombo-port-city-financial-zone',
    title: {
      en: 'Colombo Port City Grants Licences to 8 Multi-National Tech & Financial Hubs Under Special Regulations',
      si: 'විශේෂ නියාමනයන් යටතේ බහුජාතික තාක්ෂණික හා මූල්‍ය මධ්‍යස්ථාන 8කට කොළඹ වරාය නගරයේ මෙහෙයුම් බලපත්‍ර',
      ta: 'கொழும்பு துறைமுக நகரத்தில் 8 பல்தேசிய நிதி மற்றும் தொழில்நுட்ப நிறுவனங்களுக்கு விசேட அனுமதிப்பத்திரம்'
    },
    summary: {
      en: 'The Colombo Port City Economic Commission has issued Authorised Person licences to leading global fintech, wealth management, and engineering service providers, marking a major milestone for foreign direct investment.',
      si: 'කොළඹ වරාය නගර ආර්ථික කොමිසම විසින් ගෝලීය ෆින්ටෙක්, වත්කම් කළමනාකරණ සහ ඉංජිනේරු සේවා සපයන්නන් වෙත බලයලත් පුද්ගල බලපත්‍ර නිකුත් කර තිබේ.',
      ta: 'கொழும்பு துறைமுக நகர பொருளாதார ஆணைக்குழு சர்வதேச நிறுவனங்களுக்கு உத்தியோகபூர்வ தொழிற்பாட்டு அனுமதிகளை வழங்கியுள்ளது.'
    },
    aiBullets: {
      en: [
        'Projected initial foreign direct investment inflow of over $240 million across 18 months.',
        'Over 3,500 high-skilled white-collar technology and finance jobs created for Sri Lankan professionals.',
        'Tax-free regulatory zone incentives provide competitive advantage against regional financial centers.'
      ],
      si: [
        'ඉදිරි මාස 18 තුළ ඩොලර් මිලියන 240 කට අධික සෘජු විදේශ ආයෝජන අපේක්ෂා කෙරේ.',
        'ශ්‍රී ලාංකික තරුණ වෘත්තිකයින් සඳහා ඉහළ වැටුප් සහිත රැකියා 3,500 ක් උත්පාදනය වේ.',
        'කලාපීය මූල්‍ය මධ්‍යස්ථාන සමඟ තරගකාරී විය හැකි ආකර්ෂණීය බදු සහන ක්‍රියාත්මකයි.'
      ],
      ta: [
        'அடுத்த 18 மாதங்களில் 240 மில்லியன் டொலருக்கும் அதிகமான நேரடி வெளிநாட்டு முதலீடு எதிர்பார்க்கப்படுகிறது.',
        'இலங்கை பட்டதாரிகளுக்கு 3,500 க்கும் மேற்பட்ட உயர் தொழில்நுட்ப வேலைவாய்ப்புகள் உருவாக்கப்படும்.'
      ]
    },
    sentiment: 'positive',
    category: 'economy',
    region: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    publisherName: 'Daily FT',
    sourceUrl: 'https://www.ft.lk',
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    readTimeMinutes: 4,
    isBreaking: false,
    clusterCount: 2
  },
  {
    id: 'parliament-anti-corruption-framework',
    title: {
      en: 'Parliamentary Committee Tables Comprehensive New Anti-Corruption Digital Declaration Framework',
      si: 'වංචා හා දූෂණ වැළැක්වීමේ විධිමත් නව ඩිජිටල් ප්‍රකාශන රාමුවක් පාර්ලිමේන්තු කාරක සභාව විසින් සභාගත කරයි',
      ta: 'விரிவான புதிய ஊழல் எதிர்ப்பு டிஜிட்டல் பிரகடனக் கட்டமைப்பை நாடாளுமன்றக் குழு சமர்ப்பித்தது'
    },
    summary: {
      en: 'In a significant legislative breakthrough, the Parliamentary Select Committee on Governance has submitted a sweeping digital asset disclosure mechanism applicable to all public officials, ministers, and heads of state corporations.',
      si: 'රාජ්‍ය පාලනයේ විනිවිදභාවය තහවුරු කිරීමේ අරමුණින්, සියලුම මහජන නියෝජිතයන් සහ රාජ්‍ය ආයතන ප්‍රධානීන් සඳහා වන සවිස්තරාත්මක ඩිජිටල් වත්කම් ප්‍රකාශන නීති රාමුවක් පාර්ලිමේන්තුවට ඉදිරිපත් කර තිබේ.',
      ta: 'அரசுப் பிரதிநிதிகள் மற்றும் அரச நிறுவனத் தலைவர்கள் தமது சொத்துக்களை கட்டாயமாக டிஜிட்டல் மூலம் வெளிப்படுத்தும் புதிய நடைமுறை நாடாளுமன்றத்தில் சமர்ப்பிக்கப்பட்டது.'
    },
    aiBullets: {
      en: [
        'Mandatory online declaration of domestic and offshore assets required annually by March 31.',
        'Independent protection unit established to prevent retaliation against anti-graft whistleblowers.',
        'International cross-border recovery agreements strengthened with UK and Singapore financial authorities.'
      ],
      si: [
        'සියලුම පාර්ලිමේන්තු මන්ත්‍රීවරුන් සහ රාජ්‍ය සංස්ථා ප්‍රධානීන් වාර්ෂික ඩිජිටල් ප්‍රකාශන ඉදිරිපත් කළ යුතුය.',
        'දූෂණ විරෝධී තොරතුරු හෙළිකරන්නන් ආරක්ෂා කිරීම සඳහා ස්වාධීන ඒකකයක් ස්ථාපිත කෙරේ.',
        'විදේශයන්හි සඟවා ඇති වත්කම් නැවත අයකර ගැනීම සඳහා එක්සත් රාජධානිය සහ සිංගප්පූරුව සමඟ ගිවිසුම් තර කෙරේ.'
      ],
      ta: [
        'அனைத்து நாடாளுமன்ற உறுப்பினர்களும் ஆண்டுதோறும் டிஜிட்டல் முறைப்படி சொத்துக்களை தாக்கல் செய்ய வேண்டும்.',
        'ஊழல் எதிர்ப்பு தகவலாளர்களைப் பாதுகாக்க தனி விசேட பிரிவு நிறுவப்படவுள்ளது.'
      ]
    },
    sentiment: 'neutral',
    category: 'politics',
    region: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    publisherName: 'NewsFirst',
    sourceUrl: 'https://newsfirst.lk',
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    readTimeMinutes: 3,
    isBreaking: false,
    clusterCount: 3
  },
  {
    id: 'world-imf-global-economic-outlook',
    title: {
      en: 'IMF Warns of Global Trade Fragmentation as Asian Central Banks Recalibrate Monetary Easing',
      si: 'ආසියානු මහ බැංකු මුදල් ප්‍රතිපත්ති ලිහිල් කරද්දී ගෝලීය වෙළඳපොළ බෙදීයාමේ අවදානමක් ගැන ජාත්‍යන්තර මූල්‍ය අරමුදල අනතුරු අඟවයි',
      ta: 'ஆசிய மத்திய வங்கிகள் நாணயக் கொள்கையை தளர்த்தும்போது உலக வர்த்தக முறிவு குறித்து சர்வதேச நாணய நிதியம் எச்சரிக்கை'
    },
    summary: {
      en: 'The International Monetary Fund released its updated World Economic Outlook, cautioning emerging markets against escalating geopolitical tensions, maritime freight rerouting, and volatile commodity pricing.',
      si: 'භූදේශපාලනික අර්බුද සහ නාවික ප්‍රවාහන වියදම් ඉහළ යාම හමුවේ සංවර්ධනය වෙමින් පවතින ආසියානු රටවල් තම විදේශ විනිමය සංචිත ආරක්ෂා කරගත යුතු බව ජාත්‍යන්තර මූල්‍ය අරමුදල පෙන්වා දෙයි.',
      ta: 'பூகோள அரசியல் பதற்றங்கள் மற்றும் கடல் சரக்கு செலவுகள் அதிகரிக்கும் சூழ்நிலையில் வளரும் நாடுகள் தமது கையிருப்பை பாதுகாக்க வேண்டும் என சர்வதேச நாணய நிதியம் தெரிவித்துள்ளது.'
    },
    aiBullets: {
      en: [
        'Global growth forecast adjusted to 3.2% amid resilient developing market demand.',
        'Red Sea and maritime shipping disruptions continue to put upward pressure on transit premiums.',
        'Asian central banks encouraged to maintain robust external foreign exchange buffers.'
      ],
      si: [
        'සංවර්ධනය වෙමින් පවතින රටවල ශක්තිමත් ඉල්ලුම මත ගෝලීය ආර්ථික වර්ධනය 3.2% ක් ලෙස පුරෝකථනය කර ඇත.',
        'රතු මුහුදේ නාවික බාධා හේතුවෙන් භාණ්ඩ ප්‍රවාහන ගාස්තු ඉහළ මට්ටමක පවතී.'
      ],
      ta: [
        'வளரும் நாடுகளின் தேவை காரணமாக உலகப் பொருளாதார வளர்ச்சி 3.2% ஆகக் கணிக்கப்பட்டுள்ளது.',
        'செங்கடல் கப்பல் போக்குவரத்து இடையூறுகளால் சரக்குக் கட்டணம் தொடர்ந்து உயர்ந்து வருகிறது.'
      ]
    },
    sentiment: 'neutral',
    category: 'economy',
    region: 'world',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    publisherName: 'Reuters Global',
    sourceUrl: 'https://reuters.com',
    publishedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    readTimeMinutes: 4,
    isBreaking: false,
    clusterCount: 3
  },
  {
    id: 'world-un-climate-financing-accord',
    title: {
      en: 'UN Summit Reaches Historic Multi-Billion Dollar Loss and Damage Climate Accord for Island Nations',
      si: 'දිවයින් රටවල් සඳහා වූ ඓතිහාසික දේශගුණික අලාභ හා හානි අරමුදල පිළිබඳ එක්සත් ජාතීන්ගේ සමුළුවේදී එකඟතාවක්',
      ta: 'தீவு நாடுகளுக்கான வரலாற்று சிறப்புமிக்க பல பில்லியன் டொலர் காலநிலை இழப்பீடு மற்றும் சேத உடன்படிக்கை'
    },
    summary: {
      en: 'Delegates from 190 nations at the UN Climate Framework Summit have ratified a landmark capital disbursement agreement delivering direct climate resilience grants to vulnerable coastal and island economies.',
      si: 'දේශගුණික විපර්යාසවලින් දැඩි බලපෑමට ලක්වන වෙරළබඩ සහ දිවයින් ආර්ථිකයන් සඳහා සෘජු ආධාර ලබාදෙන ඓතිහාසික මූල්‍ය සම්මුතියකට එක්සත් ජාතීන්ගේ සාමාජික රටවල් 190 ක් අත්සන් තබා ඇත.',
      ta: 'காலநிலை மாற்றத்தால் பாதிக்கப்படக்கூடிய கடலோர மற்றும் தீவு நாடுகளுக்கு நேரடி நிவாரண நிதி வழங்கும் வரலாற்று ஒப்பந்தத்தில் 190 நாடுகள் கையெழுத்திட்டன.'
    },
    aiBullets: {
      en: [
        'Initial capitalization of $14 billion committed by OECD development partners.',
        'Automatic trigger payouts based on satellite radar storm surge and extreme rainfall metrics.',
        'Direct bilateral grant windows established for Indo-Pacific and South Asian littoral states.'
      ],
      si: [
        'සංවර්ධිත රටවල් විසින් මූලික වශයෙන් ඩොලර් බිලියන 14 ක මූල්‍ය ප්‍රතිපාදන වෙන් කිරීමට එකඟ වී ඇත.',
        'චන්ද්‍රිකා තාක්ෂණය ඔස්සේ ආපදා තක්සේරු කර කඩිනමින් මුදල් මුදාහැරීමේ ක්‍රමවේදයක් හඳුන්වා දෙනු ලැබේ.'
      ],
      ta: [
        'வளர்ந்த நாடுகள் ஆரம்ப நிதியாக 14 பில்லியன் டொலர்களை வழங்க ஒப்புக்கொண்டுள்ளன.',
        'செயற்கைக்கோள் தரவுகளின் அடிப்படையில் உடனடியாக இழப்பீட்டு நிதி விடுவிக்கப்படும்.'
      ]
    },
    sentiment: 'positive',
    category: 'breaking',
    region: 'world',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    publisherName: 'BBC World News',
    sourceUrl: 'https://www.bbc.com/news/world',
    publishedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    readTimeMinutes: 3,
    isBreaking: true,
    clusterCount: 4
  }
];

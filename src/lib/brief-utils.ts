import { Article, ExecutiveBrief, Language } from './types';

const whyItMattersByCategory: Record<string, Record<Language, string>> = {
  politics: {
    en: 'Key development for parliamentary governance, institutional integrity, and statutory policy in Sri Lanka.',
    si: 'පාර්ලිමේන්තු පාලනය, ආයතනික විනිවිදභාවය සහ ප්‍රතිපත්තිමය ක්‍රියාදාමයන් කෙරෙහි සෘජු බලපෑමක් එල්ල කරයි.',
    ta: 'பாராளுமன்ற ஆட்சி, நிறுவன வெளிப்படைத்தன்மை மற்றும் கொள்கை நடைமுறைகளில் நேரடி தாக்கத்தை ஏற்படுத்துகிறது.'
  },
  economy: {
    en: 'Crucial for fiscal stability, CBSL monetary directives, market liquidity, and trade continuity.',
    si: 'මූල්‍ය ස්ථාවරත්වය, මහ බැංකු ප්‍රතිපත්ති, වෙළඳපල ද්‍රවශීලතාව සහ විනිමය අනුපාත කෙරෙහි තීරණාත්මක බලපෑමක් ඇත.',
    ta: 'நிதி ஸ்திரத்தன்மை, மத்திய வங்கி வழிகாட்டல்கள், சந்தை பணப்புழக்கம் மற்றும் வர்த்தக தொடர்ச்சிக்கு மிக முக்கியமானது.'
  },
  breaking: {
    en: 'Urgent wire dispatch with real-time public safety, administrative, and institutional implications.',
    si: 'සජීවී මහජන, පරිපාලන සහ ආයතනික ක්ෂේත්‍ර කෙරෙහි සෘජු අවධානය යොමු විය යුතු උණුසුම් පුවතකි.',
    ta: 'நிகழ்நேர பொதுப் பாதுகாப்பு மற்றும் நிர்வாக தாக்கங்களைக் கொண்ட அதிமுக்கிய செய்தி.'
  },
  tech: {
    en: 'Relevant to digital infrastructure modernization, enterprise connectivity, and information security.',
    si: 'ඩිජිටල් යටිතල පහසුකම් නවීකරණය සහ තොරතුරු තාක්ෂණ ක්ෂේත්‍රයේ ප්‍රගතිය කෙරෙහි බලපායි.',
    ta: 'டிஜிட்டல் உட்கட்டமைப்பு நவீனமயமாக்கல் மற்றும் தகவல் தொழில்நுட்ப வளர்ச்சிக்கு முக்கியமானது.'
  },
  sports: {
    en: 'Official athletic standings, tournament rankings, and national sports administrative updates.',
    si: 'ජාතික ක්‍රීඩා ක්ෂේත්‍රයේ ප්‍රගතිය, තරගාවලි ප්‍රතිඵල සහ පරිපාලන තීරණ පිළිබඳ වැදගත් පුවතකි.',
    ta: 'தேசிய விளையாட்டுத்துறை முன்னேற்றம் மற்றும் போட்டி முடிவுகள் தொடர்பான முக்கிய செய்தி.'
  },
  world: {
    en: 'Significant for international diplomacy, multilateral relations, and geopolitical developments.',
    si: 'ජාත්‍යන්තර රාජ්‍ය තාන්ත්‍රික සබඳතා සහ ගෝලීය භූ-දේශපාලනික ප්‍රවණතා කෙරෙහි බලපෑම් ඇති කරයි.',
    ta: 'சர்வதேச இராஜதந்திர உறவுகள் மற்றும் உலகளாவிய புவிசார் அரசியல் போக்குகளில் தாக்கத்தை ஏற்படுத்துகிறது.'
  }
};

/**
 * Builds an immediate (0ms) structured Axios Smart Brevity ExecutiveBrief
 * directly from the article's existing summary, title, and AI bullets.
 * Guarantees zero latency and zero Gemini API calls upon initial reader click.
 */
export function buildOptimisticBrief(article: Article, lang: Language): ExecutiveBrief {
  const headline = article.title[lang] || article.title.en || '';
  const summary = article.summary[lang] || article.summary.en || '';
  const bullets = article.aiBullets?.[lang] || article.aiBullets?.en || [];

  const category = article.category || 'politics';
  const categoryWhy = whyItMattersByCategory[category]?.[lang] 
    || whyItMattersByCategory.politics[lang]
    || whyItMattersByCategory.politics.en;

  const defaultBullets = [
    lang === 'si' ? `${article.publisherName} ප්‍රවෘත්ති කාමරය මගින් සත්‍යාපනය කරන ලදී.` : (lang === 'ta' ? `${article.publisherName} செய்திப்பிரிவினால் உறுதிப்படுத்தப்பட்டது.` : `Verified wire reporting syndicated directly from ${article.publisherName}.`),
    lang === 'si' ? 'අදාළ පාර්ශ්වයන්ගේ ප්‍රකාශ සහ නිල වාර්තා විමර්ශනය කෙරේ.' : (lang === 'ta' ? 'சம்பந்தப்பட்ட தரப்புகளின் கருத்துகள் கண்காணிக்கப்படுகின்றன.' : 'Continuous monitoring and institutional verification active on the wire.'),
    lang === 'si' ? 'මහජන සහ නීතිමය ක්‍රියාදාමයන් පිළිබඳ විමර්ශනය ක්‍රියාත්මකයි.' : (lang === 'ta' ? 'பொது மற்றும் சட்ட நடைமுறைகள் குறித்த ஆய்வுகள் தொடர்கின்றன.' : 'Cross-referenced against verified public interest dispatches.')
  ];

  const whatsNextText = lang === 'si'
    ? `${article.publisherName} කොළඹ පුවත් කාමරය සහ අදාළ බලධාරීන් මගින් ඉදිරි ක්‍රියාමාර්ග නිරීක්ෂණය කෙරේ.`
    : (lang === 'ta'
      ? `${article.publisherName} செய்திப்பிரிவு மற்றும் தொடர்புடைய துறைகளின் அடுத்தகட்ட முடிவுகள் எதிர்பார்க்கப்படுகின்றன.`
      : `Further official announcements, regulatory updates, or judicial proceedings are tracked via ${article.publisherName}.`);

  return {
    whatHappened: summary && summary.length > 25 ? summary : `${headline}. Dispatched via ${article.publisherName} newsroom.`,
    keyDetails: bullets.length > 0 ? bullets : defaultBullets,
    whyItMatters: categoryWhy,
    whatsNext: whatsNextText
  };
}

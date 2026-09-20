export function formatRelativeTime(dateString: string, lang: 'en' | 'si' | 'ta' = 'en'): string {
  try {
    const pubTime = new Date(dateString).getTime();
    if (isNaN(pubTime)) return '';
    const diffSecs = Math.floor(Math.max(0, Date.now() - pubTime) / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (lang === 'si') {
      if (diffMins < 2) return 'දැන් සුළු මොහොතකට පෙර';
      if (diffMins < 60) return `මිනිත්තු ${diffMins} කට පෙර`;
      if (diffHours < 24) return `පැය ${diffHours} කට පෙර`;
      return `දින ${diffDays} කට පෙර`;
    }

    if (lang === 'ta') {
      if (diffMins < 2) return 'சற்று முன்';
      if (diffMins < 60) return `${diffMins} நிமிடங்களுக்கு முன்`;
      if (diffHours < 24) return `${diffHours} மணி நேரத்திற்கு முன்`;
      return `${diffDays} நாட்களுக்கு முன்`;
    }

    // Default English
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return '';
  }
}

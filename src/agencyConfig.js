/** Central branding & agency contact — edit here only (not exposed in Admin UI). */
export const agencyConfig = {
  agencyName: "BL Media Group",
  tagline: 'פותח ונוצר ע"י BL Media Group • פתרונות דיגיטל ופיתוח AI',
  /** International format, no leading 0 (e.g. 972501234567) */
  whatsappNumber: "972XXXXXXXXX",
  websiteUrl: "https://your-domain.com",
  whatsappLeadMessage:
    "היי, ראיתי את האתר של מוניות דוד ואשמח לשמוע על בניית אתר/אפליקציה לעסק שלי",
};

export function getAgencyWhatsAppUrl() {
  const text = encodeURIComponent(agencyConfig.whatsappLeadMessage);
  return `https://wa.me/${agencyConfig.whatsappNumber}?text=${text}`;
}

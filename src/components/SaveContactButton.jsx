import { UserPlus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { downloadDavidContact } from "../utils/vcard";

export default function SaveContactButton({ className = "" }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={downloadDavidContact}
      className={`btn-secondary min-h-12 px-5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      <UserPlus className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
      {t("common.saveContact")}
    </button>
  );
}

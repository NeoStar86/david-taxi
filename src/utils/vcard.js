import { site } from "../content";

export function downloadDavidContact() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:;דוד מוניות והסעות;;;",
    "FN:דוד מוניות והסעות",
    `ORG:${site.nameEn}`,
    `TEL;TYPE=CELL,VOICE:${site.phoneTel}`,
    "NOTE:מוניות והסעות 24/7",
    "END:VCARD",
  ].join("\r\n");

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "david-taxi.vcf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

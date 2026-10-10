import { useEffect } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { applyTheme } from "../utils/applyTheme";

export default function ThemeApplier() {
  const { data } = useSiteData();

  useEffect(() => {
    applyTheme(data.theme);
  }, [data.theme]);

  return null;
}

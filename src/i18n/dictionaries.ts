import en from "./en.json";
import id from "./id.json";

export type Locale = "en" | "id";

const dictionaries: Record<Locale, typeof en> = {
  en,
  id,
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries["en"];
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === "en" || locale === "id";
}

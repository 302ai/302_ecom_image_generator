'use client'
import zh from "./zh";
import en from "./en";
import ja from "./ja";
import SystemManager from "@/utils/System";

import type { LocaleType } from "./zh";
export type { LocaleType, PartialLocaleType } from "./zh";

const ALL_LANGS = {
  zh,
  en,
  ja,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  zh: "中文",
  en: "English",
  ja: "Japennise",
};

const LANG_KEY = "gpt-translator-lang-v2";
const DEFAULT_LANG = "en";

const fallbackLang = en;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// if target lang missing some fields, it will use fallback lang string
SystemManager.mergeData(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch { }
}


function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  // url
  if (typeof (window) !== 'undefined') {
    let urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang === 'zh-CN') urlLang = 'zh'
    if (urlLang === 'en-US') urlLang = 'en'
    if (urlLang === 'ja-JP') urlLang = 'ja'
    if (AllLangs.includes((urlLang ?? "") as Lang)) {
      return urlLang as Lang;
    }
  }

  // local
  const savedLang = getItem(LANG_KEY);
  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  // browser
  const lang = getLanguage();
  for (const option of AllLangs) {
    if (lang.includes(option)) {
      return option;
    }
  }

  return DEFAULT_LANG;
}

export function changeLang(lang: Lang | string) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export function setLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  // location.reload();
}
export function getISOLang() {
  const isoLangString: Record<string, string> = {
    cn: "zh-Hans",
    tw: "zh-Hant",
  };

  const lang = getLang();
  return isoLangString[lang] ?? lang;
}

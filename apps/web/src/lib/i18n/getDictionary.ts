import 'server-only';

const dictionaries = {
  en: () => import('../../../public/locales/en.json').then((module) => module.default),
  pl: () => import('../../../public/locales/pl.json').then((module) => module.default),
  de: () => import('../../../public/locales/de.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (!locale || !dictionaries[locale as keyof typeof dictionaries]) {
    return dictionaries.en();
  }
  return dictionaries[locale as keyof typeof dictionaries]();
};

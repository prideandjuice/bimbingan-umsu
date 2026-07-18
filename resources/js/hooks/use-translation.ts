import { useLanguageStore, dictionary } from '@/stores/useLanguageStore';

export function useTranslation() {
    const { locale, setLocale } = useLanguageStore();

    const t = (key: string): string => {
        const dict = dictionary[locale] || dictionary.id;
        return dict[key] || key;
    };

    return { t, locale, setLocale };
}

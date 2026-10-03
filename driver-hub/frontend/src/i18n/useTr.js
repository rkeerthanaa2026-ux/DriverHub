import { useTranslation } from "react-i18next";
import { KN } from "./kn";

// tr("English text") -> Kannada when the toggle is on, otherwise the same English text
export default function useTr() {
    const { i18n } = useTranslation();
    const isKn = (i18n.resolvedLanguage || i18n.language || "").startsWith("kn");
    const tr = (text) => (isKn && KN[text]) || text;
    return { tr, isKn };
}
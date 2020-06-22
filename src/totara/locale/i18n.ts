import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/de";

// @ts-ignore
import * as en from "@totara/locale/languages/en.json";

const translations = { en };
const { languageTag } = RNLocalize.findBestAvailableLanguage(
  Object.keys(translations)
) || { languageTag: "en" };
i18n.defaultLocale = "en";
i18n.locale = languageTag;
i18n.fallbacks = true;
i18n.translations = translations;

moment.locale(i18n.locale);

export default i18n;

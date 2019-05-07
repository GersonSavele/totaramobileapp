import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import * as en from "@totara/locale/languages/en.json";
import * as fr from "@totara/locale/languages/fr.json";

const translations = { en, fr };
const { languageTag } = RNLocalize.findBestAvailableLanguage(
  Object.keys(translations),
) || { languageTag: 'en' };
i18n.defaultLocale = "en";
i18n.locale = languageTag;
i18n.fallbacks = true;
i18n.translations = translations;


export default i18n;

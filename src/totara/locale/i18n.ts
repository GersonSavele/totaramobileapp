import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/de";

import * as en from "@totara/locale/languages/en.json";
import * as fr from "@totara/locale/languages/fr.json";
import * as de from "@totara/locale/languages/de.json";



const translations = { en, fr, de };
const { languageTag } = RNLocalize.findBestAvailableLanguage(
  Object.keys(translations),
) || { languageTag: 'en' };
i18n.defaultLocale = "en";
i18n.locale = languageTag;
i18n.fallbacks = true;
i18n.translations = translations;

moment.locale(i18n.locale);

export default i18n;

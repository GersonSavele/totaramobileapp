/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import "moment/min/locales";

import { DEFAULT_LANGUAGE } from "@totara/lib/constants";
import { I18n } from "i18n-js";
import moment from "moment";
import * as RNLocalize from "react-native-localize";

// if the all.json is not being generated automatically by the post install script for any reason, comment the following line and uncomment the next ones to specify one or more pre defined translations
import importedTranslations from "./languages/all.json";
// import * as en from "./languages/en.json";
const translations = importedTranslations;

const { languageTag } = RNLocalize.findBestLanguageTag(Object.keys(translations)) || {
  languageTag: DEFAULT_LANGUAGE
};

const i18n = new I18n();
i18n.defaultLocale = languageTag;
i18n.locale = languageTag;
i18n.enableFallback = true;
i18n.translations = translations;

moment.locale(i18n.locale);

export default i18n;

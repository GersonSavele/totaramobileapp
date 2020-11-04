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

import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import moment from "moment";

// if you cannot have this all.json working properly for any reason, just import en.json instead.
import * as translations from "./languages/all.json";

const { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(translations)) || { languageTag: "en" };
i18n.defaultLocale = languageTag;
i18n.locale = languageTag;
i18n.fallbacks = true;
i18n.translations = translations;

moment.locale(i18n.locale);

export default i18n;

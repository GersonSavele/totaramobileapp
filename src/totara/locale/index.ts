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

import type { ApolloClient } from '@apollo/client';
import { DEFAULT_LANGUAGE } from '@totara/lib/constants';
import type { Scope, TranslateOptions } from 'i18n-js';
import { merge } from 'lodash';

import { queryLanguageStrings } from './api';
import i18n from './i18n';

const translate = (scope: Scope, options?: TranslateOptions) => {
  return i18n.t(scope, options);
};

const addLocale = (locale: string, json: any) => {
  i18n.translations[locale] = json;
};

const changeLocale = (locale: string) => {
  i18n.locale = locale;
};

const getLocale = () => {
  return i18n.locale;
};

const getTranslations = () => {
  return i18n.translations;
};

type SetUpProps = { client: ApolloClient<object>; languagePreference: string; onFinish: Function };

const setUpLocale = ({ client, languagePreference, onFinish }: SetUpProps) => {
  if (languagePreference === 'en') {
    //no need to proceed with API call because english is bundled in the App
    onFinish();
  }
  client
    .query({
      query: queryLanguageStrings,
      variables: {
        lang: languagePreference
      }
    })
    .then(result => {
      if (result.data) {
        // This custom strings comes from the totara instance API
        const customAppStrings = JSON.parse(result.data.json_string).app;
        // This one comes straight from AMOS, generated in build time
        const translations = getTranslations();

        const defaultLanguage = translations[DEFAULT_LANGUAGE] || {};
        const currentAppStrings = translations[languagePreference] || defaultLanguage;

        const merged = {};
        merge(merged, defaultLanguage, currentAppStrings, customAppStrings);

        addLocale(languagePreference!, merged);
        onFinish();
      }
    })
    .finally(() => {
      onFinish();
    });
};

export { addLocale, changeLocale, getLocale, getTranslations, setUpLocale, translate };

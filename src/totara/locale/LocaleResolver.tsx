/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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

import React, { useState, useEffect, ReactNode } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { queryLanguageStrings, queryUserLanguagePreference } from "@totara/locale/api";
import { Loading } from "@totara/components";
import { addLocale, changeLocale, getLocale, getTranslations } from "@totara/locale/index";
import { merge } from "lodash";

const LocaleResolver = ({ children }: { children: ReactNode }) => {
  const [languagePreference, setLanguagePreference] = useState<string>();
  const [languageStringLoaded, setLanguageStringLoaded] = useState<boolean>();
  const client = useApolloClient();

  useEffect(() => {
    if (!languagePreference) {
      client
        .query({
          query: queryUserLanguagePreference
        })
        .then((result) => {
          if (result.data) {
            const lang = result.data.me?.user?.lang;
            if (lang) {
              setLanguagePreference(lang);
            } else setLanguagePreference(getLocale());
          }
        })
        .catch(() => {
          setLanguagePreference(getLocale());
        });
    }
  }, [languagePreference]);

  useEffect(() => {
    if (languagePreference && !languageStringLoaded) {
      client
        .query({
          query: queryLanguageStrings,
          variables: {
            lang: languagePreference
          }
        })
        .then((result) => {
          if (result.data) {
            const customAppStrings = JSON.parse(result.data.json_string).app;
            const currentAppStrings = getTranslations()[languagePreference];

            if (customAppStrings && currentAppStrings) merge(currentAppStrings, customAppStrings);

            if (customAppStrings) {
              addLocale(languagePreference!, currentAppStrings);
              changeLocale(languagePreference!);
            }
          }
        })
        .finally(() => {
          setLanguageStringLoaded(true);
        });
    }
  }, [languagePreference, languageStringLoaded]);

  const languageStringsLoaded = languagePreference && languageStringLoaded;

  return languageStringsLoaded ? children : <Loading />;
};

export { LocaleResolver };

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

import { useEffect, useReducer } from "react";

import { config } from "@totara/lib";
import { translate } from "@totara/locale";
import { isValidUrlText } from "@totara/lib/tools";
import { fetchData } from "@totara/core/AuthRoutines";
import { SiteInfo } from "@totara/types/SiteInfo";
import { getVersion } from "react-native-device-info";

export const useSiteUrl = ({ siteUrl, onSiteInfoDone }: Props) => {
  const [siteUrlState, dispatch] = useReducer(siteUrlReducer, {
    inputSiteUrlStatus: undefined,
    inputSiteUrlMessage: undefined,
    inputSiteUrl: siteUrl
  });

  useEffect(() => {
    if (siteUrlState.inputSiteUrlStatus === 'fetching') {

      // eslint-disable-next-line no-undef
      const fetchDataWithFetch = fetchData(fetch);
      const onSubmitCall = fetchDataWithFetch<SiteInfo>(config.infoUri(siteUrlState.inputSiteUrl!), {
        method: "POST",
        body: JSON.stringify({ version: getVersion() })
      });

      onSubmitCall.then(result => {
        dispatch({ type: "done" })
        onSiteInfoDone(result);
      }).catch(error => {
        console.log(error);
        dispatch({ type: "error", payload: error.message })
      });
    }
  }, [siteUrlState.inputSiteUrlStatus])

  const onSubmit = (siteUrl: string) => {
    dispatch({ type: "submit", payload: siteUrl });
  };

  const onChangeInputSiteUrl = (siteUrl: string) => {
    dispatch({ type: "change", payload: siteUrl });
  };

  return {
    siteUrlState,
    onChangeInputSiteUrl,
    onSubmit,
  };
};


const siteUrlReducer = (state: State, action: Action): State => {

  switch (action.type) {
    case "submit": {
      if (action.payload && isValidUrlText(action.payload)) {
        return {
          ...state,
          inputSiteUrl: formatUrl(action.payload || ""),
          inputSiteUrlStatus: "fetching"
        };
      } else {
        return {
          ...state,
          inputSiteUrlStatus: "error",
          inputSiteUrlMessage: translate("site_url.validation.enter_valid_url")
        };
      }
    }
    case "done": {
      return {
        ...state,
        inputSiteUrlStatus: "done"
      }
    }
    case "change": {
      return {
        ...state,
        inputSiteUrl: action.payload
      };
    }
    case "error": {
      return {
        ...state,
        inputSiteUrlStatus: "error",
        inputSiteUrlMessage: action.payload
      };
    }
  }
};

export type Props = {
  siteUrl?: string;
  onSiteInfoDone: any
};

type State = {
  inputSiteUrlStatus?: "done" | "fetching" | "error";
  inputSiteUrlMessage?: string;
  inputSiteUrl?: string;
};

type Action = {
  type: "error" | "done" | "submit" | "change";
  payload?: any;
};

const formatUrl = (urlText: string) => {
  const pattern = new RegExp("^(https?:\\/\\/)", "i"); // fragment locator
  if (!pattern.test(urlText)) {
    return config.urlProtocol + "://" + urlText;
  }
  return urlText;
};

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

import { useReducer } from "react";

import { config } from "@totara/lib";
import { translate } from "@totara/locale";

export const useSiteUrl = ({ siteUrl, onSiteUrlSuccess, isSiteUrlSubmitted }: Props) => {
  const [siteUrlState, dispatch] = useReducer(siteUrlReducer, {
    inputSiteUrlStatus: undefined,
    inputSiteUrlMessage: undefined,
    inputSiteUrl: siteUrl
  });

  if (siteUrlState.inputSiteUrlStatus === "success" && siteUrlState.inputSiteUrl)
    onSiteUrlSuccess(siteUrlState.inputSiteUrl);

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
    isSiteUrlSubmitted
  };
};

const siteUrlReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "submit": {
      if (action.payload && isValidUrlText(action.payload)) {
        return {
          ...state,
          inputSiteUrl: formatUrl(action.payload || ""),
          inputSiteUrlStatus: "success"
        };
      } else {
        return {
          ...state,
          inputSiteUrlStatus: "error",
          inputSiteUrlMessage: translate("site_url.validation.enter_valid_url")
        };
      }
    }

    case "change": {
      return {
        ...state,
        inputSiteUrl: action.payload
      };
    }
  }
};

export type Props = {
  onSiteUrlSuccess: (data: string) => void;
  siteUrl?: string;
  isSiteUrlSubmitted: boolean;
};

type State = {
  inputSiteUrlStatus?: "success" | "error";
  inputSiteUrlMessage?: string;
  inputSiteUrl?: string;
};

type Action = {
  type: "submit" | "change";
  payload?: string;
};

const isValidUrlText = (urlText: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(urlText);
};

const formatUrl = (urlText: string) => {
  const pattern = new RegExp("^(https?:\\/\\/)", "i"); // fragment locator
  if (!pattern.test(urlText)) {
    return config.urlProtocol + "://" + urlText;
  }
  return urlText;
};

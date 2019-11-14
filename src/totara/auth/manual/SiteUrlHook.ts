/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */
import { config } from "@totara/lib";
import { translate } from "@totara/locale";
import { useReducer } from "react";


export const useSiteUrl = ({siteUrl, onSiteUrlSuccess, isSiteUrlSubmitted}: Props): OutProps => {

  const [siteUrlState, dispatch] = useReducer(siteUrlReducer,
    { inputSiteUrlStatus: undefined, inputSiteUrlMessage: undefined, inputSiteUrl: siteUrl });

  if (siteUrlState.inputSiteUrlStatus === "success" && siteUrlState.inputSiteUrl)
    onSiteUrlSuccess(siteUrlState.inputSiteUrl);

  const onSubmit = () => {
    dispatch({type: "submit"})
  };

  const onChangeInputSiteUrl = (siteUrl: string) => {
    dispatch({type: "change", payload: siteUrl})
  };

  return {
    siteUrlState,
    onChangeInputSiteUrl,
    onSubmit,
    isSiteUrlSubmitted
  }
};


const siteUrlReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "submit": {
      if (state.inputSiteUrl && isValidUrlText(state.inputSiteUrl)) {
        return {
          ...state,
          inputSiteUrl: formatUrl(state.inputSiteUrl),
         inputSiteUrlStatus: "success"
        }
      } else {
        return {
          ...state,
          inputSiteUrlStatus: "error",
          inputSiteUrlMessage: translate("message.enter_valid_url")
        }
      }
    }

    case "change": {
      return {
        ...state,
        inputSiteUrl: action.payload,
      }
    }
  }
};


type Props = {
  onSiteUrlSuccess: (data: string) => void
  siteUrl?: string,
  isSiteUrlSubmitted : boolean
};

type State = {
  inputSiteUrlStatus?: "success" | "error",
  inputSiteUrlMessage?: string,
  inputSiteUrl?: string
};

type Action = {
  type: "submit" | "change"
  payload?: string
}

export type OutProps = {
  siteUrlState: State,
  onChangeInputSiteUrl: (siteUrl: string) => void,
  onSubmit: () => void,
  isSiteUrlSubmitted : boolean
}


const isValidUrlText = (urlText: string) => {
  const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
  return pattern.test(urlText);
};

const formatUrl = (urlText: string) => {
  const pattern = new RegExp("^(https?:\\/\\/)", "i"); // fragment locator
  if (!pattern.test(urlText)) {
    return config.urlProtocol + "://" + urlText;
  }
  return urlText;
};

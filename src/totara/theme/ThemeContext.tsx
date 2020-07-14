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

import React, {
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useContext
} from "react";

import { AppliedTheme, TotaraTheme, applyTheme } from "./Theme";
import { AuthContext } from "@totara/core";

type Props = {
  children: ReactNode;
};

const ThemeContext = React.createContext<
  [AppliedTheme, Dispatch<SetStateAction<AppliedTheme>>]
>([TotaraTheme, () => {}]);

const ThemeProvider = ({ children }: Props) => {
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const customerTheme =
    appState && appState.siteInfo && appState.siteInfo.theme
      ? applyTheme(appState.siteInfo.theme)
      : TotaraTheme;

  return (
    <ThemeContext.Provider value={useState(customerTheme)}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeConsumer = ThemeContext.Consumer;

export { ThemeContext, ThemeProvider, ThemeConsumer };

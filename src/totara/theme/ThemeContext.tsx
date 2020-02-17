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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React, { ReactNode, useState, Dispatch, SetStateAction, useContext } from "react";

import { AppliedTheme, TotaraTheme, applyTheme } from "./Theme";
import { AuthContext } from "@totara/core";

type Props = {
  children: ReactNode;
};

const ThemeContext = React.createContext<[AppliedTheme, Dispatch<SetStateAction<AppliedTheme>>]>([TotaraTheme, () => {}]);

const ThemeProvider = ( { children }: Props) => {

  const { authContextState: {appState} } = useContext(AuthContext);
  const customerTheme = (appState && appState.siteInfo && appState.siteInfo.theme) ? applyTheme(appState.siteInfo.theme) : TotaraTheme;

  return (
    <ThemeContext.Provider value={ useState(customerTheme) }>
      { children }
    </ThemeContext.Provider>
  );
};

const ThemeConsumer = ThemeContext.Consumer;

export { ThemeContext, ThemeProvider, ThemeConsumer };
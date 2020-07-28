/*
 * *
 *  * This file is part of Totara Mobile
 *  *
 *  * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *  *
 *  * This program is free software; you can redistribute it and/or modify
 *  * it under the terms of the GNU General Public License as published by
 *  * the Free Software Foundation; either version 3 of the License, or
 *  * (at your option) any later version.
 *  *
 *  * This program is distributed in the hope that it will be useful,
 *  * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  * GNU General Public License for more details.
 *  *
 *  * You should have received a copy of the GNU General Public License
 *  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *  *
 *  * @author: Rodrigo Mathias <rodrigo.mathias@totaralearning.com>
 *
 */

import { StyleSheet } from "react-native";
import { margins, paddings, opacities } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const separator = {
  opacity: opacities.opacityS,
  marginHorizontal: margins.marginL,
  backgroundColor: TotaraTheme.colorNeutral8
};

const regularSeparator = {
  margin: margins.marginXS,
  backgroundColor: TotaraTheme.colorNeutral3,
  height: 1
};

const listViewStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: paddings.paddingL
  },
  rowItem: {
    flexDirection: "row",
    padding: paddings.paddingM,
    backgroundColor: TotaraTheme.colorNeutral1
  },
  itemSeparator: regularSeparator,
  thinSeparator: {
    ...separator,
    height: 0.5
  },
  thickSeparator: {
    ...separator,
    height: 2
  }
});

export default listViewStyles;

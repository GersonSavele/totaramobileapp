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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import React from "react";
import { Text, View } from "react-native";

import { Activity } from "@totara/types";
import GradeDetailsCircle from "./components/GradeDetailsCircle";
import ActivityBottomView from "../components/ActivityBottomView";
import ActivityHeaderView from "../components/ActivityHeaderView";

// const ScormInformation = ({activity}: Props) => (
//     // <View style = {{flex : 1, alignItems: 'center', flexDirection:'column', alignContent:"space-between"}}>
//     //   {/* { (activity.itemName) && <Text> {activity.itemName} </Text> } */}
//     //   <ActivityHeaderView title = "" fontSize = {10}></ActivityHeaderView>
//     //   <GradeDetailsCircle gradeTitle = "" progress = {3} status = "" statusColor = ""></GradeDetailsCircle>
//     //   <ActivityBottomView title = "" fontSize = {10} buttonTitle = "" buttonBackgroundColor = "" buttonTitleColor = "" buttonBorderColor = ""></ActivityBottomView>
//     // </View>
//   );

//   const ScormFeedback = ({activity}: Props) => (
//     <View >
//       {(activity.itemName) &&
//         <Text>
//           {activity.itemName}
//         </Text>
//       }
//     </View>
//   );

  
//   type Props = {
//     activity: Activity
//   }
  
  // export { ScormInformation, ScormFeedback };
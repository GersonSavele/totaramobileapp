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
 * @author @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList
  } from "react-native";
  import React, { useState, useContext } from "react";
  import { ContentIcon } from "@totara/components";
  import { normalize, ThemeContext } from "@totara/theme";
  import { ActivitySheetConsumer } from "@totara/activities";
  import { Section, Activity, Course } from "@totara/types";
  import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
  import ActivityRestrictionView from "./ActivityRestrictionView";


  const OverviewDetails = ({ course }: { course: Course }) => {
    return (
null
)}


  export default OverviewDetails;





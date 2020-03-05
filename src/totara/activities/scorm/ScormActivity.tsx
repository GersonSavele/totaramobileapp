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
import { View } from "react-native";

import { ScormActivity } from "@totara/types";
import OnlineScormActivity from "@totara/activities/scorm/online/OnlineScormActivity";
import OfflineScormActivity from "@totara/activities/scorm/offline/OfflineScormActivity";
import { downloadSCORMPackage } from "./offline/SCORMFileHandler";
import SCORMPackageLoader from "./SCORMPackageLoader";

type ScormActivitySummary = {
  isOffline: boolean, 
  activity: ScormActivity,
};
const ScormActivityView = (props: Props) => {
  const offlineAttemptsAllowed = true;//props.activity.offlineAttemptsAllowed;
  const tmpactivity = {...props.activity, ...{id: "13"}};
  const isOffline = true;//TODO - need to check internet connection.
  
  return (
    <View style={{flex: 1}} >
      <SCORMPackageLoader activity={tmpactivity} />
      <SCORMActivitySummary isOffline={offlineAttemptsAllowed && isOffline} activity={props.activity} />
    </View>
  );
  
}
const SCORMActivitySummary = ({isOffline, activity} : ScormActivitySummary) => {
  if (isOffline) {
    return <OfflineScormActivity courseId={"2"} scormId={"13"} />
  }
  return <OnlineScormActivity activity={activity} />
}
type Props = {
  activity: ScormActivity
}

export default ScormActivityView;

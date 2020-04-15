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

import React, { useEffect, useState, useContext } from "react";
import { Text } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";

import { Activity, ActivityType } from "@totara/types";
import SCORMSummary from "./SCORMSummary";
import { ScormBundle } from "@totara/types/Scorm";
import { scormQuery } from "./api";
import { OfflineScormActivity } from "./offline";
import { ActivitySheetContext } from "../ActivitySheet";
import SCORMAttempts from "./SCORMAttempts";
import { SECONDS_FORMAT } from "@totara/lib/Constant";
import { Log } from "@totara/lib";
import { AuthenticatedWebView } from "@totara/auth";

type SCORMActivityProps = {
  activity: Activity,
};


export enum SCORMActivityType {
  None,
  Offline,
  Online,
  Attempts
}

enum Connectivity {
  initial = 0,
  online,
  offline
}

const SCORMActivity = ({activity}: SCORMActivityProps) => {
  const [isReachable, setIsReachable] = useState(Connectivity.initial);
  if (isReachable === Connectivity.initial) {
    NetInfo.fetch().then(state => {
      setIsReachable(state.isConnected ? Connectivity.online : Connectivity.offline);
    });
    return <Text>Loading...</Text>
  } else {
    return <SCORMActivityRoute activity={activity} isreachable={isReachable === Connectivity.online} />
  }  
}

type SCORMRouteProp = {
  activity: Activity,
  isreachable: boolean
}
const SCORMActivityRoute = ({activity, isreachable}: SCORMRouteProp) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: activity.instanceid },
  });
  
  if (loading) { return <Text>Loading...</Text>; }
  if (error) { 
      return <Text>Something went wrong, please try again later.</Text>; 
  }
  if (data && data.scorm) {
    let scormData = data.scorm;
    if(data.scorm.attempts && data.scorm.attempts.length > 0) {
      let scormAttempts = data.scorm.attempts;
      const defaultCMI = data.scorm.attempts[data.scorm.attempts.length - 1];
      if (!defaultCMI.timestarted) {
        scormAttempts = scormAttempts.slice(0, -1);
      }
      scormData = {...data.scorm, ...{attempts: scormAttempts, defaultCMI: defaultCMI}};
    }
    let scormBundleData = { scorm: scormData } as ScormBundle;
    if (isreachable) {
      scormBundleData.lastsynced = parseInt(moment().format(SECONDS_FORMAT));
    }
    return <SCORMFlow activity={activity} data={scormBundleData as ScormBundle} isUserOnline={isreachable} mode={SCORMActivityType.None} />
  }  else {
    Log.debug("Invalid server response. ", data);
    return <Text>Something went wrong, please try again later.</Text>; 
  }
};

type SCORMFlowProps = {
  activity: Activity,
  data?: ScormBundle,
  isUserOnline: boolean,
  mode: SCORMActivityType,
};

const SCORMFlow = ({activity, data, isUserOnline, mode}: SCORMFlowProps) => {

  const activitySheet = useContext(ActivitySheetContext);
  const [actionData, setActionData] = useState({bundle: data, mode: mode, data: undefined});
  const onSetActionWithData = (action: SCORMActivityType, bundle: ScormBundle, data: any) => {
    setActionData({mode: action, bundle: bundle, data: data});
  };
  
  useEffect(()=> {
    if(actionData.mode !== SCORMActivityType.None) {
      activitySheet.setFeedback({activity: activity as ActivityType, data: {isOnline: isUserOnline}});
    } else {
      activitySheet.setFeedback(undefined);
    }
  }, [actionData.mode]);
  
  switch(actionData.mode) {        
    case SCORMActivityType.Offline: 
      return <OfflineScormActivity scormBundle={actionData.bundle} attempt={actionData.data.attempt} scoid={actionData.data.scoid} />;      
    case SCORMActivityType.Online:
      return <AuthenticatedWebView uri={actionData.data.url} />;
    case SCORMActivityType.Attempts:
      return <SCORMAttempts scormBundle={actionData.bundle} setActionWithData={onSetActionWithData} />;
    case SCORMActivityType.None: 
      return <SCORMSummary activity={activity} data={actionData.bundle} isUserOnline={isUserOnline} setActionWithData={onSetActionWithData} />;
  }
};

export default SCORMActivity;
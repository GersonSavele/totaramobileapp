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
import { OfflineSCORMActivity } from "./offline";
import { ActivitySheetContext } from "../ActivitySheet";
import SCORMAttempts from "./SCORMAttempts";
import { SECONDS_FORMAT } from "@totara/lib/constants";
import { translate } from "@totara/locale";
import OnlineSCORMActivity from "./online/OnlineSCORMActivity";
import { scormActivityType, connectivity } from "@totara/lib/constants";
import { Loading } from "@totara/components/";

type SCORMActivityProps = {
  activity: Activity;
};

const SCORMActivity = ({ activity }: SCORMActivityProps) => {
  const [isReachable, setIsReachable] = useState(connectivity.initial);
  if (isReachable === connectivity.initial) {
    NetInfo.fetch().then((state) => {
      setIsReachable(
        state.isConnected ? connectivity.online : connectivity.offline
      );
    });
    return <Loading />;
  } else {
    return (
      <SCORMActivityRoute
        activity={activity}
        isreachable={isReachable === connectivity.online}
      />
    );
  }
};

type SCORMRouteProp = {
  activity: Activity;
  isreachable: boolean;
};
const SCORMActivityRoute = ({ activity, isreachable }: SCORMRouteProp) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: activity.instanceid },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Text>{translate("general.error_unknown")}</Text>;
  }
  if (data && data.scorm) {
    let scormData = data.scorm;
    if (data.scorm.attempts && data.scorm.attempts.length > 0) {
      let scormAttempts = data.scorm.attempts;
      const defaultCMI = data.scorm.attempts[data.scorm.attempts.length - 1];
      if (!defaultCMI.timestarted) {
        scormAttempts = scormAttempts.slice(0, -1);
      }
      scormData = {
        ...data.scorm,
        ...{ attempts: scormAttempts, defaultCMI: defaultCMI },
      };
    }
    let scormBundleData = { scorm: scormData } as ScormBundle;
    if (isreachable) {
      scormBundleData.lastsynced = parseInt(moment().format(SECONDS_FORMAT));
    }
    return (
      <>
        <SCORMFlow
          activity={activity}
          data={scormBundleData as ScormBundle}
          isUserOnline={isreachable}
          mode={scormActivityType.none}
        />
      </>
    );
  } else {
    return <Text>{translate("general.error_unknown")}</Text>;
  }
};

type SCORMFlowProps = {
  activity: Activity;
  data?: ScormBundle;
  isUserOnline: boolean;
  mode: scormActivityType;
};

const SCORMFlow = ({ activity, data, isUserOnline, mode }: SCORMFlowProps) => {
  const activitySheet = useContext(ActivitySheetContext);
  const [actionData, setActionData] = useState({
    bundle: data,
    mode: mode,
    data: undefined,
  });
  const onSetActionWithData = (
    action: scormActivityType,
    bundle: ScormBundle,
    data: any
  ) => {
    setActionData({ mode: action, bundle: bundle, data: data });
  };

  useEffect(() => {
    if (actionData.mode !== scormActivityType.none) {
      activitySheet.setFeedback({
        activity: activity as ActivityType,
        data: { isOnline: isUserOnline },
      });
      activitySheet.setActivityResource(undefined);
    } else {
      activitySheet.setFeedback(undefined);
    }
  }, [actionData.mode]);

  switch (actionData.mode) {
    case scormActivityType.offline:
      return (
        <OfflineSCORMActivity
          scormBundle={actionData.bundle}
          attempt={actionData.data.attempt}
          scoid={actionData.data.scoid}
        />
      );
    case scormActivityType.online:
      return (
        <OnlineSCORMActivity
          uri={actionData && actionData.data && actionData.data.url}
        />
      );
    case scormActivityType.attempts:
      return (
        <SCORMAttempts
          scormBundle={actionData.bundle}
          setActionWithData={onSetActionWithData}
        />
      );
    case scormActivityType.none:
      return (
        <SCORMSummary
          activity={activity}
          data={actionData.bundle}
          isUserOnline={isUserOnline}
          setActionWithData={onSetActionWithData}
        />
      );
  }
};

export default SCORMActivity;

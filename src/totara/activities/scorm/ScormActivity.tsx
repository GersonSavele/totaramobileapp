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
import { useNetInfo } from "@react-native-community/netinfo";

import { Activity, ActivityType } from "@totara/types";
import ScormSummary from "./ScormSummary";
import { ScormBundle } from "@totara/types/Scorm";
import { OfflineScormActivity } from "./offline";
import { ActivitySheetContext } from "../ActivitySheet";
import OnlineSCORMActivity from "./online/OnlineSCORMActivity";
import { scormActivityType } from "@totara/lib/constants";
import { View } from "react-native";
import { baseSpace, ThemeContext } from "@totara/theme";
import ResourceDownloader from "@totara/components/ResourceDownloader";
import { TopHeader } from "@totara/components";

type SCORMActivityProps = {
  id: string;
  activity: Activity;
  mode?: scormActivityType;
  onClose(): void;
  resource: any;
};

type scormModeDataProps = {
  mode: scormActivityType;
  bundle?: ScormBundle;
  data?: any;
};

const ScormActivity = ({
  id,
  activity,
  mode = scormActivityType.summary,
  onClose,
  resource
}: SCORMActivityProps) => {
  const [theme] = useContext(ThemeContext);
  const activitySheet = useContext(ActivitySheetContext);
  const [scormModeData, setScormModeData] = useState<scormModeDataProps>({
    mode: mode
  });
  const onSetActionWithData = (
    action: scormActivityType,
    bundle?: ScormBundle,
    data?: any
  ) => {
    setScormModeData({ mode: action, bundle: bundle, data: data });
  };
  useEffect(() => {
    if (
      activity &&
      (scormModeData.mode === scormActivityType.offline ||
        scormModeData.mode === scormActivityType.online)
    ) {
      activitySheet.setFeedback({
        activity: activity as ActivityType,
        data: {
          isOnline: scormModeData.mode === scormActivityType.online
        }
      });
      activitySheet.setActivityResource(undefined);
    } else {
      activitySheet.setFeedback(undefined);
    }
  }, [scormModeData.mode]);

  const renderBody = () => {
    switch (scormModeData.mode) {
      case scormActivityType.offline:
        return (
          <OfflineScormActivity
            scormBundle={scormModeData && scormModeData.bundle}
            attempt={scormModeData.data.attempt}
            scoid={scormModeData.data.scoid}
          />
        );
      case scormActivityType.online:
        return (
          <OnlineSCORMActivity
            uri={scormModeData && scormModeData.data && scormModeData.data.url}
          />
        );
      case scormActivityType.summary:
        return <ScormSummary id={id} setActionWithData={onSetActionWithData} />;
    }
  };

  return (
    <View style={theme.viewContainer}>
      <TopHeader
        iconSize={theme.textH2.fontSize}
        color={theme.colorSecondary1}
        title={activity.name}
        titleTextStyle={theme.textH4}
        infoTextStyle={{
          ...theme.textSmall,
          color: theme.textColorSubdued
        }}
        onClose={onClose}>
        {resource && (
          <ResourceDownloader
            mode={resource && resource.data && resource.data.state}
            progress={
              (resource && resource.data && resource.data.percentCompleted) || 0
            }
            size={theme.textH2.fontSize}
            onPress={resource && resource.action}
            style={{ padding: baseSpace }}
          />
        )}
      </TopHeader>
      {renderBody()}
    </View>
  );
};

export default ScormActivity;

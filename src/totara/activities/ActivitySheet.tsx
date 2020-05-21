/*
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

import React from "react";
import { Modal } from "react-native";

import { ActivityType } from "@totara/types";
import { WebviewActivity } from "./webview/WebviewActivity";
import ScormActivity from "./scorm/ScormActivity";
import { scormActivityType } from "@totara/lib/constants";

type ActivityFeedbackProps = {
  activity?: ActivityType;
  data?: any;
};

type contextData = {
  /**
   * set the activity, and the activity sheet will be visible and use the right component
   * @param activity
   */
  setCurrentActivity: (activity: ActivityType) => void;
  /**
   * set a callback to called when the activity sheet closes
   * @param onCloseCallback
   */
  setOnClose: (onCloseCallback: () => {}) => void;

  /**
   * set the feedback activity, and the activity sheet will be visible and use the right component
   * @param activity
   */
  setFeedback: (data?: ActivityFeedbackProps) => void;

  /**
   * set the activity resource, and the activity sheet will be visible and use the right component
   * @param activity
   */
  setActivityResource: (data: any) => void;
};

const ActivitySheetContext = React.createContext<contextData>({
  setCurrentActivity: () => {},
  setFeedback: () => {},
  setOnClose: () => {},
  setActivityResource: () => {}
});

const ActivitySheet = ({ currentActivity, onClose, resource }: Props) => {
  return (
    <Modal
      animationType="slide"
      visible={currentActivity != undefined}
      onRequestClose={onClose}>
      {currentActivity && (
        <ActivityWrapper
          activity={currentActivity}
          onClose={onClose}
          resource={resource}
        />
      )}
    </Modal>
  );
};

type Props = {
  currentActivity: ActivityType;
  onClose: () => void;
  show: boolean;
  feedback?: ActivityFeedbackProps;
  resource: any;
};

const ActivityWrapper = ({
  activity,
  onClose,
  resource
}: {
  activity: ActivityType;
  onClose;
  resource;
}) => {
  switch (activity.modtype) {
    case "scorm":
      return (
        <ScormActivity
          id={activity.instanceid.toString()}
          activity={activity}
          mode={scormActivityType.summary}
          onClose={onClose}
          resource={resource}
        />
      );
    default:
      return <WebviewActivity activity={activity} onClose={onClose} />;
  }
};

export { ActivitySheet, ActivitySheetContext };

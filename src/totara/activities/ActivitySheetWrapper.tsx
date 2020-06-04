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

import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import { ActivityType } from "@totara/types";
import { ActivitySheetContext, ActivitySheet } from "./ActivitySheet";
import ActivityFeedback from "./ActivityFeedback";
import { translate } from "@totara/locale";
import { showConfirmation } from "@totara/lib/tools";

const initialState = {
  currentActivity: undefined,
  onClose: () => {},
  show: false,
  feedback: {
    activity: undefined,
    data: undefined
  },
  resource: undefined
};

type ActivityFeedbackProps = {
  activity?: ActivityType;
  data?: any;
};

class ActivitySheetWrapper extends React.Component {
  public static propTypes = { children: PropTypes.node };

  state = initialState;

  setCurrentActivity(activity: ActivityType) {
    this.setState({
      currentActivity: activity,
      show: true
    });
  }

  setOnClose(onAfterCloseFunc: () => {}) {
    this.setState({
      onClose: onAfterCloseFunc
    });
  }

  setFeedback(data?: ActivityFeedbackProps) {
    this.setState({
      feedback: data
    });
  }

  onClose = () => {
    if (
      this.state.currentActivity &&
      this.state.currentActivity.modtype &&
      this.state.currentActivity.modtype === "scorm" &&
      this.state.feedback
    ) {
      showConfirmation(
        translate("scorm.confirmation.title"),
        translate("scorm.confirmation.message"),
        this.resetInitialState
      );
    } else {
      this.resetInitialState();
    }
  };

  resetInitialState = () => {
    const newState =
      this.state.feedback && this.state.currentActivity
        ? { ...initialState, ...{ feedback: this.state.feedback } }
        : initialState;
    this.state.onClose();
    this.setState(newState);
  };
  setActivityResource(data: any) {
    this.setState({
      resource: data
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ActivitySheetContext.Provider
          value={{
            ...this.state,
            setCurrentActivity: (activity: ActivityType) =>
              this.setCurrentActivity(activity),
            setFeedback: (data?: ActivityFeedbackProps) =>
              this.setFeedback(data),
            setOnClose: (onCloseCallback: () => {}) =>
              this.setOnClose(onCloseCallback),
            setActivityResource: (data: any) => this.setActivityResource(data)
          }}>
          {this.props.children}
          {this.state.currentActivity && (
            <ActivitySheet
              currentActivity={this.state.currentActivity!}
              onClose={this.onClose}
              show={this.state.show}
              resource={this.state.resource}
            />
          )}
          {this.state.feedback &&
            this.state.feedback.activity &&
            this.state.currentActivity === undefined && (
              <ActivityFeedback
                activity={this.state.feedback.activity!}
                data={this.state.feedback!.data}
                onClose={this.onClose}
                onPrimary={() => {
                  this.setCurrentActivity(this.state.feedback.activity!);
                }}
              />
            )}
        </ActivitySheetContext.Provider>
      </View>
    );
  }
}

export default ActivitySheetWrapper;

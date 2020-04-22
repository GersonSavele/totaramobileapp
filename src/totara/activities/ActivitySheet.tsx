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

import React, { useContext } from "react";
import { View, Modal } from "react-native";


import { ActivityType } from "@totara/types";
import { WebviewActivity } from "./webview/WebviewActivity";
import ActivityFeedback from "./ActivityFeedback";
import SCORMActivity from "./scorm/SCORMActivity";
import { ActivityNavigation, ActionItem, Header } from "./components/ActivityNavigationBar";
import ResourceDownloader from "@totara/components/ResourceDownloader";
import { ThemeContext } from "@totara/theme";

type ActivityFeedbackProps = {
  activity?: ActivityType, 
  data?: any
}; 

type contextData = {
  /**
   * set the activity, and the activity sheet will be visible and use the right component
   * @param activity
   */
  setCurrentActivity: (activity: ActivityType) => void
  /**
   * set a callback to called when the activity sheet closes
   * @param onCloseCallback
   */
  setOnClose: (onCloseCallback: () => {}) => void

  /**
   * set the feedback activity, and the activity sheet will be visible and use the right component
   * @param activity
   */
  setFeedback: (data: ActivityFeedbackProps) => void

  /**
   * set the activity resource, and the activity sheet will be visible and use the right component
   * @param activity
   */
  setActivityResource: (data: any) => void
 
}

export const ActivitySheetContext = React.createContext<contextData>({
  setCurrentActivity: () => {},
  setFeedback: () => {},
  setOnClose: () => {},
  setActivityResource: () => {}
});

export const ActivitySheetConsumer = ActivitySheetContext.Consumer;

const initialState = {
  currentActivity: undefined,
  onClose: () => {},
  show: false,
  feedback: undefined,
  resource: undefined
};

export class ActivitySheetProvider extends React.Component {
  state = initialState;

  setCurrentActivity(activity: ActivityType) {
    this.setState({
      currentActivity: activity,
      show: true
    })
  }

  setOnClose(onAfterCloseFunc: () => {}) {
    this.setState({
      onClose: onAfterCloseFunc
    })
  }

  setFeedback(data: ActivityFeedbackProps) {
    this.setState({
      feedback: data
    })
  }

  onClose = () => {
    const newState = this.state.feedback && this.state.currentActivity ? {...initialState, ...{feedback: this.state.feedback}} : initialState;
    this.state.onClose();
    this.setState(newState);
  };

  setActivityResource(data: any) {
    this.setState({
      resource: data
    })
  }

  render() {
    return(
      <View style ={{flex:1}}>
      <ActivitySheetContext.Provider value={{
        ...this.state,
        setCurrentActivity: (activity: ActivityType) => this.setCurrentActivity(activity),
        setFeedback: (data : ActivityFeedbackProps) => this.setFeedback(data),
        setOnClose: (onCloseCallback: () => {}) => this.setOnClose(onCloseCallback),
        setActivityResource: (data : any) => this.setActivityResource(data)
      }}>
        {/* eslint-disable-next-line react/prop-types */}
        {this.props.children}
        {(this.state.currentActivity) && <ActivitySheet currentActivity={this.state.currentActivity!} onClose={this.onClose} show={this.state.show} resource={this.state.resource} /> }
        {(this.state.feedback && this.state.feedback!.activity && this.state.currentActivity === undefined) && <ActivityFeedback activity={this.state.feedback!.activity} data={this.state.feedback!.data} onClose={this.onClose} onPrimary={() => { this.setCurrentActivity(this.state.feedback!.activity)}}/>}
      </ActivitySheetContext.Provider>
      </View>)
  }
}


const ActivitySheet = ({currentActivity, onClose, resource}: Props) => {  
  
  const [theme] = useContext(ThemeContext);

  return (<Modal animationType="slide" visible={currentActivity != undefined} onRequestClose={onClose}>
    <View style={theme.viewContainer}>
      <ActivityNavigation>
        <ActionItem icon={"times"} action={onClose} />
        {/* TODO - info need to from activity list props ["You are offline"]*/}
        <Header title={currentActivity.name} info={undefined}  />
        <ActionItem action={resource && resource.action}>
        { resource && <ResourceDownloader mode={resource && resource.data && resource.data.state} progress={resource && resource.data && resource.data.percentCompleted || 0} size={28} /> }
        </ActionItem>
      </ActivityNavigation>
      {(currentActivity) && <ActivityWrapper activity={currentActivity}/>}
    </View>
  </Modal>);
};

type Props = {
  currentActivity: ActivityType,
  onClose: () => void
  show: boolean,
  feedback?: ActivityFeedbackProps,
  resource: any
}

const ActivityWrapper = ({activity}: { activity: ActivityType }) => {
  switch (activity.modtype) {
    case "scorm":
      return (<SCORMActivity activity={activity} />);
    default:
      return (<WebviewActivity activity={activity} />);
  }
};
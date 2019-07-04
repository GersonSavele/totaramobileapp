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

import React, { createRef, Component } from "react";
import SlidingUpPanel from "rn-sliding-up-panel";
import { Image, StyleSheet, Text, View, StatusBar  } from "react-native";
import { Button } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { ActivityType } from "@totara/types";
import { ScormActivity } from "./scorm/ScormActivity";
import { PlaceHolderActivity } from "./placeholder/PlaceHolderActivity";


type contextData = {
  setCurrentActivity: (activity: ActivityType) => void
}

const ActivitySheetContext = React.createContext<contextData>({
  setCurrentActivity: () => {}
});

export const ActivitySheetConsumer = ActivitySheetContext.Consumer;

/**
 * Works with React Context, when a consumer calls setCurrentActivity this provider will bring up the
 * ActivitySheet with activity passed in
 *
 * @example
 *
 * // some on the upper hierarchy of the app
 * <ActivitySheetProvider>
 *   <ElementsThatWillHaveTheActivitySheetInScope/>
 * </ActivitySheetProvider>
 *
 * // deep down nested component of the app
 * <ActivitySheetConsumer>
 *   {
 *     ({setCurrentActivity}) =>
 *       <Component onPress={() => setCurrentActivity(activity)}/>
 *   }
 * </ActivitySheetConsumer/>
 */

const panelRef = createRef<SlidingUpPanel>();

export class ActivitySheetProvider extends React.Component {
  state = {
    setCurrentActivity: (activity: ActivityType) => this.setCurrentActivity(activity),
    currentActivity: undefined,
  };

  setCurrentActivity(activity: ActivityType) {
    this.setState({
      currentActivity: activity
    }, () => panelRef.current!.show(0));
  }

  render() {
    return(
      <ActivitySheetContext.Provider value={this.state}>
        {this.props.children}
        {
          (this.state.currentActivity) &&
            <ActivitySheet ref={panelRef} currentActivity={this.state.currentActivity!}/>
        }
      </ActivitySheetContext.Provider>)
  }
}

const ActivitySheet = React.forwardRef<SlidingUpPanel, Props>(({currentActivity}, ref) =>
  (<SlidingUpPanel ref={ref} friction={0.25}>
    <View style={styles.panel}>
      <View style={{paddingLeft: 10}}>
      <StatusBar hidden/>
      <Button transparent onPress={() => panelRef.current!.hide()}>
        <FontAwesomeIcon icon="times" size={24}/>
      </Button>
      </View>
      <ActivityWrapper activity={currentActivity}/>
    </View>
    </SlidingUpPanel>)
);

type Props = {
  currentActivity: ActivityType,
}

const ActivityWrapper = ({activity}: { activity: ActivityType }) => {
  switch (activity.type) {
    case "scorm":
      return (<ScormActivity activity={activity}/>);
    default:
      return (<PlaceHolderActivity activity={activity}/>);
  }
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 5
  },
});
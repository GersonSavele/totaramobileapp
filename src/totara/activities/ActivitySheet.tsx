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

import React, { createRef } from "react";
import SlidingUpPanel from "rn-sliding-up-panel";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import { Button } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { ActivityType } from "@totara/types";
import ScormActivity from "./scorm/ScormActivity";
import { WebviewActivity } from "./webview/WebviewActivity";

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

  onClose = () => {
    panelRef.current!.hide();
    this.setState({
      currentActivity: undefined
    })
  };

  render() {
    return(
      <View style ={{flex:1}}>
      <ActivitySheetContext.Provider value={this.state}>
        {this.props.children}
        {
          (this.state.currentActivity) &&
            <ActivitySheet ref={panelRef} currentActivity={this.state.currentActivity!} onClose={this.onClose}/>
        }
      </ActivitySheetContext.Provider>
      </View>)
  }
}

const ActivitySheet = React.forwardRef<SlidingUpPanel, Props>(({currentActivity, onClose}, ref) =>
  <SlidingUpPanel ref={ref} friction={0.25} allowDragging={false}>
    <View style={styles.panel}>
      <View style={styles.navigationStyle}>
        <StatusBar hidden/>
        <View style={styles.rightContainer}>
          <Button style={styles.buttonStyle} onPress={onClose}>
            <FontAwesomeIcon icon="times" size={24}/>
          </Button>
        </View>
        <Text style={styles.titleStyle}> {currentActivity.itemName} </Text>
        <View style={styles.rightContainer}></View>
      </View>
      {(currentActivity) && <ActivityWrapper activity={currentActivity}/>}
    </View>
  </SlidingUpPanel>
);

type Props = {
  currentActivity: ActivityType,
  onClose: () => void
}

const ActivityWrapper = ({activity}: { activity: ActivityType }) => {
  switch (activity.modtype) {
    case "scorm":
      return (<ScormActivity activity={activity}/>);
    default:
      return (<WebviewActivity activity={activity}/>);
  }
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    paddingTop: 5,
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  },
  navigationStyle :{
    flex: 0.1,
    paddingTop: 10,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonStyle : {
    backgroundColor: "transparent",
    paddingLeft: 20,
    alignSelf:"flex-start"
  },
  titleStyle: {
    fontSize: 16,
    color: "#3D444B",
    fontWeight: "bold",
    textAlign: 'center',
    alignSelf:"center"
  }
});

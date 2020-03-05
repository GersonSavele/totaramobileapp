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
import { StyleSheet, View, StatusBar, Text, Modal } from "react-native";
import { Button } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { ActivityType } from "@totara/types";
import { WebviewActivity } from "./webview/WebviewActivity";
import SafeAreaView from "react-native-safe-area-view";
import { ThemeContext } from "@totara/theme";
import SCORMActivityAPI from "./scorm/SCORMActivity"

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
}

const ActivitySheetContext = React.createContext<contextData>({
  setCurrentActivity: () => {},
  setOnClose: () => {}
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

const initialState = {
  currentActivity: undefined,
  onClose: () => {},
  show: false
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

  onClose = () => {
    this.state.onClose();
    this.setState(initialState);
  };

  render() {
    return(
      <View style ={{flex:1}}>
      <ActivitySheetContext.Provider value={{
        ...this.state,
        setCurrentActivity: (activity: ActivityType) => this.setCurrentActivity(activity),
        setOnClose: (onCloseCallback: () => {}) => this.setOnClose(onCloseCallback)
      }}>
        {this.props.children}
        {
          (this.state.currentActivity) &&
            <ActivitySheet currentActivity={this.state.currentActivity!} onClose={this.onClose} show={this.state.show}/>
        }
      </ActivitySheetContext.Provider>
      </View>)
  }
}

const ActivitySheet = ({currentActivity, onClose}: Props) => {
  const [ theme ] = useContext(ThemeContext);

  return (<Modal animationType="slide" visible={currentActivity != undefined} onRequestClose={onClose}>
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colorSecondary1 }} forceInset={{ bottom: "always" }}>
      <View style={styles.panel}>
        <View style={[styles.navigationStyle, { backgroundColor: theme.colorSecondary1 }]}>
          <StatusBar hidden/>
          <View style={styles.rightContainer}>
            <Button style={styles.buttonStyle} onPress={onClose}>
              <FontAwesomeIcon icon="times" size={24}/>
            </Button>
          </View>
          <Text style={styles.titleStyle}> {currentActivity.name} </Text>
          <View style={styles.rightContainer}></View>
        </View>
        {(currentActivity) && <ActivityWrapper activity={currentActivity}/>}
      </View>
    </SafeAreaView>
  </Modal>);
};

type Props = {
  currentActivity: ActivityType,
  onClose: () => void
  show: boolean
}

const ActivityWrapper = ({activity}: { activity: ActivityType }) => {
  switch (activity.modtype) {
    case "scorm":
      return (<SCORMActivityAPI activity={activity}/>);
    default:
      return (<WebviewActivity activity={activity}/>);
  }
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  },
  navigationStyle :{
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

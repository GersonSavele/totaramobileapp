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

import { Activity } from "@totara/types";
import { ScormActivity } from "@totara/activities/scorm/ScormActivity";
import { PlaceHolderActivity } from "@totara/activities/placeholder/PlaceHolderActivity";


type contextData = {
  setCurrentActivity: (activity: Activity) => void
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

export class ActivitySheetProvider extends React.Component {
  state = {
    setCurrentActivity: (activity: Activity) => this.setCurrentActivity(activity),
    currentActivity: placeHolderActivity,
    activitySheetVisible: false
  };

  setCurrentActivity(activity: Activity) {
    this.setState({  
      currentActivity: activity
    })
  }

  toggleActivity = () => {
    if (this.state.activitySheetVisible) {
      this.panel.current!.hide();
      this.setState({
        activitySheetVisible: false
      });
    } else {
      this.panel.current!.show();
      this.setState({
        activitySheetVisible: true
      });
    }

  };

  panel = createRef<SlidingUpPanel>();

  render() {
    return(
      <ActivitySheetContext.Provider value={this.state}>
        {this.props.children}
        <ActivitySheet ref={this.panel} toggleActivity={this.toggleActivity} currentActivity={this.state.currentActivity}/>
      </ActivitySheetContext.Provider>)
  }
}

const ActivitySheet = React.forwardRef<SlidingUpPanel, Props>((props, ref) => {
  const {toggleActivity, currentActivity} = props;

  return(<SlidingUpPanel
    ref={ ref }>
      <View style={styles.panel}>
        <View style={{paddingLeft: 10}}>
        <StatusBar hidden/>
        <Button transparent onPress={toggleActivity}>
          <FontAwesomeIcon
            icon="times"
            size={24}
          />
        </Button>
        </View>
        <ActivityWrapper activity={currentActivity}/>
      </View>
    </SlidingUpPanel>);
});

type Props = {
  currentActivity: Activity,
  toggleActivity: () => void
}

const ActivityWrapper = ({activity}: { activity: Activity }) => {
  switch (activity.type) {
    case "film": // TODO for now use film type as scorm, need to fix this mapping
      return (<ScormActivity activity={activity}/>);
    default:
      return (<PlaceHolderActivity activity={activity}/>);
  }
};

const placeHolderActivity = { // placeholder for init
  id: 0,
  type: "",
  itemName: "",
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 5
  },
});

export default ActivitySheet;

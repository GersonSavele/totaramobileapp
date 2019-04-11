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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import React from "react";
import SlidingUpPanel from "rn-sliding-up-panel";
import {Image, StyleSheet, Text, View, StatusBar} from "react-native";
import {Button} from "native-base";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

import {config} from "@totara/lib";
import {Activity} from "@totara/types";


type contextData = {
  toggleActivity: () => void,
  activitySheetVisible: boolean,
  currentActivity: Activity,
  setCurrentActivity: (activity: Activity) => void
}


const ActivitySheetContext = React.createContext<contextData>({
  toggleActivity: () => {},
  activitySheetVisible: false,
  currentActivity: { // placeholder
    id: 0,
    type: "",
    itemName: "",
  },
  setCurrentActivity: activity => {}
});

export const ActivitySheetProvider = ActivitySheetContext.Provider;
export const ActivitySheetConsumer = ActivitySheetContext.Consumer;

export const ActivitySheet = () => {

    return(
      <ActivitySheetConsumer>
        {({toggleActivity, activitySheetVisible, currentActivity}) =>
          (<SlidingUpPanel
            visible={activitySheetVisible}
            onRequestClose={toggleActivity}>
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
              {
                (currentActivity && currentActivity.imgSrc) ?
                  <Image source={{uri: config.mobileStatic + "/public/" + currentActivity.imgSrc}}
                         style={{width: wp("100%"), height: 240}}/>
                  : null
              }
              {
                (currentActivity && currentActivity.summary) ?
                  <Text style={styles.panelContent}>
                    {currentActivity.summary}
                  </Text>
                  : null
              }
            </View>
          </SlidingUpPanel>)
        }
      </ActivitySheetConsumer>);
  };


const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#CECECE",
    paddingTop: 5
  },
  panelContent: {
    flex: 10,
    padding: 20,
  },
});

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
import { Image, StyleSheet, Text, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import config from "@totara/lib/config";
import { Activity } from "@totara/types";

/**
 * Placeholder activity is just a generic place holder for activities that doesn't have any implementation yet
 *
 * This just renders some of the properties of Activity
 *
 */
const PlaceHolderActivity = ({activity}: Props) => (
  <View>
    {(activity.imgSrc) &&
      <Image source={{uri: config.mobileStatic + "/public/" + activity.imgSrc}}
      style={{width: wp("100%"), height: 240}}/>
    }
    {(activity.itemName) &&
      <Text>
        {activity.itemName}
      </Text>
    }
    {(activity.summary) &&
      <Text style={styles.panelContent}>
        {activity.summary}
      </Text>
    }
  </View>
);

type Props = {
  activity: Activity
}

const styles = StyleSheet.create({
  panelContent: {
    flex: 10,
    padding: 20,
  },
});

export { PlaceHolderActivity };
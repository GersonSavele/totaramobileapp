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
 *
 */

import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import { ContentIcon, CheckBadge } from "@totara/components";
import { normalize, resizeByScreenSize, fontSizeH4, fontSizeB1, lrPadding } from "@totara/theme";
import { Status } from "@totara/types";
import { ActivitySheetConsumer } from "@totara/activities";


class ActivityList extends React.Component {
  renderSection = ({section: {sectionName, status}}) => {
    const SectionHeader = () => (status === Status.hidden)
      ? <View style={styles.withLock}>
          <Text style={styles.sectionHeaderText}>{sectionName}</Text>
          <View style={styles.sectionLock}>
            <FontAwesomeIcon icon="lock" size={16} color="white"/>
          </View>
        </View>
      : <Text style={styles.sectionHeaderText}>{sectionName}</Text>;

    return (
      <View style={styles.sectionHeader}>
        <SectionHeader/>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={styles.sectionFooter}>
      </View>
    );
  };


  renderActivity = ({item, index, section}) => {

    const BuildContentIcon = ({type}) => {
      switch (type) {
        case "scorm":
          return <ContentIcon icon={"film"} iconSize={24} size={50}/>;
        case "forum" :
          return <ContentIcon icon={"comments"} iconSize={24} size={50}/>;
        case "quiz" :
          return <ContentIcon icon={"pen"} iconSize={24} size={50}/>;
        case "assign" :
          return <ContentIcon icon={"pen-square"} iconSize={24} size={50}/>;
        case "facetoface" :
          return <ContentIcon icon={"bullhorn"} iconSize={24} size={50}/>;
        default:
          return <ContentIcon icon={"book"} iconSize={24} size={50}/>;
      }
    };

    const Activity = () =>
      <View style={styles.activity}>
        {
          (item.status === Status.done)
            ? <CheckBadge size={8} offsetSize={2}>
                <BuildContentIcon type={item.type}/>
              </CheckBadge>
            : <BuildContentIcon type={item.type}/>
        }
        <ActivitySheetConsumer>
          {({setCurrentActivity}) =>
            <TouchableOpacity style={{flex: 1}} onPress={() => setCurrentActivity(item)}>
              <Text numberOfLines={1} style={(item.status) === Status.active ? styles.activeActivityText : styles.activityText}>{item.itemName}</Text>
              <Text numberOfLines={1} style={styles.activitySummaryText}>{item.summary}</Text>
            </TouchableOpacity>
          }
        </ActivitySheetConsumer>
        {
          (item.type === "scorm") ?
            <View style={{paddingLeft: lrPadding}}>
              <FontAwesomeIcon icon="cloud-download-alt" size={24} color="black"/>
            </View>
            :
            null
        }
      </View>;

    if (section.status === Status.hidden)
      return(
        <View>
          <Activity/>
          <View style={styles.disabledOverlay}/>
        </View>);
    else if (item.status === Status.active)
      return(
        <View style={styles.activeActivityContainer}>
          <Activity/>
        </View>);
    else
      return <Activity/>
  };

  render() {
    const {activityGroups, onScroll} = this.props;

    return(
    <SectionList style={styles.activities}
                 sections={activityGroups}
                 renderSectionHeader={this.renderSection}
                 renderItem={this.renderActivity}
                 renderSectionFooter={this.renderFooter}
                 keyExtractor={(item, index) => item.id.toString() + index}
                 onScroll={onScroll}/>
    );
  }
}

ActivityList.propTypes = {
  activityGroups: PropTypes.array.isRequired,
  onScroll: PropTypes.func
};

const styles = StyleSheet.create({
  activity: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F5F5F5",
    height: normalize(72),
    paddingLeft: lrPadding,
    paddingRight: lrPadding,
  },
  activityText: {
    fontSize: fontSizeH4,
    paddingLeft: lrPadding,

  },
  activitySummaryText: {
    fontSize: fontSizeB1,
    color: "#A0A0A0",
    paddingLeft: lrPadding,

  },
  activities: {
    paddingLeft: resizeByScreenSize(8, 10, 16, 24),
    paddingRight: resizeByScreenSize(8, 10, 16, 24),
  },
  sectionHeader: {
    backgroundColor: "#EEEEEE",
    paddingLeft: 10,
    justifyContent: "center",
    height: 40,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    overflow: "hidden",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3D444B",
  },
  sectionFooter: {
    backgroundColor: "#FFFFFF",
    height: 16
  },
  withLock: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLock: {
    backgroundColor: "#999999",
    padding: 4,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  disabledOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "white",
    opacity: 0.5,
    height: normalize(64),
    width: "100%"
  },
  activeActivityContainer: {
    borderWidth: 2,
    borderColor: "#337AB7",
    backgroundColor: "#EEEEEE",
  },
  activeActivityText: {
    fontSize: fontSizeH4,
    color: "#0066CC",
    paddingLeft: lrPadding,
    fontWeight: "600",
  }
});

export default ActivityList;

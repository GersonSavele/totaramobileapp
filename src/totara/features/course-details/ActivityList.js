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
import React, { useContext } from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import { ContentIcon, AddBadge } from "@totara/components";
import { normalize, resizeByScreenSize, lrPadding, ThemeContext } from "@totara/theme";
import { Status } from "@totara/types";
import { ActivitySheetConsumer } from "@totara/activities";


class ActivityList extends React.Component {
  renderSection = ({section: {title, available, availablereason}}) => {
    const SectionHeader = () => (!available)
      ? <View style={styles.withLock}>
          <Text style={styles.sectionHeaderText}>{title} {availablereason}</Text>
          <View style={styles.sectionLock}>
            <FontAwesomeIcon icon="lock" size={16} color="white"/>
          </View>
        </View>
      : <Text style={styles.sectionHeaderText}>{title}</Text>;

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


  renderActivity = ({item, section}) => {
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

    const Activity = () => {
      const [theme] = useContext(ThemeContext);
      return (
      <View style={styles.activity}>
        {
          (item.completionstatus === "incomplete")
            ? <BuildContentIcon type={item.modtype}/>
            : <AddBadge status={Status.done} size={8} offsetSize={2}>
                <BuildContentIcon type={item.modtype}/>
              </AddBadge>
        }
        <ActivitySheetConsumer>
          {({setCurrentActivity}) => {
            return (
            <TouchableOpacity style={{flex: 1}} onPress={() => setCurrentActivity(item)}>
              <Text numberOfLines={1} style={[theme.textH4, (item.completionstatus) === Status.active ? styles.activeActivityText : styles.activityText]}>{item.name}</Text>
              <Text numberOfLines={1} style={[theme.textB1, styles.activitySummaryText]}>{item.summary}</Text>
              <View style={{flexDirection: "row"}}>
                <Text>{item.completion} | </Text>
                <Text>{item.completionstatus} | </Text>
                <Text>{item.available.toString()} | </Text>
                <Text>{item.availablereason}</Text>
              </View>
            </TouchableOpacity>
            );
          }
          }
        </ActivitySheetConsumer>
        {
          (item.modtype === "scorm") ?
            <View style={{paddingLeft: lrPadding}}>
              <FontAwesomeIcon icon="cloud-download-alt" size={24} color="black"/>
            </View>
            :
            null
        }
      </View>
      );
    };

    if (!section.available)
      return(
        <View>
          <Activity/>
          <View style={styles.disabledOverlay}/>
        </View>);
    else
      return <Activity/>
  };

  render() {
    const {moduleGroups, onScroll} = this.props;
    return(
    <SectionList style={styles.activities}
                 sections={moduleGroups}
                 renderSectionHeader={this.renderSection}
                 renderItem={this.renderActivity}
                 renderSectionFooter={this.renderFooter}
                 keyExtractor={(item, index) => item.id.toString() + index}
                 onScroll={onScroll}/>
    );
  }
}

ActivityList.propTypes = {
  moduleGroups: PropTypes.array.isRequired,
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
    paddingLeft: lrPadding,

  },
  activitySummaryText: {
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
    color: "#0066CC",
    paddingLeft: lrPadding,
    fontWeight: "600",
  }
});

export default ActivityList;

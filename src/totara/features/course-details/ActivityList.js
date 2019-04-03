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

import {SectionList, StyleSheet, Text, View} from "react-native";
import React from "react";
import {ContentIcon, addBadge, BadgeType} from "@totara/components";
import {normalize, resizeByScreenSize} from "@totara/theme";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

class ActivityList extends React.Component {

  renderSection = ({section: {sectionName, status}}) => {
    const SectionHeader = () => (status === "hidden") ?
      <View style={styles.withLock}>
        <Text style={styles.sectionHeaderText}>{sectionName}</Text>
        <View style={styles.sectionLock}>
          <FontAwesomeIcon icon="lock" size={16} color="white"/>
        </View>
      </View>
      :
      <Text style={styles.sectionHeaderText}>{sectionName}</Text>

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

    const BuildContentIcon = () => <ContentIcon icon={item.type} iconSize={24} size={50}/>

    const BadgedIcon = addBadge(BuildContentIcon, BadgeType.Check);

    const Activity = () =>
      <View style={styles.activity}>
        {
          (item.status === "done") ? <BadgedIcon/> : <BuildContentIcon/>
        }
        <View style={{flex: 1}}>
          <Text numberOfLines={1} style={styles.activityText}>{item.itemName}</Text>
          <Text numberOfLines={1} style={styles.activitySummaryText}>Nemo enim ipsam voluptatem quia voluptas lorem ipsum</Text>
        </View>
        {
          (item.type === "film") ?
            <View style={{padding: 4}}>
              <FontAwesomeIcon icon="cloud-download-alt" size={24} color="black"/>
            </View>
            :
            null
        }
      </View>;

    if (section.status === "hidden")
      return(
        <View>
          <Activity/>
          <View style={styles.disabledOverlay}/>
        </View>);
    else if (item.status === "active")
      return(
        <View style={styles.activeActivity}>
          <Activity/>
        </View>);
    else
      return <Activity/>
  };

  render() {
    const {activityGroups} = this.props;

    return(
    <SectionList style={styles.activities}
                 sections={activityGroups}
                 renderSectionHeader={this.renderSection}
                 renderItem={this.renderActivity}
                 renderSectionFooter={this.renderFooter}
                 keyExtractor={(item, index) => item.id.toString() + index}/>
    );
  }
}

ActivityList.propTypes = {
  activityGroups: PropTypes.array.isRequired
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
    height: normalize(64),
    padding: 10
  },
  activityText: {
    fontSize: 16,
    paddingLeft: 10,
    flexWrap: "wrap",
  },
  activitySummaryText: {
    fontSize: 14,
    color: "#A0A0A0",
    paddingLeft: 10,
    flexWrap: "wrap",
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
  activeActivity: {
    borderWidth: 2,
    borderColor: "#AAAAAA",
  }
});

export default ActivityList;
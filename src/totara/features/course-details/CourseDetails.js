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

import React from "react";
import {SectionList, StyleSheet, Text, View} from "react-native";
import PropTypes from "prop-types";
import {Button} from "native-base";


import {learningItemCard, ContentIcon, addBadge} from "@totara/components";
import {normalize, gutter, resizeByScreenSize} from "@totara/theme";



export default class CourseDetails extends React.Component {
  static navigationOptions = {
    title: "Course",
  };

  renderSection = ({section: {groupName}}) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{groupName}</Text>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={styles.sectionFooter}>
      </View>
    );
  };


  renderActivity = ({item}) => {
    class Foo extends React.Component {
      render() {
        return(<ContentIcon icon={item.type} iconSize={24} size={50}/>);
      }
    }

    const BadgedIcon = addBadge(Foo);

    return (
      <View style={styles.activity}>
        {
          (item.status) ? <BadgedIcon/> : <ContentIcon icon={item.type} iconSize={24} size={50}/>
        }
        <View style={{flex: 1}}>
          <Text numberOfLines={1} style={styles.activityText}>{item.itemName}</Text>
          <Text numberOfLines={1} style={styles.activitySummaryText}>Nemo enim ipsam voluptatem quia voluptas lorem ipsum</Text>
        </View>
      </View>
    );
  };

  render() {
    const {item} = this.props.navigation.state.params;

    const LearningItemCard = learningItemCard(null); // TODO make wrapped component to be optional

    return (
      <View style={styles.container}>
        <View style={styles.learningItem}>
          <LearningItemCard item={item} imageStyle={styles.itemImage} cardStyle={styles.itemCard}/>
        </View>
        <View style={styles.activitiesContainer}>
          <View style={styles.tabNav}>
            <Text style={styles.tabActive}>Activities</Text>
            <Text style={styles.tabInActive}>Outline</Text>
          </View>
          <SectionList style={styles.activities}
                       sections={item.activityGroups}
                       renderSectionHeader={this.renderSection}
                       renderItem={this.renderActivity}
                       renderSectionFooter={this.renderFooter}
                       keyExtractor={(item, index) => item.id.toString() + index}/>
        </View>
        {/*<View style={styles.buttonContainer}>*/}
          {/*<Button block><Text style={styles.buttonText}>Continue your learning</Text></Button>*/}
        {/*</View>*/}
      </View>
    );
  }
}

CourseDetails.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  learningItem: {
    flex: 2,
  },
  activitiesContainer: {
    flex: 3,
    paddingLeft: 0,

  },
  buttonContainer: {
    flex: 0,
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 10
  },
  buttonText: {
    color: "#FFFFFF",
    padding: 5
  },
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
    paddingRight: resizeByScreenSize(8,10, 16, 24),
  },
  button: {
    alignItems: "center",
    padding: 10
  },
  tabNav: {
    flexDirection: "row",
    paddingLeft: gutter,
    paddingTop: 20,
    height: 56
  },
  tabActive: {
    paddingRight: 40,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 5,
    borderColor: "black",
  },
  tabInActive: {
    fontSize: 15,
    color: "#CECECE"
  },
  itemImage: {
    flex: 6,
  },
  itemCard: {
    flex: 2,
    backgroundColor: "#EEEEEE",
    maxHeight: 72
  },
  sectionHeader: {
    backgroundColor: "#EEEEEE",
    paddingLeft: 10,
    justifyContent: "center",
    height: 40,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3D444B"
  },
  sectionFooter: {
    backgroundColor: "#FFFFFF",
    height: 16
  }
});

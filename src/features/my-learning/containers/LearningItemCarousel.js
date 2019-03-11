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
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from 'prop-types';
import {Button} from "react-native-material-ui";
import Carousel from "react-native-snap-carousel";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

import {learningItemsList} from "../api";
import DueDateState from "../../../components/DueDateState";
import config from "../../../lib/config";
import {normalize} from "../../../components/Styles";


const LearningItemCarousel = (courseNavigate) => learningItemsList(({data: {loading, currentLearning, error}}) => {

  const LearningItem = ({item}) => {
    const imgSrc = config.mobileStatic + "/public/" + item.id + ".JPG";

    return (
      <TouchableOpacity style={styles.learningItem} key={item.id} onPress={() => courseNavigate(item)} activeOpacity={1.0}>
        <View style={styles.itemImage}>
          <DueDateState dueDateState={item.dueDateState} dueDate={item.dueDate}/>
          <Image source={{uri: imgSrc}} style={{width: "100%", height: "100%"}}/>
        </View>
        <View style={styles.itemCard}>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.itemFullName}>{item.fullname}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemType}>{item.type}</Text>
            <Text> | {item.progressPercentage}%</Text>
          </View>
          <Text style={styles.itemSummary}>{item.summary}</Text>
          <Button raised primary text={"Start this " + item.type} upperCase={false} style={buttonStyle}/>
        </View>
      </TouchableOpacity>
    );
  };

  const buttonStyle = {
    container: {
      borderRadius: 5
    }
  };

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  if (currentLearning) {
    return (
      <Carousel
        data={currentLearning}
        renderItem={LearningItem}
        sliderWidth={wp("100%")}
        itemWidth={wp("82%")}
        sliderHeight={hp("100%")}
        inactiveSlideOpacity={0.6}
      />
    );

  } else return null;
});

export default LearningItemCarousel;

const styles = StyleSheet.create({
  learningItem: {
    flex: 1,
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    borderRadius: 10,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    backgroundColor: "#FFFFFF"
  },
  itemImage: {
    flex: 1,
    flexDirection: "column-reverse",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
  },
  itemCard: {
    padding: 10,
    flex: 1
  },
  itemType: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 2,
    color: "#86C9C8"
  },
  itemFullName: {
    flexWrap: "wrap",
    fontSize: normalize(20),
    fontWeight: "bold",
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    minHeight: 30,
    paddingTop: 5,
  },
  itemSummary: {
    flex: 10,
    paddingBottom: 10,
  },
});

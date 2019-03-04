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
 *
 */

import config from "../../../lib/config";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button} from "react-native-material-ui";
import {learningItemsList} from "../api";
import Carousel from "react-native-snap-carousel";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from "react";
import DueDateState from "../../../components/DueDateState";


const LearningItemCarousel = (courseNavigate) => learningItemsList(({ data: {loading, currentLearning, error} }) => {

  const renderLearningItem = (courseNavigate) => ( {item, index} ) => {
    const imgSrc = config.mobileStatic + '/public/' + item.id + '.JPG'

    return (
      <TouchableOpacity key={item.id} onPress={() => courseNavigate(item)} activeOpacity={1.0}>
        <Image source={{uri: imgSrc}} style={{width: '100%', height: '50%'}}/>
        <DueDateState dueDateState={item.dueDateState} dueDate={item.dueDate}/>
        <View style={styles.itemCard}>
        <Text style={styles.itemFullName}>{item.fullname}</Text>
        <View style={styles.itemInfo}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text> | {item.progressPercentage}%</Text>
        </View>
        <Text style={styles.itemSummary}>{item.summary}</Text>
        </View>
        <Button raised primary text={'Start this ' + item.type} upperCase={false}/>
      </TouchableOpacity>
    )
  }

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  if (currentLearning) {
    return (
      <Carousel
        data={currentLearning}
        renderItem={renderLearningItem(courseNavigate)}
        sliderWidth={wp('100%')}
        itemWidth={wp('80%')}
        sliderHeight={hp('100%')}
        inactiveSlideOpacity={0.4}
      />
    )

  } else return null
});

export default LearningItemCarousel

const styles = StyleSheet.create({
  itemCard: {
    padding: 10,
    height: hp('26%')
  },
  itemType: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 2,
    color: '#86C9C8'
  },
  itemFullName: {
    paddingTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  itemInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10
  },
  itemSummary: {
    paddingTop: 10,
    paddingBottom: 10
  },
});

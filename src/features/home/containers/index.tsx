import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Carousel from 'react-native-snap-carousel';

import { courseList, Course } from '../api'

export class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Current learning</Text>
        <Courses/>
        <View style={styles.lastAccessed}>
        <Text>Last Accessed activity</Text><TouchableOpacity><Text>Go</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  courseProgram: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  lastAccessed: {
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  courses: {
    flex: 2
  }
});

type renderType = {
  item: Course
  index: number
}


const renderCourse = ( {item, index}: renderType ) => {
  return <Text key={item.id} style={styles.courseProgram}>{item.shortname} - {item.fullname}</Text>
}


export const Courses = courseList(({ data: {loading, courses, error} }) => {

        if (loading) return <Text>Loading...</Text>;
        if (error) return <Text>Error :(</Text>;

        if (courses) {

          return (
            <Carousel
              data={courses}
              renderItem={renderCourse}
              sliderWidth={500}
              itemWidth={500}
              sliderHeight={500}
            />
          )

        } else return null
  });
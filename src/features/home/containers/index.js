import {Component} from "react";
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Carousel from 'react-native-snap-carousel';
import { Card, Button } from 'react-native-material-ui';

import {courseList, Course} from '../api/index'

export class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Current learning</Text>
        <Courses/>
        <View style={styles.lastAccessed}>
        <Text>Last Accessed activity</Text><Button primary text="Go"/>
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
    flex: 0,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  courseProgram: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    borderWidth: 1,
    margin: 0,
  },
  lastAccessed: {
    flex: 0,
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  courses: {
    flex: 2
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
});

// type renderType = {
//   item: Course
//   index: number
// }


const renderCourse = ( {item, index} ) => {
  const imgSrc = 'http://10.0.8.178:4000/public/' + item.id + '.JPG'

  return (
    <Card>
    <ImageBackground source={{uri: imgSrc}} style={{width: '100%', height: '100%'}}>
      <Text key={item.id} style={styles.courseProgram}>{item.shortname} - {item.fullname}</Text>
    </ImageBackground>
    </Card>)
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
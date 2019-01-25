import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import { courseList } from '../api'

export class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Current learning</Text>
        <Courses/>
        <Text style={styles.lastAccessed}>Last Accessed activity</Text><TouchableOpacity><Text>Go</Text></TouchableOpacity>
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
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  courseProgram: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  lastAccessed: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

});



export const Courses = courseList(({ data: {loading, courses, error} }) => {

        if (loading) return <Text>Loading...</Text>;
        if (error) return <Text>Error :(</Text>;

        if (courses) {

          return (
            <View>
              {
                courses.map(({id, shortname, fullname})  => (<Text key={id} style={styles.courseProgram}>{shortname} - {fullname}</Text>))
              }
            </View>
          );

        } else return null
  });
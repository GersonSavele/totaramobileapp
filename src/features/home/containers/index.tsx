import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";


type CourseProgramSummary = {
  title: string
}

type HomeProps = {
  coursesPrograms: Array<CourseProgramSummary>
};

export class Home extends Component<HomeProps> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Current learning</Text>
        { this.props.coursesPrograms.map ( cp =>
            <Text style={styles.courseProgram} key={cp.title}>{cp.title}</Text>
        )}
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

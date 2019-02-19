import {Component} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Carousel from 'react-native-snap-carousel';
import { Button } from 'react-native-material-ui';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {courseList, Course} from '../api'
import config from '../../../lib/config';


export class Home extends Component {
  static navigationOptions = {
    title: 'Current Learnings',
  };

  state = {
    visible: false,
    show: false
  };

  componentWillMount() {
    setTimeout(() => {
      this.show();
    }, 1000);
  }

  show() {
   this.setState({show : true});
  }

  render() {
    let Courses2 = Courses(() => this.props.navigation.navigate('Course'))
    let imgSrc = config.mobileApi + '/public/panel1.png'

    return (
      <View style={styles.container}>
        <Courses2 visible={this.state.show}/>
        <View>
          <TouchableOpacity style={styles.lastAccessed} onPress={() => this.setState({visible: true})}>
            <Text onPress={() => this.setState({visible: true})}>Resume Last Accessed Activity</Text>
          </TouchableOpacity>
        </View>
        <SlidingUpPanel
          visible={this.state.visible}
          onRequestClose={() => this.setState({visible: false})}>
          <View style={styles.panel}>
            <Button style={ { container: {flex: 0, width: wp('18%') }} } icon='clear' text='' onPress={() => this.setState({visible: false})} />
            <Image source={{uri: imgSrc}} style={{width: wp('100%'), height: 240}}/>
            <Text style={styles.panelContent}>
              In this brief tutorial, you’ll explore what hierarchies are, how they are structured and the benefits of using them. You’ll also find out about job assignments in Totara Learn.
            </Text>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  activity: {
    flex: 1,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    borderWidth: 1,
    margin: 0,
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    width: wp('80%')
  },
  lastAccessed: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: wp('100%'),
    backgroundColor: '#CECECE',
    marginTop: 10,
    paddingLeft: 30
  },
  button: {
    alignItems: 'center',
    padding: 10
  },
  navigation: {
    paddingBottom: 20,
    width: wp('100%'),
    height: hp('10%')
  },
  panel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#CECECE',
  },
  panelContent: {
    flex: 10,
    padding: 20,
  }
});


const renderCourse = (courseNavigate) => ( {item, index} ) => {
  const imgSrc = config.mobileApi + '/public/' + item.id + '.JPG'

  return (
    <TouchableOpacity key={item.id} style={styles.courseProgram} onPress={courseNavigate} activeOpacity={1.0}>
      <Image source={{uri: imgSrc}} style={{width: '100%', height: '50%'}}/>
      <Text style={{ paddingLeft: 20, paddingTop: 20, fontSize: 20, fontWeight: 'bold'}}>{item.fullname}</Text>
      <Text style={{ padding: 20}}>{item.description}</Text>
    </TouchableOpacity>
  )
}


export const Courses = (courseNavigate) => courseList(({ data: {loading, courses, error} }) => {

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error :(</Text>;

    if (courses) {

      return (
        <Carousel
          data={courses}
          renderItem={renderCourse(courseNavigate)}
          sliderWidth={wp('100%')}
          itemWidth={wp('80%')}
          sliderHeight={hp('100%')}
          inactiveSlideOpacity={0.4}
        />
      )

    } else return null
  });
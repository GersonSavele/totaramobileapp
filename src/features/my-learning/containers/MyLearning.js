import {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import { Button } from 'react-native-material-ui';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment'

import config from '../../../lib/config';
import LearningItemCarousel from './LearningItemCarousel'
import RecentActivity from "./RecentActivity";
import Icon from "react-native-vector-icons/FontAwesome";

class Header extends Component {
  render() {
    return (
      <View>
        <Image source={require('./totara_logo.png')}/>
      </View>
    )
  }
}

export default class MyLearning extends Component {

  static navigationOptions = {
    headerTitle: <Header />,
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
    let courseNavigate = (course) => this.props.navigation.navigate('Course', { item: course })

    let LearningItems = LearningItemCarousel(courseNavigate)

    let imgSrc = config.mobileStatic + '/public/panel1.png'

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
          <Text style={styles.header}>My learning</Text>
          <Icon name="list" size={20}/>
        </View>
        <LearningItems visible={this.state.show}/>
        <RecentActivity onPress={() => this.setState({visible: true})}/>
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
  },
  header: {
    fontSize: 32,
    padding: 10
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
  },
});





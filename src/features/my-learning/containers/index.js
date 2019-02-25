import {Component} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Carousel from 'react-native-snap-carousel';
import { Button } from 'react-native-material-ui';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment'

import {learningItemsList} from '../api'
import config from '../../../lib/config';
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

class RecentActivity extends Component {
  style = StyleSheet.create({
    lastAccessed: {
      fontSize: 20,
      justifyContent: 'center',
      height: 65,
      width: wp('100%'),
      backgroundColor: '#CECECE',
      marginTop: 10,
    },
    topText: {
      padding: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#AAAAAA',
      paddingLeft: 20,
      fontWeight: 'bold',

    },
    bottomText: {
      padding: 5,
      height: 40,
      flexDirection: 'row'
    }
  })

  render() {
    return (
      <View>
        <TouchableOpacity style={this.style.lastAccessed} onPress={() => this.props.onPress()}>
          <Text style={this.style.topText}>Continue where you left off</Text>
          <View style={{flexDirection: 'row', paddingLeft: 20}}>
            <Icon name="film" size={24}/>
            <Text style={this.style.bottomText}>Setting up a hierarchy</Text>
          </View>
        </TouchableOpacity>
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
        <Text style={styles.header}>My learning</Text>
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


const itemDueDateStateStyle = (dateDateState) => {
  let backgroundColor
  switch (dateDateState) {
    case 'warning':
      backgroundColor = 'orange'
      break;
    case 'danger':
      backgroundColor = 'red'
      break;
    default:
      backgroundColor = 'black'
  }

  return {
    padding: 2,
    backgroundColor: backgroundColor
  }
}


const renderLearningItem = (courseNavigate) => ( {item, index} ) => {
  const imgSrc = config.mobileStatic + '/public/' + item.id + '.JPG'

  const renderDue = (dueDateState, dueDate) => {
    if (dueDate && dueDateState != 'info') {
      return (<Text style={itemDueDateStateStyle(item.dueDateState)}> Due {moment(dueDate).fromNow()} </Text>)
    } else if (dueDate) {
      return (<Text> {moment(dueDate).format("D, MMM YYYY")}</Text>)
    } else {
      return null
    }
  }

  return (
    <TouchableOpacity key={item.id} onPress={() => courseNavigate(item)} activeOpacity={1.0}>
      <Image source={{uri: imgSrc}} style={{width: '100%', height: '50%'}}/>
      {renderDue(item.dueDateState, item.dueDate)}
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


const LearningItemCarousel = (courseNavigate) => learningItemsList(({ data: {loading, currentLearning, error} }) => {

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
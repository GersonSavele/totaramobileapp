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
import {Image, StyleSheet, Text, View} from "react-native";
import PropTypes from 'prop-types';

import {Button} from "native-base";
import SlidingUpPanel from "rn-sliding-up-panel";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

import config from "../../../lib/config";
import LearningItemCarousel from "./LearningItemCarousel";
import RecentActivity from "./RecentActivity";
import Icon from "react-native-vector-icons/FontAwesome";
import {normalize} from "../../../components/Styles";

class Header extends React.Component {
  render() {
    return (
      <View style={styles.myLearningLogo}>
        <Image source={require("./totara_logo.png")}/>
      </View>
    );
  }
}

export default class MyLearning extends React.Component {

  static navigationOptions = {
    headerTitle: null,
    headerStyle: {
      height: 0,
      borderBottomWidth: 0
    }
  };


  state = {
    visible: false,
    show: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.show();
    }, 1000);
  }

  show() {
    this.setState({show: true});
  }

  render() {
    let courseNavigate = (course) => this.props.navigation.navigate("Course", {item: course});

    let LearningItems = LearningItemCarousel(courseNavigate);

    let imgSrc = config.mobileStatic + "/public/panel1.png";

    return (
      <View style={styles.myLearningContainer}>
        <Header/>
        <View style={styles.myLearningHeader}>
          <Text style={styles.myLearningHeaderText}>My learning</Text>
          <Icon name="list-ul" size={20}/>
        </View>
        <View style={styles.learningItems}>
          <LearningItems visible={this.state.show}/>
        </View>
        <View style={styles.recentActivity}>
          <RecentActivity onPress={() => this.setState({visible: true})}/>
        </View>
        <SlidingUpPanel
          visible={this.state.visible}
          onRequestClose={() => this.setState({visible: false})}>
          <View style={styles.panel}>
            <Button style={{container: {flex: 0, width: wp("18%")}}} iconRight="clear"
                    onPress={() => this.setState({visible: false})}/>
            <Image source={{uri: imgSrc}} style={{width: wp("100%"), height: 240}}/>
            <Text style={styles.panelContent}>
              In this brief tutorial, you’ll explore what hierarchies are, how they are structured and the benefits of
              using them. You’ll also find out about job assignments in Totara Learn.
            </Text>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}

MyLearning.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center",
  },
  myLearningLogo: {
    paddingLeft: 8,
    paddingTop: 8
  },
  myLearningHeader: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  myLearningHeaderText: {
    fontSize: normalize(28),
    paddingLeft: 10
  },
  learningItems: {
    flex: 32,
  },
  recentActivity: {
    flex: 1,
    minHeight: 40,
    maxHeight: 60
  },
  activity: {
    flex: 1,
    marginTop: 10,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    borderWidth: 1,
    margin: 0,
    backgroundColor: "#FFFFFF",
    borderColor: "#CCCCCC",
    width: wp("80%")
  },
  navigation: {
    paddingBottom: 20,
    width: wp("100%"),
    height: hp("10%")
  },
  panel: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#CECECE",
  },
  panelContent: {
    flex: 10,
    padding: 20,
  },
});





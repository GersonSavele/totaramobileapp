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
import {Image, Text, View} from "react-native";
import PropTypes from 'prop-types';

import {Button} from "native-base";
import SlidingUpPanel from "rn-sliding-up-panel";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

import {config} from "@totara/lib";
import LearningItemCarousel from "./LearningItemCarousel";
import RecentActivity from "./RecentActivity";
import Icon from "react-native-vector-icons/FontAwesome";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

import styles from "./styles/MyLearning"


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

    let imgSrc = config.mobileStatic + "/public/panel1.png";

    return (
      <View style={styles.myLearningContainer}>
        <View style={styles.myLearningLogo}>
          <Image source={require("./totara_logo.png")} style={{width:81, height: 20}}/>
        </View>
        <View style={styles.myLearningHeader}>
          <Text style={styles.myLearningHeaderText}>My learning</Text>
          <Icon name="list-ul" size={20}/>
        </View>
        <View style={styles.learningItems}>
          <LearningItemCarousel visible={this.state.show}/>
        </View>
        <View style={styles.recentActivity}>
          <RecentActivity onPress={() => this.setState({visible: true})}/>
        </View>
        <SlidingUpPanel
          visible={this.state.visible}
          onRequestClose={() => this.setState({visible: false})}>
          <View style={styles.panel}>
            <Button transparent onPress={() => this.setState({visible: false})}>
              <FontAwesomeIcon
                icon={faTimes}
                size={24}
              />
            </Button>
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
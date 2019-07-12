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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Activity } from "@totara/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {GradeDetailsCircle,GradeDetailsTitle,GradeDetailsProgress,GradeDetailsStatus } from "./components/GradeDetailsCircle";
import {ActivityBottomView, ActivityBottomViewTitle,ActivityBottomViewButton} from "../components/ActivityBottomView";
import ActivityHeaderView from "../components/ActivityHeaderView";
import { AuthenticatedWebView } from "@totara/auth";

class ScormActivity extends React.Component<Props, States> {

  constructor(props: Props) {
    super(props);
    this.state = { 
      screen : 1
    };
  }

  render(){
    switch (this.state.screen) {
        case 1:
          return (
             <View style = {styles.container}>
              <ActivityHeaderView title = "A title is one or more words used before or after a person's name, in certain contexts. It may signify either veneration, an official position, or a professional or academic qualification" 
              fontSize = {12}></ActivityHeaderView>
                <GradeDetailsCircle>
                  <GradeDetailsTitle text = "Your highest grade"></GradeDetailsTitle>
                  <GradeDetailsProgress text = "0"></GradeDetailsProgress>
                  <GradeDetailsStatus text = "VIEW TO COMPLETE" borderColor = "#000" color = "#000" ></GradeDetailsStatus>
                </GradeDetailsCircle>
              <ActivityBottomView>
                <ActivityBottomViewTitle attempt ="0" leftAttempt = "unlimited"></ActivityBottomViewTitle>
                <ActivityBottomViewButton buttonBackgroundColor = "#69BD45" buttonBorderColor = "#69BD45" 
                onPress = {this.loadScormPlayer} buttonTitleColor = "#FFF" buttonTitle = "Begin" buttonTitleFontWeight = "600"></ActivityBottomViewButton>
              </ActivityBottomView>
            </View>)
        case 2:
          return (
            <View style={{ flex: 1 }} >
              <Button transparent onPress={this.loadFeedbackView} style= {{ padding: 8}} >
              <FontAwesomeIcon icon="arrow-right" size={24}/>
              </Button>
              <AuthenticatedWebView uri={this.props.activity.url}/>
            </View>)
        default:
          return (
            <View style = {styles.container}>
              <ActivityHeaderView title = "A title is one or more words used before or after a person's name, in certain contexts. It may signify either veneration, an official position, or a professional or academic qualification" 
              fontSize = {12}></ActivityHeaderView>
              <GradeDetailsCircle>
                <GradeDetailsTitle text = "Your highest grade"></GradeDetailsTitle>
                <GradeDetailsProgress text = "80"></GradeDetailsProgress>
                <GradeDetailsStatus text = "PASSED" borderColor = "#69BD45" color = "#69BD45" ></GradeDetailsStatus>
                </GradeDetailsCircle>
              <ActivityBottomView>
                <ActivityBottomViewTitle attempt ="1" leftAttempt = "unlimited"></ActivityBottomViewTitle>
                <ActivityBottomViewButton buttonBackgroundColor = "#FFF" buttonBorderColor = "#3D444B" 
                onPress = {this.loadScormPlayer} buttonTitleColor = "#3D444B" buttonTitle = "Attempt again" buttonTitleFontWeight = "600"></ActivityBottomViewButton>
              </ActivityBottomView>
            </View>)
      }
  }
  loadScormPlayer = () => {
    this.setState({screen : 2})
  }

  loadFeedbackView = () => {
    this.setState({screen : 3})
  }

  loadInformationView = () => {
    this.setState({screen : 1})
  }
}

type Props = {
  activity: Activity
}

type States = { 
  screen : number
};
const styles = StyleSheet.create({
  container:{
    flex : 1, 
    alignItems: 'center', 
    flexDirection:'column', 
    alignContent:"space-between"
  }
});

export default ScormActivity;

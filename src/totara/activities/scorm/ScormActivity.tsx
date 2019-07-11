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
import { View } from "react-native";
import { Button } from "native-base";
import { Activity } from "@totara/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import GradeDetailsCircle from "./components/GradeDetailsCircle";
import ActivityBottomView from "../components/ActivityBottomView";
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
          <View style = {{flex : 1, alignItems: 'center', flexDirection:'column', alignContent:"space-between"}}>
            <ActivityHeaderView title = "A title is one or more words used before or after a person's name, in certain contexts. It may signify either veneration, an official position, or a professional or academic qualification" 
            fontSize = {12}></ActivityHeaderView>
            <GradeDetailsCircle gradeTitle = "Your highest grade" progress = {0} status = "VIEW TO COMPLETE" statusColor = "#000"></GradeDetailsCircle>
            <ActivityBottomView title = "" fontSize = {12} buttonTitle = "Begin" buttonBackgroundColor = "#69BD45" buttonTitleColor = "#FFF" buttonBorderColor = "#69BD45" 
            onPress = {this.loadScormPlayer}></ActivityBottomView>
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
          <View style = {{flex : 1, alignItems: 'center', flexDirection:'column', alignContent:"space-between"}}>
            <ActivityHeaderView title = {"Awesome Sandy.\n Your are doing great.!"} fontSize = {20}></ActivityHeaderView>
            <GradeDetailsCircle gradeTitle = "Your grade" progress = {80} status = "PASSED" statusColor = "#69BD45"></GradeDetailsCircle>
            <ActivityBottomView title = "" fontSize = {12} buttonTitle = "Attempt again" buttonBackgroundColor = "#FFF" buttonTitleColor = "#3D444B" buttonBorderColor = "#3D444B"  
            onPress = {this.loadInfromationView}></ActivityBottomView>
          </View>)
    }
  }
  loadScormPlayer = () => {
    this.setState({screen : 2})
  }

  loadFeedbackView = () => {
    this.setState({screen : 3})
  }

  loadInfromationView = () => {
    this.setState({screen : 1})
  }
}

type Props = {
  activity: Activity
}

type States = { 
  screen : number
};

export default ScormActivity;

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
import { View, WebView } from "react-native";
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
          <ActivityHeaderView title = "" fontSize = {10}></ActivityHeaderView>
          <GradeDetailsCircle gradeTitle = "" progress = {3} status = "" statusColor = ""></GradeDetailsCircle>
          <ActivityBottomView title = "" fontSize = {10} buttonTitle = "" buttonBackgroundColor = "" buttonTitleColor = "" buttonBorderColor = "" 
          onPress = {this.loadScormPlayer}></ActivityBottomView>
        </View>)
        case 2:
        return (
      <View style={{ flex: 1 }} >
      <Button transparent onPress={this.loadFeedbackView} style= {{ padding: 8}} >
        <FontAwesomeIcon icon="arrow-right" size={24} />
      </Button>
      <AuthenticatedWebView uri={"/mod/scorm/view.php?id=4"}/>
    </View>)
      default:
        return (
          <View style = {{flex : 1, alignItems: 'center', flexDirection:'column', alignContent:"space-between"}}>
          <ActivityHeaderView title = "" fontSize = {10}></ActivityHeaderView>
          <GradeDetailsCircle gradeTitle = "" progress = {3} status = "" statusColor = ""></GradeDetailsCircle>
        </View>)
    }
  }

  loadScormPlayer = () => {
    this.setState({screen : 2})
  }

  loadFeedbackView = () => {
    this.setState({screen : 3})
  }
}

type Props = {
  activity: Activity
}

type States = { 
  screen : number
};

export default ScormActivity;

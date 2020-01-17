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
import { View, StyleSheet, Text } from "react-native";
import { Button } from "native-base";
import { Activity } from "@totara/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Query } from "react-apollo";
import { Response, ScormGQLQuery }  from "./api";

import { GradeDetailsCircle,GradeDetailsTitle,GradeDetailsProgress,GradeDetailsStatus } from "./components/GradeDetailsCircle";
import { ActivityBottomView, ActivityBottomViewTitle,ActivityBottomViewButton } from "../components/ActivityBottomView";
import ActivityHeaderView from "../components/ActivityHeaderView";
import { AuthenticatedWebView } from "@totara/auth";
import { translate } from "@totara/locale";



type ScormActivityViewParam = {
  data: any,
  error: any,
  loading : boolean,
  headerViewFontSize? : number,
  gradeDetailsTitle : string,
  gradeDetailsStatus : string,
  borderColor : string,
  color : string,
  bottomViewButtonTitle : string,
  bottomViewButtonTitleColor : string,
  bottomViewButtonBackgroundColor : string,
  bottomViewButtonBorderColor : string,
  bottomViewButtonTitleFontWeight : string
}

class ScormActivity extends React.Component<Props, States> {

  constructor(props: Props) {
    super(props);
    this.state = {
      screen : 1
    };
  }


  showScormDetails = ({data, error, loading, headerViewFontSize, gradeDetailsTitle, gradeDetailsStatus, borderColor,
    color,bottomViewButtonTitle,bottomViewButtonTitleColor,bottomViewButtonBackgroundColor,bottomViewButtonBorderColor,
    bottomViewButtonTitleFontWeight }: ScormActivityViewParam )  => {
    if (loading) return <Text>{translate("general.loading")}</Text>;
    if (error) return <Text>{translate("general.error")}(</Text>;
    if (data) {
      return(
        <View style = {styles.container}>
         <ActivityHeaderView title = {this.props.activity.itemName}
         fontSize = {headerViewFontSize}></ActivityHeaderView>
         <GradeDetailsCircle>
          <GradeDetailsTitle text = {gradeDetailsTitle}></GradeDetailsTitle>
          <GradeDetailsProgress text = {data.scorm.score.toString()}></GradeDetailsProgress>
          <GradeDetailsStatus text = {gradeDetailsStatus} borderColor = {borderColor} color = {color} ></GradeDetailsStatus>
         </GradeDetailsCircle>
         <ActivityBottomView>
          <ActivityBottomViewTitle currentAttempts ={data.scorm.currentAttempt.toString()} maxAttempts = {data.scorm.maxAttempt.toString()}></ActivityBottomViewTitle>
          <ActivityBottomViewButton buttonBackgroundColor = {bottomViewButtonBackgroundColor} buttonBorderColor = {bottomViewButtonBorderColor}
          onPress = {this.loadScormPlayer} buttonTitleColor = {bottomViewButtonTitleColor} buttonTitle = {bottomViewButtonTitle} buttonTitleFontWeight = {bottomViewButtonTitleFontWeight}></ActivityBottomViewButton>
        </ActivityBottomView>
        </View>)
      }
    }


  render(){
    switch (this.state.screen) {
        case 1:
          return (
             <View style = {styles.container}>
              <Query <Response>  query= { ScormGQLQuery } variables = {{ id : this.props.activity.id }}>
              {({ data, error, loading }) => (
                this.showScormDetails({
                   data : data,
                   error : error,
                   loading : loading,
                   headerViewFontSize : 12,
                   gradeDetailsTitle : translate("Your highest grade"),
                   gradeDetailsStatus : translate("VIEW TO COMPLETE"),
                   borderColor : "#000",
                   color: "#000",
                   bottomViewButtonTitle : translate("Begin"),
                   bottomViewButtonTitleColor: "#FFF",
                   bottomViewButtonBackgroundColor: "#69BD45",
                   bottomViewButtonBorderColor: "#69BD45",
                   bottomViewButtonTitleFontWeight: "600"
                }) || null
              )}
            </Query>
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
              <Query <Response>  query= { ScormGQLQuery } variables = {{ id : this.props.activity.id }}>
              {({ loading, data, error }) => (
                this.showScormDetails({
                  data : data,
                  error : error,
                  loading : loading,
                  headerViewFontSize : 12,
                  gradeDetailsTitle : translate("Your highest grade"),
                  gradeDetailsStatus : translate("PASSED"),
                  borderColor : "#69BD45",
                  color: "#69BD45",
                  bottomViewButtonTitle : translate("Attempt again"),
                  bottomViewButtonTitleColor: "#3D444B",
                  bottomViewButtonBackgroundColor: "#FFF",
                  bottomViewButtonBorderColor: "#3D444B",
                  bottomViewButtonTitleFontWeight: "600"
               }) || null
               )}
            </Query>
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

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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React from "react";
import { StyleSheet, View, Image, Text, TextInput } from "react-native";
import * as Animatable from 'react-native-animatable';

import { gutter, h1, normal, PrimaryButton } from "@totara/theme";

enum ViewFlex {
  header= 3,
  detail= 3,
  action= 5,
  headerOff= 3,
  detailOff= 1,
  actionOff= 7
};

export default class SiteUrl extends React.Component<Props> {

  static actionType: number = 1;
  
  toggleView = (isShow: boolean) => {
    if (isShow) {
      this.refs.viewHeader.transitionTo({flex: ViewFlex.headerOff});
      this.refs.viewInformation.transitionTo({flex: ViewFlex.detailOff});
      this.refs.viewController.transitionTo({flex: ViewFlex.actionOff});
    } else {
      this.refs.viewHeader.transitionTo({flex: ViewFlex.header});
      this.refs.viewInformation.transitionTo({flex: ViewFlex.detail});
      this.refs.viewController.transitionTo({flex: ViewFlex.action});
    }
  };

  setInputSiteUrl = () => {
    this.props.onSetupLoginData(this.state.inputSiteUrl, SiteUrl.actionType);
  };

  isValidSiteUrl = () => {
    if (this.state && this.state.inputSiteUrl) {
      return this.isValidUrlText(this.state.inputSiteUrl);
    }
    return false
  };

  isValidUrlText = (urlText: string) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(urlText);
  };

  render() {
    return (
      <View style={styles.siteUrlContainer}>
        <Animatable.View style={styles.headerContainer} ref="viewHeader" >
          <Image source={require("@resources/images/totara_logo.png")} style={styles.totaraLogo} resizeMode="stretch" />
        </Animatable.View>
        <Animatable.View style={ styles.detailsContainer } ref="viewInformation" >
          <Text style={styles.detailTitle}>Get started.</Text>
          <Text style={styles.information}>Please enter your site url</Text>
        </Animatable.View>
        <Animatable.View style={styles.actionContainer} ref="viewController">
          <TextInput style={styles.inputTextUrl} keyboardType="url" placeholder="Enter site url" clearButtonMode="while-editing" autoCapitalize="none" onChangeText={ (text) => this.setState({ inputSiteUrl: text }) } onFocus={() => this.toggleView(true)} onBlur={ () => this.toggleView(false)} />
          <PrimaryButton onPress={this.setInputSiteUrl} text="Enter" disabled={!this.isValidSiteUrl()} />
        </Animatable.View>
      </View>
    );
  };
}

type Props = {
  onSetupLoginData: (dataSetupSecret: string, currentAction: number) => {}
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: gutter,
  },

  headerContainer: {
    flex: ViewFlex.header,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  totaraLogo: {
    height: 120,
    width: 120,
  },

  detailsContainer: {
    flex: ViewFlex.detail,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  detailTitle: {
    fontSize: h1,
  },
  information: {
    fontSize: normal,
    color: "#696969",
  },

  actionContainer: {
    flex: ViewFlex.action,
    justifyContent: "flex-start",
  },
  inputTextUrl: {
    borderBottomWidth: 1,
    borderColor: "#D2D2D2",
    height: 44,
    marginVertical: 10
  }
});
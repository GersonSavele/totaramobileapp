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

import { gutter, h1, normal, PrimaryButton } from "@totara/theme";

export default class SiteUrl extends React.Component <Props> {
  
  static actionType: number = 1;
  
  setInputSiteUrl = ()=> {
    this.props.onSetupLoginData(this.state.inputSiteUrl, SiteUrl.actionType);
  };

  isValidSiteUrl = ()=> {
    if (this.state && this.state.inputSiteUrl) {
      return this.isValidUrlText(this.state.inputSiteUrl);
    }
    return false
  };
  
  isValidUrlText = (urlText: string) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(urlText);
  };

  render() {
    return (
      <View style={styles.siteUrlContainer}>
        <Image source={require("@resources/images/totara_logo.png")} style={styles.totaraLogo} resizeMode="stretch"  />
        <View style={styles.detailsContainer}>
          <Text style={styles.header}>Get started.</Text>
          <Text style={styles.information}>Please enter your site url</Text>
        </View>
        <TextInput style={styles.inputTextUrl} keyboardType="url" placeholder="http://www.totoralearning.com" clearButtonMode="while-editing" autoCapitalize="none" onChangeText={(text) => this.setState({inputSiteUrl: text})} />
        <PrimaryButton onPress={this.setInputSiteUrl} text="Enter" disabled={!this.isValidSiteUrl()} />
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
    alignItems: 'stretch',
    paddingHorizontal: gutter,
  },
  totaraLogo: {
    height: 120,
    width: 120,
    alignItems: 'flex-start',
  },
  detailsContainer: {
    alignItems: "flex-start",
  },
  header: {
    fontSize: h1,
  },
  information: {
    fontSize: normal,
    color: "#696969",
  },
  inputTextUrl: {
    height: 35,
    borderBottomWidth: 1,
    borderColor: "#a9a9a9",
    marginBottom: 20,
    marginTop: 10
  }
});
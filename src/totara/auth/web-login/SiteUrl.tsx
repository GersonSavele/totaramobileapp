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
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

enum ViewFlex {
  keyboardOff= 1, keyboardOn= 3
};

export default class SiteUrl extends React.Component<Props, State> {

  static actionType: number = 1;

  viewKeyboard = React.createRef<Animatable.View>();

  constructor(props: Props) {
    super(props);
  }
  
  toggleView = (isShow: boolean) => {
    if (isShow) {
      this.viewKeyboard.current!.transitionTo({flex: ViewFlex.keyboardOn});
    } else {
      this.viewKeyboard.current!.transitionTo({flex: ViewFlex.keyboardOff});
    }
  };
  
  setInputSiteUrl = () => {
    var valueSiteUrl = this.state.inputSiteUrl;
    if ( !this.isExistProtocol(this.state.inputSiteUrl) ) {
      valueSiteUrl = `http://${valueSiteUrl}`;
    }
    this.props.callBack(valueSiteUrl, SiteUrl.actionType);
  };

  isValidSiteUrl = () => {
    if (this.state && this.state.inputSiteUrl) {
      return this.isValidUrlText(this.state.inputSiteUrl);
    }
    return false
  };

  isValidUrlText = (urlText: string) => {
    var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
    return pattern.test(urlText);
  };

  isExistProtocol = (urlText: string) => {
    var pattern = new RegExp("^(https?:\\/\\/)");
    return pattern.test(urlText);
  };

  render() {
    return (
      <View style={styles.siteUrlContainer}>
        <View style={styles.headerContainer} >
          <Image source={require("@resources/images/totara_logo.png")} style={styles.totaraLogo} resizeMode="stretch" />
        </View>
        <Animatable.View style={ styles.container } >
          <Text style={styles.detailTitle}>Get started.</Text>
          <Text style={styles.information}>Please enter your site url</Text>
          <TextInput
            style={styles.inputTextUrl}
            keyboardType="url"
            placeholder="Enter site url"
            clearButtonMode="while-editing" 
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ inputSiteUrl: text })}
            onFocus={() => this.toggleView(true)}
            onBlur={() => this.toggleView(false)} />
          <PrimaryButton onPress={this.setInputSiteUrl} text="Enter" disabled={!this.isValidSiteUrl()} />
        </Animatable.View>
        <Animatable.View style={ styles.keyboard } ref={this.viewKeyboard} ></Animatable.View>
      </View>
    );
  };
}

type Props = {
  callBack: (data: string, currentAction: number) => void
};

type State = {
  inputSiteUrl: string
}
const styles = StyleSheet.create({
  siteUrlContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: gutter,
  },
  headerContainer: {
    height: hp("21%"),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  totaraLogo: {
    height: 120,
    width: 120,
    backgroundColor: "white"
  },
  container: {
    flex: 2.2,
    justifyContent: "flex-end",
  },
  detailTitle: {
    fontSize: h1,
  },
  information: {
    fontSize: normal,
    color: "#696969",
  },
  inputTextUrl: {
    borderBottomWidth: 1,
    borderColor: "#D2D2D2",
    height: 44,
    marginVertical: 10
  },
  keyboard : {
    flex: ViewFlex.keyboardOff,
    justifyContent: "center",
  }
});
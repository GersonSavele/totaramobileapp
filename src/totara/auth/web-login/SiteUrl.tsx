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
import React, { RefObject } from "react";
import { StyleSheet, View, Image, Text, TextInput, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import { gutter, h1, h4, normal, resizeByScreenSize, PrimaryButton } from "@totara/theme";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

enum ViewFlex {
  keyboardOff= 1, keyboardOn= 3
};

export default class SiteUrl extends React.Component<Props, State> {

  static actionType: number = 1;

  constructor(props: Props) {
    super(props);   
    this.state = {
      showError: false,
      inputSiteUrl: ""
    };
  }

  viewKeyboard = React.createRef<Animatable.View>();
  refTextInputSiteUrl: RefObject<TextInput> = React.createRef<TextInput>();

  toggleView = (isShow: boolean) => {
    if (isShow) {
      this.viewKeyboard.current!.transitionTo({flex: ViewFlex.keyboardOn});
    } else {
      this.viewKeyboard.current!.transitionTo({flex: ViewFlex.keyboardOff});
    }
  };

  setInputSiteUrl = () => {
    const isValidSiteAddress = this.isValidSiteUrl();
    this.setState({
      showError: !isValidSiteAddress
    });
    if (isValidSiteAddress) {
      var valueSiteUrl = this.state.inputSiteUrl;
      if ( !this.isExistProtocol(this.state.inputSiteUrl) ) {
        valueSiteUrl = `http://${valueSiteUrl}`;
      }
      this.props.callBack(valueSiteUrl, SiteUrl.actionType);
    }
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
  
  componentDidMount() {
    setTimeout(() => {
      this.refTextInputSiteUrl.current!.focus();
    }, 300);
  }

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
            ref={this.refTextInputSiteUrl}
            style={styles.inputTextUrl}
            keyboardType="url"
            placeholder="Enter site url"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ inputSiteUrl: text, showError: false})}
            onFocus={() => this.toggleView(true)}
            onBlur={() => this.toggleView(false)} />
          <View style={ this.state.showError ? [styles.errorContainer, styles.errorOn] :  styles.errorContainer }  >
            <View style={styles.arrow}></View>
            <View  style={styles.errorContent}>
              <FontAwesomeIcon icon="exclamation-circle" size={12} color="white" background="white"/>
              <Text style={styles.errorMessage}>Enter a valid site address</Text>
            </View>
          </View>
          <PrimaryButton onPress={this.setInputSiteUrl} text="Enter" />
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
  inputSiteUrl: string,
  showError: boolean
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  headerContainer: {
    height: hp("21%"),
    flexDirection: "row",
    alignItems: "flex-end",

  },
  totaraLogo: {
    height: resizeByScreenSize(68, 68, 87, 87),
    width: resizeByScreenSize(94, 94, 120, 120),

  },
  container: {
    flex: resizeByScreenSize(2.1, 2.6, 2.8, 1),
    justifyContent: "flex-end",
  },
  detailTitle: {
    fontSize: 26,
  },
  information: {
    fontSize: 20,
    color: "#64717D",
  },
  inputTextUrl: {
    zIndex: 10,
    borderBottomWidth: 1,
    borderColor: "#D2D2D2",
    height: 44,
    marginTop: resizeByScreenSize (16, 40, 40, 40),
    color: "black"
  },
  inputTextUrlErrorOn: {
    color: "#953539"
  },
  keyboard : {
    flex: ViewFlex.keyboardOff,
    justifyContent: "center",
  },
  errorContainer: {
    marginBottom: resizeByScreenSize (8, 8, 16, 16),
    flexDirection: "column",
    justifyContent: "flex-start",
    opacity: 0.0
  },
  errorOn: {
    opacity: 1.0
  },
  errorContent: {
    backgroundColor: "#953539",
    padding: resizeByScreenSize (4, 4, 8, 8),
    flexDirection: "row",
    top: -resizeByScreenSize (7, 7, 15, 15),
    alignItems: "center"
  },
  errorMessage: {
    fontSize: 12,
    color: "white",
    marginLeft: resizeByScreenSize (4, 4, 8, 8),
  }, 
  arrow: {
    zIndex: 0,
    width: 0,
    height: 0,
    borderLeftWidth: resizeByScreenSize(8, 8, 16, 16),
    borderLeftColor: "transparent",
    borderRightWidth: resizeByScreenSize(8, 8, 16, 16),
    borderRightColor: "transparent",
    borderBottomWidth: resizeByScreenSize(16, 16, 32, 32),
    borderBottomColor: "#953539",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    top: -resizeByScreenSize(7, 7, 15, 15),
    marginLeft: resizeByScreenSize(8, 8, 16, 16),
    backgroundColor: "transparent",
    borderColor: "transparent"
  }
});

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
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  Dimensions,
  Platform,
  EmitterSubscription,
  KeyboardEvent
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { resizeByScreenSize, theme } from "@totara/theme";
import { PrimaryButton } from "@totara/components";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { translate } from "@totara/locale";
import { config } from "@totara/lib";

enum ViewFlex {
  keyboardOff = 1, keyboardOn = 3
}

class SiteUrl extends React.Component<Props, State> {

  static actionType: number = 1;

  private keyboardDidShowListener?: EmitterSubscription;
  private keyboardWillHideListener?: EmitterSubscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      showError: false,
      inputSiteUrl: this.props.siteUrl,
      keyboardHeight: 0
    };
  }

  refTextInputSiteUrl = React.createRef<TextInput>();

  setInputSiteUrl = () => {
    var siteUrlValue = this.state.inputSiteUrl
    const isValidSiteAddress = (siteUrlValue) ? this.isValidUrlText(siteUrlValue!) : false;

    this.setState({
      showError: !isValidSiteAddress
    });
    if (isValidSiteAddress) {
      siteUrlValue = this.formatUrl(siteUrlValue!);
      this.setState({
        inputSiteUrl: siteUrlValue
      });
      this.props.onSuccessfulSiteUrl(siteUrlValue!, SiteUrl.actionType);
    }
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

  formatUrl = (urlText: string) => {
    var pattern = new RegExp("^(https?:\\/\\/)", "i"); // fragment locator
    if (!pattern.test(urlText)) {
      return config.urlProtocol + "://" + urlText;
    }
    return urlText;
  };

  componentDidMount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this.onKeyboardDidShow
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this.onKeyboardWillHide
      );
    }
    setTimeout(() => {
      if (this.refTextInputSiteUrl.current) {
        this.refTextInputSiteUrl.current!.focus();
      }
    }, 300);
  }

  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove();
    }
  }

  onKeyboardDidShow = (e: KeyboardEvent) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  };

  onKeyboardWillHide = () => {
    this.setState({
      keyboardHeight: 0
    });
  };

  setStateInputSiteUrlWithShowError = (siteUrl: string) => {
    this.setState({ inputSiteUrl: siteUrl, showError: false });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.siteUrlContainer}>
            <View style={styles.container}>
              <Image source={require("@resources/images/totara_logo.png")} style={styles.totaraLogo} resizeMode="stretch" />
              <View >
                <Text style={styles.infoTitle}>{translate("manual.site_url_title")}</Text>
                <Text style={styles.infoDescription}>{translate("manual.site_url_information")}</Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.inputTextUrl}
                ref={this.refTextInputSiteUrl}
                keyboardType="url"
                placeholder={translate("manual.site_url_text_placeholder")}
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onChangeText={this.setStateInputSiteUrlWithShowError}
                value={this.state.inputSiteUrl ? this.state.inputSiteUrl : ""} />
              <View style={this.state.showError ? [styles.errorContainer, styles.errorOn] : styles.errorContainer}  >
                <View style={styles.arrow}></View>
                <View style={styles.errorContent}>
                  <FontAwesomeIcon icon="exclamation-circle" size={12} color="white" background="white" />
                  <Text style={styles.errorMessage}>{translate("message.enter_valid_url")}</Text>
                </View>
              </View>
              <PrimaryButton onPress={this.setInputSiteUrl} text={translate("general.enter")} />
            </View>
          </View>
        </ScrollView>
        <View style={{ height: this.state.keyboardHeight }}></View>
      </View>
    );
  }
}

type Props = {
  onSuccessfulSiteUrl: (data: string, currentAction: number) => void
  siteUrl?: string
};

type State = {
  inputSiteUrl?: string,
  showError: boolean,
  keyboardHeight: number
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    paddingHorizontal: 16,
    flex: 1
  },
  totaraLogo: {
    marginTop: resizeByScreenSize(32, 64, 64, 64),
    height: resizeByScreenSize(68, 68, 87, 87),
    width: resizeByScreenSize(94, 94, 120, 120),
    alignSelf: "center"
  },
  container: {
    height: Dimensions.get("window").height * 0.4,
    justifyContent: "space-between"
  },
  infoTitle: {
    fontSize: resizeByScreenSize(22, 26, 26, 26),
    color: theme.h1Color
  },
  infoDescription: {
    fontSize: resizeByScreenSize(15, 20, 20, 20),
    color: theme.h3Color
  },
  formContainer: {
    marginVertical: resizeByScreenSize(10, 20, 20, 20)
  },
  inputTextUrl: {
    borderBottomWidth: 1,
    borderColor: "#D2D2D2",
    height: 40
  },
  keyboard: {
    flex: ViewFlex.keyboardOff,
    justifyContent: "center"
  },
  errorContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    opacity: 0.0,
    top: -10
  },
  errorOn: {
    opacity: 1.0
  },
  errorContent: {
    // backgroundColor: "#953539",
    padding: 6,
    flexDirection: "row",
    top: -5,
    alignItems: "center"
  },
  errorMessage: {
    fontSize: 12,
    color: "white",
    marginLeft: 4
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: "#953539",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    top: -5,
    marginLeft: 8,
    backgroundColor: "transparent",
    borderColor: "transparent"
  }
});

export default SiteUrl;

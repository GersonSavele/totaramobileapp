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
import { StyleSheet, View, Image, Text, TextInput, SafeAreaView, Platform, ScrollView, Keyboard, KeyboardEvent, EmitterSubscription } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button } from "native-base";

import { resizeByScreenSize, theme } from "@totara/theme";
import { PrimaryButton } from "@totara/components/PrimaryButton";
import { translate } from "@totara/locale";

enum StatusInput {
  normal = 0, focus, error
}

class NativeLogin extends React.Component<Props, State> {
  
  static actionType: number = 2;
  private preUsername?: string = undefined;
  private preStatusUsername: StatusInput = StatusInput.normal;
  private keyboardDidShowListener?: EmitterSubscription;
  private keyboardDidHideListener?: EmitterSubscription;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      statusInputUsername: StatusInput.normal,
      statusInputPassword: StatusInput.normal,
      keyboardHeight: 0
    };
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this.onKeyboardDidShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this.onKeyboardDidHide
      );
    }
  }

  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  onKeyboardDidShow = (e: KeyboardEvent) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  };

  onKeyboardDidHide = () => {
    this.setState({
      keyboardHeight: 0
    });
  };

  setStateInputUsernameWithShowError = (username: string) => {
    this.setState({ inputUsername: username });
  };

  setStateInputPasswordWithShowError = (password: string) => {
    this.setState({ inputPassword: password });
  };

  onBlurUsername = () => {
    if (this.state.inputUsername == this.preUsername) {
      this.setState({
        statusInputUsername: this.preStatusUsername
      })
    } else {
      this.setState({ statusInputUsername: StatusInput.normal });
    }
  };

  onClickEnter = () => {
    this.preUsername = this.state.inputUsername;
    this.preStatusUsername = StatusInput.normal;

    let tempStatusInputUsername =  StatusInput.normal;
    let tempUsernameInfoMessage =  undefined;
    let tempStatusInputPassword =  StatusInput.normal;
    let tempPasswordInfoMessage =  undefined;

    if ((this.state.inputUsername && this.state.inputUsername != "wrong") && (this.state.inputPassword && this.state.inputPassword != "")) {
      //@TODO will be covered in MOB-172
    } else {
      if (!this.state.inputUsername || this.state.inputUsername == "" || this.state.inputUsername == "wrong") {
        this.preStatusUsername = StatusInput.error;
        tempStatusInputUsername = StatusInput.error;
        tempUsernameInfoMessage = translate("message.enter_valid_username");
      }
      if (!this.state.inputPassword || this.state.inputPassword == "") {
        tempStatusInputPassword = StatusInput.error;
        tempPasswordInfoMessage = translate("message.enter_valid_password");
      }
    }
    this.setState({
      statusInputUsername: tempStatusInputUsername,
      usernameInfoMessage: tempUsernameInfoMessage,
      statusInputPassword: tempStatusInputPassword,
      passwordInfoMessage: tempPasswordInfoMessage
    });
  };

  getStatusStyle = (inputState: StatusInput) => {
    switch (inputState) {
      case StatusInput.error:
        return styles.errorOn;
      case StatusInput.focus:
        return styles.focusOn;
      default:
        return styles.normal;
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.navigation} >
          <Button transparent onPress={() => { this.props.onBack(NativeLogin.actionType) }} style={styles.actionItem} >
            <FontAwesomeIcon icon="times" size={22} color={"#000000"} />
          </Button>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Image source={{ uri: theme.logoUrl }} style={styles.totaraLogo} />
            <View style={styles.infoContainer}>
              <Text style={styles.detailTitle}>{translate("native-login.header_title")}</Text>
              <Text style={styles.information}>{translate("native-login.login_information")}</Text>
            </View>
            <View style={styles.formContainer} >
              <View style={styles.input} >
                <TextInput
                  style={[styles.inputText, this.getStatusStyle(this.state.statusInputUsername)]}
                  placeholder={translate("native-login.username_text_placeholder")}
                  clearButtonMode="while-editing"
                  autoCapitalize="none"
                  onChangeText={this.setStateInputUsernameWithShowError}
                  onFocus={() => { this.setState({ statusInputUsername: StatusInput.focus }); }}
                  onBlur={() => { this.onBlurUsername() }}
                  value={this.state.inputUsername} />
                <Text style={[styles.inputInfo, this.getStatusStyle(this.state.statusInputUsername)]} >{this.state.usernameInfoMessage}</Text>
              </View>
              <View style={styles.input} >
                <TextInput
                  style={[styles.inputText, this.getStatusStyle(this.state.statusInputPassword)]}
                  secureTextEntry={true}
                  placeholder={translate("native-login.password_text_placeholder")}
                  onChangeText={this.setStateInputPasswordWithShowError}
                  onFocus={() => { this.setState({ inputPassword: undefined, statusInputPassword: StatusInput.focus }); }}
                  onBlur={() => { this.setState({ statusInputPassword: StatusInput.normal }); }}
                  value={this.state.inputPassword} />
                <Text style={[styles.inputInfo, this.getStatusStyle(this.state.statusInputPassword)]} >{this.state.passwordInfoMessage}</Text>
              </View>
              <Text style={styles.forgotCredential} onPress={() => { }} >{translate("native-login.forgot_username_password")}</Text>
              <PrimaryButton onPress={this.onClickEnter} text={translate("general.enter")} />
            </View>
          </View>
        </ScrollView>
        <View style={{height: this.state.keyboardHeight}}></View>
      </SafeAreaView>
    );
  }
}

type Props = {
  onSuccessfulSiteUrl: (data: string, currentAction: number) => void
  siteUrl?: string,
  onBack: (action: number) => void
};

type State = {
  inputUsername?: string,
  inputPassword?: string,
  statusInputUsername: StatusInput,
  statusInputPassword: StatusInput,
  passwordInfoMessage?: string,
  usernameInfoMessage?: string,
  keyboardHeight: number
};

const TotaraColor = {
  red: "#953539",
  green: "#69BD45",
  ash: "#D2D2D2",
  black: "#000000",
  light_black: "#64717D"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16
  },
  navigation: {
    height: 44,
    alignItems: "flex-start",
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actionItem: {
    padding: 8
  },
  totaraLogo: {
    height: 72,
    maxHeight: 144,
    width: "100%",
    resizeMode: "contain",
    marginVertical: 8
  },
  infoContainer: {
    justifyContent: "space-between",
    textAlignVertical: "center",
    marginVertical: 8
  },
  detailTitle: {
    fontSize: resizeByScreenSize(22, 26, 26, 26),
  },
  information: {
    fontSize: resizeByScreenSize(15, 20, 20, 20),
    color: TotaraColor.light_black,
  },
  formContainer: {
    marginVertical: 8,
    marginBottom: 20
  },
  input: {
    paddingBottom: 6
  },
  inputText: {
    color: TotaraColor.black,
    borderBottomWidth: 1,
    borderRadius: (Platform.OS === "ios") ? 5 : 0,
    borderLeftWidth: (Platform.OS === "ios") ? 1 : 0,
    borderRightWidth: (Platform.OS === "ios") ? 1 : 0,
    borderTopWidth: (Platform.OS === "ios") ? 1 : 0,
    borderColor: TotaraColor.ash,
    height: 40,
    paddingLeft: 4,
    paddingRight: 4
  },
  focusOn: {
    color: TotaraColor.black,
    borderColor: TotaraColor.green
  },
  normal: {
    color: TotaraColor.black
  },
  errorOn: {
    opacity: 1.0,
    color: TotaraColor.red,
    borderColor: TotaraColor.red
  },
  inputInfo: {
    opacity: 0.0,
    fontSize: 12,
    marginLeft: (Platform.OS === "ios") ? 8 : 4,
  },
  forgotCredential: {
    color: TotaraColor.light_black,
    fontSize: resizeByScreenSize(14, 16, 16, 16),
    paddingBottom: 16,
    textDecorationLine: "underline",
    textAlign: "right"
  },
  keyboard: {
    height: 0,
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

export default NativeLogin;
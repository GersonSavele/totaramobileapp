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
import { StyleSheet, View, Image, Text, TextInput, SafeAreaView, Alert, Platform, ScrollView, Dimensions } from "react-native";
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { resizeByScreenSize, PrimaryButton, theme } from "@totara/theme";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { translate } from "@totara/locale";

enum StatusInput {
  normal = 0, focus, error
}

class NativeLogin extends React.Component<Props, State> {

  static actionType: number = 2;

  constructor(props: Props) {
    super(props);
    this.state = {
      statusInputUsername: StatusInput.normal,
      statusInputPassword: StatusInput.normal
    };
  }

  setStateInputUsernameWithShowError = (username: string) => {
    this.setState({ inputUsername: username });
  };

  setStateInputPasswordWithShowError = (password: string) => {
    this.setState({ inputPassword: password });
  };

  onClickEnter = () => {
    if((this.state.inputUsername && this.state.inputUsername != "") && (this.state.inputPassword && this.state.inputPassword != "")) {
      //@TODO MOB-168
    } else {
      if(!this.state.inputUsername || this.state.inputUsername == "") {
        this.setState({
          statusInputUsername: StatusInput.error
        });
      }
      if(!this.state.inputPassword || this.state.inputPassword == "") {
        this.setState({
          statusInputPassword: StatusInput.error
        });
      }
    }
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
        <ScrollView>
          <View style={styles.container}>
            <Image source={{uri: this.props.brandLogo}} style={styles.totaraLogo} />
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
                  onBlur={() => { this.setState({ statusInputUsername: StatusInput.normal }); }}
                  value={this.state.inputUsername} />
                <Text style={[styles.inputInfo, this.getStatusStyle(this.state.statusInputUsername)]} >{translate("message.enter_valid_username")}</Text>
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
                <Text style={[styles.inputInfo, this.getStatusStyle(this.state.statusInputPassword)]} >{translate("message.enter_valid_password")}</Text>
              </View>
              <Text style={styles.forgotCredential} onPress={() => { }} >{translate("native-login.forgot_username_password")}</Text>
              <PrimaryButton onPress={this.onClickEnter} text={translate("general.enter")} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

type Props = {
  onSuccessfulSiteUrl: (data: string, currentAction: number) => void
  siteUrl?: string,
  brandLogo: string
};

type State = {
  inputUsername?: string,
  inputPassword?: string,
  statusInputUsername: StatusInput,
  statusInputPassword: StatusInput
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
    marginVertical: 8
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
  }
});

export default NativeLogin;
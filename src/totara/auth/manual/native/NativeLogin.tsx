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
  TouchableOpacity,
  Linking
} from "react-native";
import { Form, Input, Container, Content, Header } from "native-base";

import { config } from "@totara/lib";
import {
  resizeByScreenSize,
  theme,
  gutter,
  fontSizeH2,
  fontSizeH4,
  textColorDark,
  colorSecondary1,
  colorAccent,
  lineHeightH2,
  lineHeightH4,
  fontSizeB1,
  lineHeightB1,
  navigationHeaderTintColor
} from "@totara/theme";
import { PrimaryButton, InputTextWithInfo, TouchableIcon } from "@totara/components";
import { translate } from "@totara/locale";

class NativeLogin extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = {
      inputUsernameStatus: undefined,
      inputUsernameMessage: undefined,
      inputPasswordStatus: undefined,
      inputPasswordMessage: undefined
    };
  }

  setStateInputUsernameWithShowError = (username: string) => {
    this.setState({ inputUsername: username });
  };

  setStateInputPasswordWithShowError = (password: string) => {
    this.setState({ inputPassword: password });
  };

  onClickEnter = () => {
    let tmpInputUsernameStatus: "success" | "error" | "focus" | undefined = undefined;
    let tmpInputUsernameMessage = undefined;
    let tmpInputPasswordStatus: "success" | "error" | "focus" | undefined = undefined;
    let tmpInputPasswordMessage = undefined;

    if ((this.state.inputUsername && this.state.inputUsername != "wrong") && (this.state.inputPassword && this.state.inputPassword != "")) {
      //TODO will be covered in MOB-172
    } else {
      if (!this.state.inputUsername || this.state.inputUsername == "" || this.state.inputUsername == "wrong") {
          tmpInputUsernameStatus = "error";
          tmpInputUsernameMessage = translate("message.enter_valid_username");
      }
      if (!this.state.inputPassword || this.state.inputPassword == "") {
        tmpInputPasswordStatus = "error";
        tmpInputPasswordMessage = translate("message.enter_valid_password");
      }
    }
    this.setState({ 
      inputUsernameStatus: tmpInputUsernameStatus,
      inputUsernameMessage: tmpInputUsernameMessage,
      inputPasswordStatus: tmpInputPasswordStatus,
      inputPasswordMessage: tmpInputPasswordMessage
    });
  };

  render() {
    return (
      <Container style={{ flex: 0, backgroundColor: colorAccent }}>
        <Header style={styles.navigation} iosBarStyle={"default"}>
          <TouchableIcon onPress={() => { this.props.onBack(); }} icon={"times"} disabled={false} color={navigationHeaderTintColor} />
        </Header>
        <Content style={styles.content} enableOnAndroid>
          <Image source={{ uri: theme.logoUrl }} style={styles.totaraLogo} resizeMode={"contain"} />
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{translate("native-login.header_title")}</Text>
            <Text style={styles.infoDescription}>{translate("native-login.login_information")}</Text>
          </View>
          <Form>
            <View style={styles.formInputContainer}>
              <InputTextWithInfo placeholder={translate("native-login.username_text_placeholder")} message={this.state.inputUsernameMessage} status={this.state.inputUsernameStatus} >
                <Input
                  clearButtonMode="while-editing"
                  autoCapitalize="none"
                  onChangeText={this.setStateInputUsernameWithShowError}
                  value={this.state.inputUsername}
                  style={styles.inputText}
                />
              </InputTextWithInfo>
            </View>
            <View style={styles.formInputContainer}>
              <InputTextWithInfo placeholder={translate("native-login.password_text_placeholder")} message={this.state.inputPasswordMessage} status={this.state.inputPasswordStatus} >
                <Input
                  secureTextEntry={true}
                  clearButtonMode="while-editing"
                  onChangeText={this.setStateInputPasswordWithShowError}
                  value={this.state.inputPassword}
                  style={styles.inputText}
                />
              </InputTextWithInfo>
            </View>
            <View style={styles.forgotCredentialContainer}>
              <TouchableOpacity onPress={() => { Linking.openURL(config.forgotPasswordUri(this.props.siteUrl)); }} >
                <Text style={styles.forgotCredential}>{translate("native-login.forgot_username_password")}</Text>
              </TouchableOpacity>
            </View>
            <PrimaryButton onPress={this.onClickEnter} text={translate("general.enter")} />
          </Form>
        </Content>
      </Container>
    );
  }
}

type Props = {
  onSetupSecretSuccess: (data: string) => void
  siteUrl: string,
  onBack: () => void
};

type State = {
  inputUsername?: string,
  inputPassword?: string,
  inputUsernameStatus?: "success" | "error" | "focus",
  inputPasswordStatus?: "success" | "error" | "focus",
  inputPasswordMessage?: string,
  inputUsernameMessage?: string
};

const styles = StyleSheet.create({
  navigation: {
    alignItems: "flex-start",
    borderBottomWidth: 0,
    backgroundColor: colorSecondary1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content: {
    paddingHorizontal: gutter
  },
  totaraLogo: {
    height: resizeByScreenSize(72, 72, 88, 88),
    width: "100%",
    marginTop: 24
  },
  infoContainer: {
    justifyContent: "space-between",
    textAlignVertical: "center",
    marginBottom: resizeByScreenSize(32, 32, 32, 32),
    marginTop: 32
  },
  infoTitle: {
    fontSize: fontSizeH2,
    lineHeight: lineHeightH2,
    color: textColorDark
  },
  infoDescription: {
    fontSize: fontSizeH4,
    lineHeight: lineHeightH4,
    color: textColorDark
  },
  formInputContainer: {
    marginBottom: 8
  },
  inputText: {
    paddingLeft: 0,
    marginLeft: 0
  },
  forgotCredentialContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 8
  },
  forgotCredential: {
    color: theme.linkColor,
    fontSize: fontSizeB1,
    lineHeight: lineHeightB1,
    padding: 16,
    textDecorationLine: "underline",
    textAlign: "center"
  }
});

export default NativeLogin;
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
  SafeAreaView,
  TouchableOpacity,
  Linking
} from "react-native";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Form, Input, Content, Container } from "native-base";

import { config } from "@totara/lib";
import { resizeByScreenSize, theme, gutter, h1, h3 } from "@totara/theme";
import { PrimaryButton, InputTextWithInfo } from "@totara/components";
import { translate } from "@totara/locale";

class NativeLogin extends React.Component<Props, State> {
  
  static actionType: number = 2;
  
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
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <View style={styles.navigation} >
            <TouchableOpacity onPress={() => { this.props.onBack(NativeLogin.actionType) }} style={styles.navigationCloseItem} >
              <FontAwesomeIcon icon="times" size={h3} color={theme.h1Color} />
            </TouchableOpacity>
          </View>
          <Content style={styles.content}>
            <Image source={{ uri: theme.logoUrl }} style={styles.totaraLogo} />
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>{translate("native-login.header_title")}</Text>
              <Text style={styles.infoDescription}>{translate("native-login.login_information")}</Text>
            </View>
            <Form >
              <InputTextWithInfo
                placeholder={translate("native-login.username_text_placeholder")}
                message={this.state.inputUsernameMessage}
                status={this.state.inputUsernameStatus} >
                <Input
                  clearButtonMode="while-editing"
                  autoCapitalize="none"
                  onChangeText={this.setStateInputUsernameWithShowError}
                  value={this.state.inputUsername}
                  style={styles.inputText} />
              </InputTextWithInfo>
              <InputTextWithInfo
                placeholder={translate("native-login.password_text_placeholder")}
                message={this.state.inputPasswordMessage}
                status={this.state.inputPasswordStatus}>
                <Input
                  secureTextEntry={true}
                  clearButtonMode="while-editing"
                  onChangeText={this.setStateInputPasswordWithShowError}
                  value={this.state.inputPassword}
                  style={styles.inputText} />
              </InputTextWithInfo>
              <View style={styles.forgotCredentialContainer}>
                <TouchableOpacity onPress={() => { Linking.openURL(config.forgotPasswordUri(this.props.siteUrl)); }}>
                  <Text style={styles.forgotCredential}>{translate("native-login.forgot_username_password")}</Text>
                </TouchableOpacity>
              </View>
              <PrimaryButton onPress={this.onClickEnter} text={translate("general.enter")} />
            </Form>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}

type Props = {
  onSuccessfulSiteUrl: (data: string, currentAction: number) => void
  siteUrl: string,
  onBack: (action: number) => void
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
    height: 44,
    alignItems: "flex-start",
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  navigationCloseItem: {
    padding: gutter,
    lineHeight: 40
  },
  content: {
    flex: 1,
    paddingHorizontal: gutter,
    marginBottom: resizeByScreenSize(10, 20, 20, 20)
  },
  totaraLogo: {
    height: resizeByScreenSize(68, 68, 87, 87),
    maxHeight: resizeByScreenSize(136, 136, 184, 184),
    width: "100%",
    resizeMode: "contain",
    marginTop: 40
  },
  infoContainer: {
    justifyContent: "space-between",
    textAlignVertical: "center",
    marginBottom: 24,
    marginTop: 40
  },
  infoTitle: {
    fontSize: h1,
    color: theme.h1Color
  },
  infoDescription: {
    fontSize: h3,
    color: theme.h3Color
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
    fontSize: resizeByScreenSize(14, 16, 16, 16),
    lineHeight: resizeByScreenSize(14, 16, 16, 16),
    padding: 16,
    textDecorationLine: "underline",
    textAlign: "center"
  }
});

export default NativeLogin;
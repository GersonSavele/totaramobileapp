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
  Text
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Form, Input, Content, Container } from "native-base";

import { resizeByScreenSize, theme, gutter, h1, h3 } from "@totara/theme";
import { PrimaryButton, InputTextWithInfo } from "@totara/components";
import { translate } from "@totara/locale";
import { config } from "@totara/lib";


class SiteUrl extends React.Component<Props, State> {

  static actionType: number = 1;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputSiteUrl: this.props.siteUrl
    };
  }

  setInputSiteUrl = () => {
    var siteUrlValue = this.state.inputSiteUrl
    const isValidSiteAddress = (siteUrlValue) ? this.isValidUrlText(siteUrlValue!) : false;

    this.setState({
      inputSiteUrlMessage: undefined,
      inputSiteUrlStatus: undefined,
    });
    if (isValidSiteAddress) {
      siteUrlValue = this.formatUrl(siteUrlValue!);
      this.setState({
        inputSiteUrl: siteUrlValue,
        inputSiteUrlStatus: "success"
      });
      this.props.onSiteUrlSubmit(siteUrlValue!);
    } else {
      this.setState({
        inputSiteUrlMessage: translate("message.enter_valid_url"),
        inputSiteUrlStatus: "error"
      });
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

  setStateInputSiteUrlWithShowError = (siteUrl: string) => {
    this.setState({ inputSiteUrl: siteUrl });
  };

  render() {
    return (
      <Container>
        <Content>
          <Form style={styles.siteUrlContainer}>
            <View style={styles.container}>
              <Image source={require("@resources/images/totara_logo.png")} style={styles.totaraLogo} resizeMode="stretch" />
              <View >
                <Text style={styles.infoTitle}>{translate("manual.site_url_title")}</Text>
                <Text style={styles.infoDescription}>{translate("manual.site_url_information")}</Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <InputTextWithInfo
                placeholder={translate("manual.site_url_text_placeholder")}
                message={this.state.inputSiteUrlMessage}
                status={this.state.inputSiteUrlStatus} >
                <Input
                  keyboardType="url"
                  clearButtonMode="while-editing"
                  autoCapitalize="none"
                  onChangeText={this.setStateInputSiteUrlWithShowError}
                  value={this.state.inputSiteUrl}
                  style={styles.inputText}
                  autoFocus={true} />
              </InputTextWithInfo>
              <PrimaryButton onPress={this.setInputSiteUrl} text={translate("general.enter")} style={styles.buttonEnter} />
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

type Props = {
  onSiteUrlSubmit: (data: string) => void
  siteUrl?: string
};

type State = {
  inputSiteUrl?: string,
  inputSiteUrlStatus?: "success" | "focus" | "error",
  inputSiteUrlMessage?: string
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    marginHorizontal: gutter,
    flex: 1
  },
  totaraLogo: {
    marginTop: resizeByScreenSize(32, 128, 128, 128),
    height: resizeByScreenSize(68, 68, 87, 87),
    width: resizeByScreenSize(94, 94, 120, 120),
    alignSelf: "center"
  },
  container: {
    height: hp(45),
    justifyContent: "space-between"
  },
  infoTitle: {
    fontSize: h1,
    color: theme.h1Color
  },
  infoDescription: {
    fontSize: h3,
    color: theme.h3Color
  },
  formContainer: {
    marginVertical: resizeByScreenSize(10, 20, 20, 20)
  },
  inputText: { 
    paddingRight: 0, 
    paddingLeft: 0 
  },
  buttonEnter: {
    marginTop: 8
  }
});

export default SiteUrl;

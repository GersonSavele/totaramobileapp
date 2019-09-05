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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import React, { useState } from "react";

import { AuthProviderStateLift } from "../AuthComponent";
import WebviewFlow from "../webview";
import NativeFlow from "../native";
import { TouchableOpacity, View } from "react-native";

/**
 * This currently is temporary that it switches the webview and native flow
 * Just tap the upper left corner to switch
 */
const ManualFlow = ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {

  const [authType, setAuthType] = useState(AuthType.webview);

  const toggle = () => {
    if (authType === AuthType.webview) {
      setAuthType(AuthType.native);
    } else {
      setAuthType(AuthType.webview);
    }
  };

  return(
    <View style={{flex: 1}}>
      {
        (authType === AuthType.webview)
          ? <WebviewFlow onLoginSuccess={onLoginSuccess} onLoginFailure={onLoginFailure}/>
          : <NativeFlow onLoginSuccess={onLoginSuccess} onLoginFailure={onLoginFailure}/>
      }
      <TouchableOpacity style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      }} onPress={toggle}></TouchableOpacity>
    </View>
  )

};

export enum AuthType {
  native= "native", webview = "webview", browser = "browser"
}

export default ManualFlow;
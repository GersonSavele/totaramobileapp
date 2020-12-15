import { createCompatNavigatorFactory } from "@react-navigation/compat";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableIcon } from "@totara/components";
import { NAVIGATION } from "@totara/lib/navigation";
import React from "react";
import { WebviewActivity } from "./WebviewActivity";
const { WEBVIEW_ACTIVITY } = NAVIGATION;

const WebViewStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    [WEBVIEW_ACTIVITY]: {
      screen: WebviewActivity,
      navigationOptions: ({ navigation }) => {
        const { backAction, title } = navigation.state.params as any;
        return {
          headerTitleAlign: "center",
          title: title,
          headerLeft: () => (
            <TouchableIcon
              icon={"times"}
              onPress={() => {
                backAction();
                navigation.goBack();
              }}
              size={20}
            />
          )
        };
      }
    }
  },
  {
    mode: "modal"
  }
);

export default WebViewStack;

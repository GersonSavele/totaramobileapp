import React from "react";
import { MessageBar } from "@totara/components/index";
import { View } from "react-native";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { useNetInfo } from "@react-native-community/netinfo";

const NetworkStatus = () => {
  const { isConnected, isInternetReachable } = useNetInfo();
  const messageNotConnected = "You are not connected to the internet";
  const messageConnecting = "Connecting...";
  return (
    <View>
      {(!isConnected || (isConnected && !isInternetReachable)) && (
        <MessageBar
          text={!isConnected ? messageNotConnected : messageConnecting}
          icon={faBolt}
        />
      )}
    </View>
  );
};

export default NetworkStatus;

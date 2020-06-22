import { AUTHORIZATION } from "@totara/lib/constants";
import { Image, ImageStyle, StyleProp } from "react-native";
import React from "react";

type RemoteImageType = {
  url: string;
  apiKey?: string;
  style?: StyleProp<ImageStyle>;
};

const RemoteImage = ({ url, apiKey, style }: RemoteImageType) => {
  return (
    <Image
      style={style}
      source={{
        uri: url,
        headers: {
          [AUTHORIZATION]: `Bearer ${apiKey}`
        }
      }}
    />
  );
};

export default RemoteImage;

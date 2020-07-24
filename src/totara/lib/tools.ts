/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { Alert, Dimensions } from "react-native";
import { translate } from "@totara/locale";
import moment from "moment";

type ShowMessageParams = {
  title?: string;
  text: string;
  callback?: (value?: string | undefined) => void;
};

const showMessage = ({ title = "", text, callback = () => null }: ShowMessageParams) => {
  Alert.alert(title, text, [{ text: translate("general.ok"), onPress: callback }], {
    cancelable: false
  });
};

const showConfirmation = ({
  title,
  message,
  callback
}: {
  title: string;
  message: string;
  callback: (value?: string | undefined) => void;
}) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: translate("general.cancel"),
        style: "cancel"
      },
      {
        text: translate("general.ok"),
        onPress: callback
      }
    ],
    { cancelable: false }
  );
};

const humanReadablePercentage = ({ writtenBytes, sizeInBytes }) => {
  if (!writtenBytes || !sizeInBytes) return 0;
  return (writtenBytes / sizeInBytes) * 100;
};

//RFC4122 version 4 compliant
const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const timeAgo = (fromUnixTime: number) => {
  moment.relativeTimeThreshold("h", 24);
  return moment.unix(fromUnixTime).fromNow();
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const deviceScreen = {
  width: Dimensions.get("screen").width,
  height: Dimensions.get("screen").height,
  scale: Dimensions.get("screen").scale
};

export { showMessage, showConfirmation, humanReadablePercentage, uuid, deviceScreen, timeAgo, capitalizeFirstLetter };

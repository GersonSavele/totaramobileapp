import { Alert, Dimensions } from "react-native";
import { translate } from "@totara/locale";
import moment from "moment";

type ShowMessageParams = {
  title?: string;
  text: string;
  callback?: (value?: string | undefined) => void;
};

const showMessage = ({
  title = "",
  text,
  callback = () => null
}: ShowMessageParams) => {
  Alert.alert(
    title,
    text,
    [{ text: translate("general.ok"), onPress: callback }],
    {
      cancelable: false
    }
  );
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
        text: translate("scorm.confirmation.cancel"),
        style: "cancel"
      },
      {
        text: translate("scorm.confirmation.ok"),
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

const deviceScreen = {
  width: Dimensions.get("screen").width,
  height: Dimensions.get("screen").height,
  scale: Dimensions.get("screen").scale
};

export {
  showMessage,
  showConfirmation,
  humanReadablePercentage,
  uuid,
  deviceScreen,
  timeAgo
};

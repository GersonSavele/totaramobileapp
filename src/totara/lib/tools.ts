import { Alert } from "react-native";
import { translate } from "@totara/locale";

const showMessage = (
  text: string,
  callback: (value?: string | undefined) => void
) => {
  Alert.alert(
    "",
    text,
    [{ text: translate("general.ok"), onPress: callback }],
    {
      cancelable: false
    }
  );
};

const showConfirmation = (
  title: string,
  message: string,
  callback: (value?: string | undefined) => void
) => {
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

export { showMessage, showConfirmation };

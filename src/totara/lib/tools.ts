import { Alert } from "react-native";
import { translate } from "@totara/locale";

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

const humanReadablePercentage = ({ writtenBytes, sizeInBytes }) => {
  if (!writtenBytes || !sizeInBytes) return 0;
  return (writtenBytes / sizeInBytes) * 100;
};

export { showMessage, showConfirmation, humanReadablePercentage };

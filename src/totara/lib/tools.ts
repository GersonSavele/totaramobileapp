import { Alert } from 'react-native';

const showMessage = (text: string, callback: (value?: string | undefined) => void) => {
  Alert.alert('', text, [{ text: 'OK', onPress: callback }], {
    cancelable: false,
  });
};

export { showMessage };
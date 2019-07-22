import React from "react";
import { View, Text } from "react-native";
import { TransparentView } from "@totara/components"
import { AuthModelGoToBrowserButton, AuthModelLogOutButton, AuthModelCard, AuthModelImageView, AuthModelTitleText, AuthModelDescriptionText } from "./components"


class AuthenticationModel extends React.Component<Props> {

  constructor(props:Props) {
    super(props);
  }

  render() {
   return (
       <TransparentView>
         <View>
           <Text>LLLLL L LLL</Text>
         </View>
       </TransparentView>
    );
  }
}

type Props = {
     
  }

export default AuthenticationModel;

import {Text} from "react-native";
import moment from "moment";
import React from "react";

const dueDateStateStyle = (dateDateState: string) => {
  let backgroundColor
  switch (dateDateState) {
    case 'warning':
      backgroundColor = 'orange'
      break;
    case 'danger':
      backgroundColor = 'red'
      break;
    default:
      backgroundColor = 'black'
  }

  return {
    padding: 2,
    backgroundColor: backgroundColor
  }
}

type Props = {
  dueDate: Date
  dueDateState: string
}

class DueDateState extends React.Component<Props> {

  render() {
    const {dueDate, dueDateState} = this.props

    if (dueDate && dueDateState != 'info') {
      return (<Text style={dueDateStateStyle(dueDateState)}> Due {moment(dueDate).fromNow()} </Text>)
    } else if (dueDate) {
      return (<Text> {moment(dueDate).format("D, MMM YYYY")}</Text>)
    } else {
      return null
    }
  }

}


export default DueDateState
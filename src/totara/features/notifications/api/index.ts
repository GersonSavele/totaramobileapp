import { gql } from "apollo-boost";
import { NotificationMessage } from "@totara/types";

const parser = (data) => {
  return data.message_popup_messages.map((row) => {
    return {
      id: row.id,
      subject: row.subject,
      isRead: row.isread,
      fullMessage: row.fullmessage,
      timeCreated: row.timeCreated
    } as NotificationMessage;
  });
};

const notificationsQuery = gql`
  query totara_mobile_messages {
    message_popup_messages {
      id
      subject
      fullmessage
      fullmessageformat
      timecreated
      isread
      __typename
    }
  }
`;

export { notificationsQuery, parser };

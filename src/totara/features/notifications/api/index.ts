import { gql } from "apollo-boost";
import { NotificationMessage } from "@totara/types";

const parser = (data) => {
  if (!data) return [];
  return data.message_popup_messages.map((row) => {
    return {
      id: row.id,
      subject: row.subject,
      isRead: row.isread,
      fullMessage: row.fullmessage,
      timeCreated: row.timecreated
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

const notificationQueryMarkRead = gql`
  mutation totara_mobile_mark_messages_read(
    $input: message_popup_mark_messages_read_input!
  ) {
    message_popup_mark_messages_read(input: $input) {
      read_message_ids
      __typename
    }
  }
`;

export { notificationsQuery, notificationQueryMarkRead, parser };

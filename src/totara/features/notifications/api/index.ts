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
  mutation totara_mobile_mark_messages_read($input: message_popup_mark_messages_read_input!) {
    message_popup_mark_messages_read(input: $input) {
      read_message_ids
      __typename
    }
  }
`;

export { notificationsQuery, notificationQueryMarkRead, parser };

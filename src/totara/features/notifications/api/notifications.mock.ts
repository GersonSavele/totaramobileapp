import { notificationsQuery } from "@totara/features/notifications/api/index";
import { GraphQLError } from "graphql";

const notificationsMock = [
  {
    request: {
      query: notificationsQuery
    },
    result: {
      data: {
        message_popup_messages: [
          {
            id: "1",
            subject: "Notification item",
            fullmessage: "Full message example",
            fullmessageformat: "PLAIN",
            isread: true,
            timecreated: 111,
            __typename: "message_popup_messages"
          },
          {
            id: "2",
            subject: "Notification item 2",
            fullmessage: "Full message example 2",
            fullmessageformat: "PLAIN",
            isread: true,
            timecreated: 222,
            __typename: "message_popup_messages"
          }
        ]
      }
    }
  }
];

const notificationsMockUnRead = [
  {
    request: {
      query: notificationsQuery
    },
    result: {
      data: {
        message_popup_messages: [
          {
            id: "1",
            subject: "Notification item",
            fullmessage: "Full message example",
            fullmessageformat: "PLAIN",
            isread: false,
            timecreated: 111,
            __typename: "message_popup_messages"
          },
          {
            id: "2",
            subject: "Notification item 2",
            fullmessage: "Full message example 2",
            fullmessageformat: "PLAIN",
            isread: false,
            timecreated: 222,
            __typename: "message_popup_messages"
          }
        ]
      }
    }
  }
];

const notificationsMockEmpty = [
  {
    request: {
      query: notificationsQuery
    },
    result: {
      data: {
        message_popup_messages: []
      }
    }
  }
];

const notificationsMockError = [
  {
    request: {
      query: notificationsQuery
    },
    result: {
      errors: [new GraphQLError("Error!")]
    }
  }
];

export {
  notificationsMock,
  notificationsMockEmpty,
  notificationsMockError,
  notificationsMockUnRead
};

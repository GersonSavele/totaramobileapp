import React from "react";
import { render } from "@testing-library/react-native";
import NotificationDetails from "@totara/features/notifications/NotificationDetail";
import moment from "moment";

describe("NotificationDetails", () => {
  const defaultMockItem = {
    id: "123",
    isRead: false,
    subject: "subject text",
    fullMessage: "fullMessage text",
    timeCreated: moment().utc().unix(),
    fullMessageFormat: "PLAIN"
  };

  it("Should render with title, time ago, and full message", () => {
    const itemToBeTested = { ...defaultMockItem };
    const navigation = {
      state: {
        params: {
          ...itemToBeTested
        }
      }
    };
    const { getByTestId } = render(
      <NotificationDetails navigation={navigation} />
    );

    const labelTitle = getByTestId("test_title");
    expect(labelTitle.children[0]).toBe(itemToBeTested.subject);

    const labelTimeCreated = getByTestId("test_timeCreated");
    expect(labelTimeCreated.children[0]).toBe("a few seconds ago");

    const labelFullMessage = getByTestId("test_fullMessage");
    expect(labelFullMessage.children[0]).toBe(itemToBeTested.fullMessage);
  });
});

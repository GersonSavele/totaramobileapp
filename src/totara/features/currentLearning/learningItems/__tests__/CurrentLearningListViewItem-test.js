import React from "react";
import { act, render } from "@testing-library/react-native";
import { currentLearningItemExample } from "../__mocks__/currentLearningListView.mock";
import wait from "waait";
import CurrentLearningListViewItem from "@totara/features/currentLearning/learningItems/CurrentLearningListViewItem";
import moment from "moment";
import { TotaraTheme } from "@totara/theme/Theme";

const navigation = {
  navigation: {
    navigate: jest.fn()
  }
};

describe("CurrentLearningListViewItem", () => {
  it("Should render Course item with title 'Example course' and 25% completed", async () => {
    const { getByTestId } = render(
      <CurrentLearningListViewItem item={currentLearningItemExample} navigation={navigation} />
    );

    await act(async () => {
      await wait(0);
    });

    const courseType = getByTestId("test_CurrentLearningItem_Type");
    expect(courseType.children[0]).toBe("Course");

    const title = getByTestId("test_CurrentLearningItem_Title");
    expect(title.children[0]).toBe("Example course fullname");

    const progress = getByTestId("test_CurrentLearningItem_Progress");
    const progressPercentage = progress.children[1].children[0].props.children;
    expect(progressPercentage).toBe("25%");
  });

  it("Should render Program label type", async () => {
    const mocked = { ...currentLearningItemExample, itemtype: "program" };
    const { getByTestId } = render(<CurrentLearningListViewItem item={mocked} navigation={navigation} />);

    await act(async () => {
      await wait(0);
    });

    const programType = getByTestId("test_CurrentLearningItem_Type");
    expect(programType.children[0]).toBe("Program");
  });

  it("Should render Program certification type", async () => {
    const mocked = { ...currentLearningItemExample, itemtype: "certification" };
    const { getByTestId } = render(<CurrentLearningListViewItem item={mocked} navigation={navigation} />);

    await act(async () => {
      await wait(0);
    });

    const programType = getByTestId("test_CurrentLearningItem_Type");
    expect(programType.children[0]).toBe("Certification");
  });

  it("Should render Course item with due date expired (alert)", async () => {
    const oneDayAgo = moment().utc().add(-1, "day").format("YYYY-MM-DD-HH:mm:ssZZ");
    const mockExpired = { ...currentLearningItemExample, duedate: oneDayAgo, duedateState: "danger" };
    const { getByTestId } = render(<CurrentLearningListViewItem item={mockExpired} navigation={navigation} />);

    await act(async () => {
      await wait(0);
    });

    const duedateComponent = getByTestId("test_dueDate");
    const color = duedateComponent.props.style.color;
    expect(color).toBe(TotaraTheme.colorAlert);
  });

  it("Should render Course item with about to expire soon (warning)", async () => {
    const aboutToExpireSoonDate = moment().utc().add(10, "day").format("YYYY-MM-DD-HH:mm:ssZZ");
    const mockExpired = { ...currentLearningItemExample, duedate: aboutToExpireSoonDate, duedateState: "warning" };
    const { getByTestId } = render(<CurrentLearningListViewItem item={mockExpired} navigation={navigation} />);

    await act(async () => {
      await wait(0);
    });

    const duedateComponent = getByTestId("test_dueDate");
    const color = duedateComponent.props.style.color;
    expect(color).toBe(TotaraTheme.colorWarning);
  });

  it("Should render Course item with expire in the future (info)", async () => {
    const willExpireInTheFuture = moment().utc().add(10, "day").format("YYYY-MM-DD-HH:mm:ssZZ");
    const mockExpired = { ...currentLearningItemExample, duedate: willExpireInTheFuture, duedateState: "info" };
    const { getByTestId } = render(<CurrentLearningListViewItem item={mockExpired} navigation={navigation} />);

    await act(async () => {
      await wait(0);
    });

    const duedateComponent = getByTestId("test_dueDate");
    const color = duedateComponent.props.style.color;
    expect(color).toBe(TotaraTheme.colorInfo);
  });
});

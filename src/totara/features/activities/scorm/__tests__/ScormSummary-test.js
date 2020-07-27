import React from "react";
import ScormSummary from "../ScormSummary";
import { render } from "@testing-library/react-native";

describe("ScormSummary", () => {
  it("Should render the error on summary", async () => {
    const { getByTestId } = render(<ScormSummary error={true} />);

    const loadingView = getByTestId("summary_error");
    expect(loadingView.children[0]).toBeTruthy();
  });
});

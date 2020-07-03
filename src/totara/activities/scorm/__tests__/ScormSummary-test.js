import React from "react";
import ScormSummary from "../ScormSummary";
import { render } from "@testing-library/react-native";

describe("ScormSummary", () => {
  it("Should render main summary data", async () => {
    const { getByTestId } = render(<ScormSummary error={true} />);

    const loadingView = getByTestId("summary_loading");
    expect(loadingView.children[0]).toBeTruthy();
  });
});

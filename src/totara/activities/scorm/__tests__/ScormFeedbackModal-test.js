import React from "react";
import ScormFeedbackModal from "../components/ScormFeedbackModal";
import { render } from "@testing-library/react-native";
import { Grade } from "@totara/types/Scorm";

describe("ScormFeedbackModal", () => {
  it("Should render the feedback with the tick image because the score is not required", async () => {
    const { getByTestId } = render(<ScormFeedbackModal />);

    const view = getByTestId("scorm_feedback_completed_image");
    expect(view).toBeTruthy();
  });

  it("Should render the feedback with the marks with percentage because the score is required and grade method is not learning objective", async () => {
    const { getByTestId } = render(
      <ScormFeedbackModal score={0} completionScoreRequired={1} />
    );

    const view = getByTestId("scorm_feedback_score_value");
    expect(view.children[0]).toBe("0%");
  });

  it("Should render the feedback with the marks without percentage because the score is required and grade method is learning objective", async () => {
    const { getByTestId } = render(
      <ScormFeedbackModal
        score={0}
        completionScoreRequired={1}
        gradeMethod={Grade.objective}
      />
    );

    const view = getByTestId("scorm_feedback_score_value");
    expect(view.children[0]).toBe("0");
  });
});

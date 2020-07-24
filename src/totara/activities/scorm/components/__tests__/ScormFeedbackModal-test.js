import React from "react";
import ScormFeedbackModal from "../ScormFeedbackModal";
import { render } from "@testing-library/react-native";
import { Grade } from "@totara/types/Scorm";
import { TEST_ID } from "../../constants";

const { FEEDBACK_COMPLETION_IMAGE, FEEDBACK_SCORE } = TEST_ID;

describe("ScormFeedbackModal", () => {
  it("Should render the feedback with the tick image because the score is not required", async () => {
    const navigation = {
      state: {
        params: {
          score: 10,
          gradeMethod: Grade.objective,
          onClose: () => {}
        }
      }
    };
    const { getByTestId } = render(
      <ScormFeedbackModal navigation={navigation} />
    );

    const view = getByTestId(FEEDBACK_COMPLETION_IMAGE);
    expect(view).toBeTruthy();
  });

  it("Should render the feedback with the marks with percentage because the score is required and grade method is not learning objective", async () => {
    const navigation = {
      state: {
        params: {
          score: 10,
          gradeMethod: Grade.highest,
          onClose: () => {},
          completionScoreRequired: 1
        }
      }
    };
    const { getByTestId } = render(
      <ScormFeedbackModal navigation={navigation} />
    );

    const view = getByTestId(FEEDBACK_SCORE);
    expect(view.children[0]).toBe(`${navigation.state.params.score}%`);
  });

  it("Should render the feedback with the marks without percentage because the score is required and grade method is learning objective", async () => {
    const navigation = {
      state: {
        params: {
          score: 10,
          gradeMethod: Grade.objective,
          onClose: () => {},
          completionScoreRequired: 1
        }
      }
    };
    const { getByTestId } = render(
      <ScormFeedbackModal navigation={navigation} />
    );

    const view = getByTestId(FEEDBACK_SCORE);
    expect(view.children[0]).toBe(navigation.state.params.score.toString());
  });
});

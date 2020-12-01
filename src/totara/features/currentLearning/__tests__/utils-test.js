import { extractTargetId, getCompletionStatus, completionAccessibility } from "../utils";
import { completionStates } from "../course/courseDetailsStyle";
import { completionTrack, completionStatus } from "../constants";

describe("Utils", () => {
  it("Should extract targetId with character '_' provided", () => {
    const result = extractTargetId("course_81");
    expect(result).toBe("81");
  });

  it("Should extract targetId with no character '_' provided", () => {
    const result = extractTargetId("18");
    expect(result).toBe("18");
  });

  describe("getCompletionStatus", () => {
    it("Should return notAvailable status data for not available activity", () => {
      const result = getCompletionStatus({ available: false });
      expect(result).toMatchObject({
        stateObj: completionStates.notAvailable,
        accessibility: completionAccessibility.notAvailable
      });
    });

    it("Should return completion(auto/manual) status data for completed activity", () => {
      const resultAuto = getCompletionStatus({
        available: true,
        status: completionStatus.completePass,
        completion: completionTrack.trackingAutomatic
      });
      expect(resultAuto).toMatchObject({
        stateObj: completionStates.completed,
        accessibility: completionAccessibility.autoCompletion
      });
      const resultManual = getCompletionStatus({
        available: true,
        status: completionStatus.complete,
        completion: completionTrack.trackingManual
      });
      expect(resultManual).toMatchObject({
        stateObj: completionStates.completed,
        accessibility: completionAccessibility.manualCompletion
      });
    });

    it("Should return incomplete(auto/manual) status data for incomplete activity", () => {
      const resultAuto = getCompletionStatus({
        available: true,
        status: completionStatus.incomplete,
        completion: completionTrack.trackingAutomatic
      });
      expect(resultAuto).toMatchObject({
        stateObj: completionStates.autoIncomplete,
        accessibility: completionAccessibility.autoCompletion
      });
      const resultManual = getCompletionStatus({
        available: true,
        status: completionStatus.incomplete,
        completion: completionTrack.trackingManual
      });
      expect(resultManual).toMatchObject({
        stateObj: completionStates.manualIncomplete,
        accessibility: completionAccessibility.manualCompletion
      });
    });

    it("Should return failed status data for completion failed activity", () => {
      const result = getCompletionStatus({
        available: true,
        status: completionStatus.completeFail,
        completion: completionTrack.trackingAutomatic
      });
      expect(result).toMatchObject({
        stateObj: completionStates.completeFail,
        accessibility: completionAccessibility.completeFail
      });
    });
  });
});

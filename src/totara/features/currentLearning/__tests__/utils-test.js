import { extractTargetId } from "../utils";

describe("Utils", () => {
  it("Should extract targetId with character '_' provided", () => {
    const result = extractTargetId("course_81");
    expect(result).toBe("81");
  });

  it("Should extract targetId with no character '_' provided", () => {
    const result = extractTargetId("18");
    expect(result).toBe("18");
  });
});

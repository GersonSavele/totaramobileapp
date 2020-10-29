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

import { wrappedWekaNodes, jsonObjectToWekaNodes } from "../wekaUtils";
import { ToText } from "../nodesExtractor";

const mockEmptyParagraph = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: []
    },
    {
      type: "paragraph",
      content: []
    }
  ]
};

const mockParagraphContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This course will develop your understanding and ability to modify the behaviour of domestic animals."
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "strong"
            }
          ],
          text: "There are 8 lessons in this course"
        }
      ]
    }
  ]
};

describe("Weka Text/Paragraph", () => {
  it("Should show empty when weka content is empty", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockEmptyParagraph));
    var result = root.accept(new ToText());
    expect(result).toBeNull;
  });
  it("Should show string after extract weka content", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockParagraphContent));
    var result = root.accept(new ToText());
    expect(result).toBe(
      "This course will develop your understanding and ability to modify the behaviour of domestic animals.\nThere are 8 lessons in this course"
    );
  });
});

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
import { ToShortSummary } from "../treeOperations";

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

const mockEmojiContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "emoji",
          attrs: {
            shortcode: "1F603"
          }
        }
      ]
    }
  ]
};

const mockBulletListContent = {
  type: "doc",
  content: [
    {
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Each lesson culminates in an assignment"
                }
              ]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Students of psychology"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const mockOrderListContent = {
  type: "doc",
  content: [
    {
      type: "ordered_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Each lesson culminates in an assignment"
                }
              ]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Students of psychology"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

describe("Weka Text/Paragraph", () => {
  it("Should show empty when weka content is empty", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockEmptyParagraph));
    expect(root.accept(new ToShortSummary())).toBeNull;
  });
  it("Should show string after extract weka content", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockParagraphContent));
    expect(root.accept(new ToShortSummary())).toBe(
      "This course will develop your understanding and ability to modify the behaviour of domestic animals.\nThere are 8 lessons in this course"
    );
  });
  it("Should show emoji when extract weka content", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockEmojiContent));
    expect(
      root
        .accept(new ToShortSummary())
        .trim()
        .split(/[\b]|.+?(?=@[a-z0-9_-])/gi)
    ).toStrictEqual(["😃"]);
  });
});

describe("Weka Order-list/Numerical-list", () => {
  it("Should show bullet list after extract weka content", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockBulletListContent));
    expect(root.accept(new ToShortSummary())).toBe(
      "• Each lesson culminates in an assignment\n• Students of psychology"
    );
  });

  it("Should show numerical list after extract weka content", () => {
    const root = wrappedWekaNodes(jsonObjectToWekaNodes(mockOrderListContent));
    expect(root.accept(new ToShortSummary())).toBe(
      "1. Each lesson culminates in an assignment\n2. Students of psychology"
    );
  });
});

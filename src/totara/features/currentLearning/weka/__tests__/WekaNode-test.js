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

import { ToText, wrappedWekaNodes } from "../WekaNode";

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

const listMockContent = {
  type: "ordered_list",
  attrs: {
    order: "1"
  },
  content: [
    {
      type: "ordered_list",
      attrs: {
        order: "1"
      },
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text:
                    "Students of psychology (animal study has long been a foundation for understanding human behaviour)"
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
                  text: "People who work with animals (farms, wildlife, pets)"
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
                  text: "Animal owners and animal lovers"
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
                  text: "Laying a foundation to understand animal training"
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
  it("Should show string after extract weka content", () => {
    const root = wrappedWekaNodes(mockParagraphContent.content);
    var result = root.accept(new ToText());
    expect(result).toBe(
      "This course will develop your understanding and ability to modify the behaviour of domestic animals.\nThere are 8 lessons in this course"
    );
  });
});

// describe("Weka orderedList", () => {
//   it("Should show string after extract weka content", () => {
//     const text = Array.isArray(jsonObjectToWekaNodes(listMockContent.content))
//       ? jsonObjectToWekaNodes(listMockContent.content).map((item) => {
//           return item;
//         })
//       : null;

//     expect(text).toBe(
//       "Students of psychology (animal study has long been a foundation for understanding human behaviour)"
//     );
//     // expect(text[1].nodes[0].text).toBe("There are 8 lessons in this course");
//   });
// });

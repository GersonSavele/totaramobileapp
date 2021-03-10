/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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

import React from "react";
import { render } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { fontSizes, fontWeights, fontStyles } from "@totara/theme/constants";
import { TextView, ContentExtract, ListWrapper, Emoji, LinkMedia } from "../WekaEditorView";
import { AuthContext } from "@totara/core";

describe("Weka content", () => {
  it("Should render text when json content text is header", () => {
    const { getByTestId } = render(<TextView attrs={heading} content={content} />);

    const text = getByTestId("test_rich_text");

    const fontSize = text.props.style[0].fontSize;
    expect(fontSize).toBe(fontSizes.fontSizeL);
  });

  it("Should render text when json content text is sub-header", () => {
    const { getByTestId } = render(<TextView attrs={subHeading} content={content} />);
    const text = getByTestId("test_rich_text");

    const fontSize = text.props.style[0].fontSize;
    expect(fontSize).toBe(20);
  });

  it("Should render text when json content text is paragraph", () => {
    const { getByTestId } = render(<TextView content={content} />);

    const text = getByTestId("test_rich_text");

    const fontSize = text.props.style[0].fontSize;
    expect(fontSize).toBe(fontSizes.fontSizeM);
  });

  it("Should render text when json content text is bold, italic or link", () => {
    const { getByTestId } = render(<TextView content={contentWithMarks} />);

    const text = getByTestId("test_rich_text");

    const fontWeight = text.props.style[2][0].fontWeight;
    expect(fontWeight).toBe(fontWeights.fontWeightBold);
    const fontStyle = text.props.style[1][1].fontStyle;
    expect(fontStyle).toBe(fontStyles.fontStyleItalic);
    const link = text.props.style[3];
    expect(link).toBeFalsy();
  });

  it("should show the whole weka content", () => {
    const component = renderer.create(
      <AuthContext.Provider
        value={{
          authContextState
        }}>
        <ContentExtract content={mockContent} />
      </AuthContext.Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Should render list when json content include list of items", () => {
    const { getAllByTestId } = render(<ListWrapper content={contentList} />);

    const listItem = getAllByTestId("test_list_content");
    expect(listItem.length).toBe(4);
  });

  it("Should render emoji when string code format match with the emoji", () => {
    const { getByTestId } = render(<Emoji content={contentEmoji} />);

    const emojiText = getByTestId("test_emoji");
    const childValue = emojiText.children[0];
    expect(childValue).toBe("🙂");
  });

  it("Should render link media component when rich content return as media url", () => {
    const { getByTestId } = render(
      <AuthContext.Provider
        value={{
          authContextState
        }}>
        <LinkMedia content={linkMediaContent} />
      </AuthContext.Provider>
    );

    const mediaTitle = getByTestId("test_media_title");
    expect(mediaTitle).toBeTruthy();

    const mediaContent = getByTestId("test_media_content");
    expect(mediaContent).toBeTruthy();
  });
});

const mockContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 2
      },
      content: [
        {
          type: "text",
          text:
            "Animal behaviour is a fascinating subject. It is of interest to animal psychologists, veterinary assistants, those working in zoos, wildlife parks or nature reserves, pet owners, animal trainers, farmers, naturalists, or anyone else who works with or has an interest in animals. It is also a subject of interest for those studying psychology\u00a0generally since much of what we learn from animals can be ascribed to human behaviour and lead to a greater awareness of ourselves.\u00a0"
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "emoji",
          attrs: {
            shortcode: "1F603"
          }
        },
        {
          type: "emoji",
          attrs: {
            shortcode: "1F603"
          }
        },
        {
          type: "text",
          text: "This is a\u00a0course for:"
        }
      ]
    },
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
    },
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
          text: "There are 8 lessons in this course:"
        }
      ]
    },
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
                  text: "Introduction"
                }
              ]
            },
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
                          text:
                            "Influences and motivation; what is behaviour; causes of behaviour (eg. genetics, learning, external and internal influences); reactive, active and cognitive behaviour; conditioning."
                        }
                      ]
                    }
                  ]
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
                  text: "Genetics and Behaviour"
                }
              ]
            },
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
                          text:
                            "Understanding biology; natural selection; genetic variation; development of behaviour; behavioural genetics."
                        }
                      ]
                    }
                  ]
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
                  text: "Animal Perception and Behaviour"
                }
              ]
            },
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
                          text:
                            "How animals perceive things; what stimulates them and how do those stimuli function; instinct; neural control; sensory processes: sight, sound, hearing etc."
                        }
                      ]
                    }
                  ]
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
                  text: "Behaviour and the Environment"
                }
              ]
            },
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
                          text:
                            "Coordination; orientation; homeostasis; acclimatisation; circadian rhythms; biological clocks; reproductive cycles; etc."
                        }
                      ]
                    }
                  ]
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
                  text: "Social Behaviour"
                }
              ]
            },
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
                          text:
                            "Animal societies; aggression; social constraints; social order; play; sexual behaviour; communication."
                        }
                      ]
                    }
                  ]
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
                  text: "Instinct and Learning"
                }
              ]
            },
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
                          text:
                            "Conditioning and learning; extinction and habituation; instrumental learning; reinforcement; operant behaviour; biological and cognitive aspects of learning."
                        }
                      ]
                    }
                  ]
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
                  text: "Handling Animals"
                }
              ]
            },
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
                          text:
                            "Psychological affects of different handling techniques; training animals (horses, cats, dogs, etc). The student can choose which animals to focus on, though a variety are covered."
                        }
                      ]
                    }
                  ]
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
                  text: "Behavioural Problems"
                }
              ]
            },
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
                          text:
                            "Abnormal behaviour (eg. Psychotic; neurotic); domestication of animals; reducing human contact/dependence."
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text:
            "Each lesson culminates in an assignment which is submitted to the school, marked by the school's tutors and returned to you with any relevant suggestions, comments, and if necessary, extra reading."
        }
      ]
    },
    {
      type: "image",
      attrs: {
        filename: "image-2020-08-24-16-26-22-254.png",
        url:
          "https://mobile.demo.totara.software/pluginfile.php/1460/course/summary/73/image-2020-08-24-16-26-22-254.png",
        alttext: ""
      }
    },
    {
      type: "link_media",
      attrs: {
        url: "https://vimeo.com/347119375",
        image:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F797382244_1280x720.jpg&amp;src1=https%3A%2F%2Ff.vimeocdn.com%2Fimages_v6%2Fshare%2Fplay_icon_overlay.png",
        title: "Sample Video",
        description: "Sample video.",
        resolution: {
          width: 1280,
          height: 720
        }
      }
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
          text: "For more information about this course, please request your free course information pack today!"
        }
      ]
    }
  ]
};

const heading = {
  level: 1
};

const subHeading = {
  level: 2
};

const content = {
  text: "Animal behaviour is a fascinating subject.",
  type: "text"
};

const contentWithMarks = {
  marks: [
    { type: "strong" },
    { type: "em" },
    { type: "link", attrs: { href: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" } }
  ],
  text: "Animal behaviour is a fascinating subject.",
  type: "text"
};

const contentList = [
  {
    type: "list_item",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Students of psychology (animal study has long been a foundation for understanding human behaviour)"
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
  }
];

const contentEmoji = {
  type: "emoji",
  attrs: {
    shortcode: "1F642"
  }
};

const linkMediaContent = {
  type: "link_media",
  attrs: {
    description: "Sample video description",
    image:
      "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F797382244_1280x720.jpg&amp;src1=https%3A%2F%2Ff.vimeocdn.com%2Fimages_v6%2Fshare%2Fplay_icon_overlay.png",
    resolution: { width: 1280, height: 720 },
    title: "Sample Video title",
    url: "https://vimeo.com/347119375"
  }
};

const authContextState = {
  appState: {
    host: "http://site.url",
    apiKey: "api_key"
  }
};

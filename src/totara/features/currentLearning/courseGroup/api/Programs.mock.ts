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
 *
 */

import { GraphQLError } from "graphql";
import { coreProgram } from "./index";

const programMock = [
  {
    request: {
      query: coreProgram
    },
    result: {
      data: {
        totara_mobile_program: {
          id: "5",
          idnumber: "",
          fullname: "Software Development",
          shortname: "Mobile",
          duedate: "2020-07-03T00:00:00+0100",
          duedateState: "danger",
          summary:
            "Swift Programming Training Overview Accelebrate's Swift training course provides a comprehensive introduction to version 5 of the Swift programming language. Location and Pricing Accelebrate courses are taught as private, customized training for groups of 3 or more at your site. In addition, we offer live, private online training for teams who may be in multiple locations or wish to save on travel costs. To receive a customized proposal and price quote for private on-site or online training, please contact us. In addition, some courses are available as live, online classes for individuals. See a schedule of online courses. Swift Programming Training Objectives Understand the purpose and benefits of Swift Gain experience using Swift’s data types and standard library Learn the proper use of optionals Implement a variety of user-defined types in Swift Learn about error handling and techniques in Swift Understand how to write Swift code that can interoperate with existing code written in C and Objective-C",
          summaryformat: "HTML",
          endnote:
            "Many dream, some try, but only a few achieve. You are an achiever. You have made us all proud, keep up the good work. Congratulations on your graduation",
          availablefrom: "2020-06-18T00:00:00+0100",
          availableuntil: "2022-06-18T23:59:59+0100",
          imageSrc:
            "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/676/totara_program/images/5/1469021840643_1.jpg",
          completion: {
            id: "24",
            statuskey: "incomplete",
            progress: 4,
            __typename: "totara_program_completion"
          },
          currentCourseSets: [
            [
              {
                id: "10",
                label: "Course Set A",
                nextsetoperator: "OR",
                completionCriteria: [
                  "All courses in this set must be completed (unless this is an optional set)."
                ],
                statuskey: "incomplete",
                courses: [
                  {
                    id: "30",
                    itemtype: "course",
                    itemcomponent: "core_course",
                    shortname: "Audiences in Totara",
                    fullname: "Audiences in Totara",
                    summary:
                      "GROUPING YOUR USERS TO PROVIDE A PERSONALISED LEARNING EXPERIENCE\n\nAudiences are a powerful tool in Totara Learn, allowing you to group your users in order to assign them learning and performance management activities.\n\nEnrol in this course to explore how to:\n\n\t* Create set and dynamic audiences\n\n\t* Assign learning to an audience \n\n The course will take you around one hour 15 minutes to complete.\n\n",
                    summaryFormat: "HTML",
                    progress: 0,
                    urlView:
                      "https://mobile.demo.totara.software/course/view.php?id=30",
                    duedate: null,
                    duedateState: null,
                    native: false,
                    imageSrc:
                      "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/358/course/images/1593998840/image",
                    __typename: "totara_mobile_learning_item"
                  },
                  {
                    id: "44",
                    itemtype: "course",
                    itemcomponent: "core_course",
                    shortname: "Course Completion",
                    fullname: "Course Completion",
                    summary:
                      "As a user: When my current learning content is complete I would like to see a visual representation of this before it is removed from my app; So that I know that it was completed successfully and there is no ambiguity about this learning item vanishing from my current learning.",
                    summaryFormat: "HTML",
                    progress: 0,
                    urlView:
                      "https://mobile.demo.totara.software/course/view.php?id=44",
                    duedate: null,
                    duedateState: null,
                    native: true,
                    imageSrc: "",
                    __typename: "totara_mobile_learning_item"
                  }
                ],
                __typename: "totara_mobile_program_courseset"
              }
            ],
            [
              {
                id: "11",
                label: "Course Set B",
                nextsetoperator: "AND",
                completionCriteria: [
                  "All courses in this set must be completed (unless this is an optional set)."
                ],
                statuskey: "incomplete",
                courses: [
                  {
                    id: "29",
                    itemtype: "course",
                    itemcomponent: "core_course",
                    shortname: "Reports in Totara",
                    fullname: "Reporting in Totara",
                    summary:
                      "Building, sharing and scheduling your own reports\n\nIt's vital to be able to report on the learning taking place in your business.\n\nEnrol in this course to explore how to:\n\n\t* Run administration reports\n\n\t* Create user generated reports\n\n\t* Customise embedded reports\n\n\t* Create graphs of your data\n\n\t* Share reports with other users \n\nThe course will take you around 90 minutes to complete.\n\n",
                    summaryFormat: "HTML",
                    progress: 20,
                    urlView:
                      "https://mobile.demo.totara.software/course/view.php?id=29",
                    duedate: null,
                    duedateState: null,
                    native: true,
                    imageSrc:
                      "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/304/course/images/1593998840/image",
                    __typename: "totara_mobile_learning_item"
                  }
                ],
                __typename: "totara_mobile_program_courseset"
              },
              {
                id: "22",
                label: "Node Js",
                nextsetoperator: "THEN",
                completionCriteria: [
                  "Any one course in this set must be completed."
                ],
                statuskey: "incomplete",
                courses: [
                  {
                    id: "43",
                    itemtype: "course",
                    itemcomponent: "core_course",
                    shortname: "AL10 - Course Completion",
                    fullname: "AL10 - Course Completion",
                    summary:
                      "As a user: When my current learning content is complete I would like to see a visual representation of this before it is removed from my app; So that I know that it was completed successfully and there is no ambiguity about this learning item vanishing from my current learning.",
                    summaryFormat: "HTML",
                    progress: 0,
                    urlView:
                      "https://mobile.demo.totara.software/course/view.php?id=43",
                    duedate: null,
                    duedateState: null,
                    native: true,
                    imageSrc: "",
                    __typename: "totara_mobile_learning_item"
                  },
                  {
                    id: "44",
                    itemtype: "course",
                    itemcomponent: "core_course",
                    shortname: "Course Completion",
                    fullname: "Course Completion",
                    summary:
                      "As a user: When my current learning content is complete I would like to see a visual representation of this before it is removed from my app; So that I know that it was completed successfully and there is no ambiguity about this learning item vanishing from my current learning.",
                    summaryFormat: "HTML",
                    progress: 0,
                    urlView:
                      "https://mobile.demo.totara.software/course/view.php?id=44",
                    duedate: null,
                    duedateState: null,
                    native: true,
                    imageSrc: "",
                    __typename: "totara_mobile_learning_item"
                  },
                  {
                    id: "42",
                    itemtype: "course",
                    itemcomponent: "core_course",
                    shortname: "Android basic",
                    fullname: "Android N Developer Course",
                    summary:
                      "What you'll learn Make pretty much any Android app you like (your only limit is your imagination) Submit your apps to Google Play and generate revenue with Google Pay and Google Ads Become a professional app developer, take freelance gigs and work from anywhere in the world Bored with the same old, same old? Apply for a new job in a software company as an Android developer",
                    summaryFormat: "HTML",
                    progress: 0,
                    urlView:
                      "https://mobile.demo.totara.software/course/view.php?id=42",
                    duedate: null,
                    duedateState: null,
                    native: false,
                    imageSrc:
                      "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/801/course/images/1594013370/image",
                    __typename: "totara_mobile_learning_item"
                  }
                ],
                __typename: "totara_mobile_program_courseset"
              }
            ]
          ],
          countUnavailableSets: 3,
          __typename: "totara_mobile_program"
        }
      }
    }
  }
];

const programMockEmpty = [
  {
    request: {
      query: coreProgram
    },
    result: {
      data: {
        totara_mobile_program: []
      }
    }
  }
];

const programMockError = [
  {
    request: {
      query: coreProgram
    },
    result: {
      errors: [new GraphQLError("Error!")]
    }
  }
];

export { programMock, programMockEmpty, programMockError };

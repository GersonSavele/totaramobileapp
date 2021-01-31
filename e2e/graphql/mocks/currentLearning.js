const { MockList } = require("apollo-server-express");

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
const defaultCurrentLearningData = {
  id: `course_${Math.floor(Math.random() * Math.floor(10))}`,
  itemtype: "course",
  itemcomponent: "core_course",
  shortname: "(BETA) Audiences in Totara Mock 1",
  fullname: "(BETA) Audiences in Totara Mock 2",
  summary:
    "GROUPINGG YOUR USERS TO PROVIDE A PERSONALISED LEARNING EXPERIENCE\n\nAudiences are a powerful tool in Totara Learn, allowing you to group your users in order to assign them learning and performance management activities.\n\nEnrol in this course to explore how to:\n\n\t* Create set and dynamic audiences\n\n\t* Assign learning to an audience \n\n The course will take you around one hour 15 minutes to complete.\n\n",
  description:
    "GROUPINGG YOUR USERS TO PROVIDE A PERSONALISED LEARNING EXPERIENCE\n\nAudiences are a powerful tool in Totara Learn, allowing you to group your users in order to assign them learning and performance management activities.\n\nEnrol in this course to explore how to:\n\n\t* Create set and dynamic audiences\n\n\t* Assign learning to an audience \n\n The course will take you around one hour 15 minutes to complete.\n\n",
  summaryFormat: "HTML",
  progress: 66,
  url_view: "https://mobile.demo.totara.software/course/view.php?id=36",
  duedate: "2020-10-15T00:00:00+0100",
  duedate_state: "danger",
  mobile_coursecompat: true,
  mobile_image: "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/688/course/images/1611281413/image",
  description_format: "HTML",
  __typename: "totara_mobile_learning_item"
};

const defaultCurrentLearning = {
  totara_mobile_learning_item: () => ({
    ...defaultCurrentLearningData,
    id: `course_${Math.floor(Math.random() * Math.floor(100)) + 1}`
  })
};
const defaultCurrentLearningList = {
  totara_mobile_current_learning: () => [
    {
      ...defaultCurrentLearningData,
      id: `course_${Math.floor(Math.random() * Math.floor(100)) + 1}`
    },
    {
      ...defaultCurrentLearningData,
      id: `course_${Math.floor(Math.random() * Math.floor(100)) + 1}`
    },
    {
      ...defaultCurrentLearningData,
      id: `course_${Math.floor(Math.random() * Math.floor(100)) + 1}`
    }
  ]
};

module.exports = {
  defaultCurrentLearning,
  defaultCurrentLearningList
};

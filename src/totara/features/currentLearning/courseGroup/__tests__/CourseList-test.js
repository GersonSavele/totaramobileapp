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

import React from "react";
import { render } from "@testing-library/react-native";
import { courseSetMock, course } from "../api/courseGroup.mock";
import CourseList, { LearningItems } from "../CourseList";

const navigation = {
  state: {
    params: {
      coursesList: courseSetMock.currentCourseSets[0]
    }
  },
  addListener: jest.fn(),
  navigate: jest.fn()
};

describe("Course set list", () => {
  it("Should render when learning items show in the table", async () => {
    const { getByTestId } = render(<CourseList navigation={navigation} />);
    const courseList = getByTestId("test_course_list");
    expect(courseList).toBeTruthy();
  });

  it("Should render when there are row items in the table", async () => {
    const { getByTestId } = render(<LearningItems item={course} navigation={navigation} />);
    const courseList = getByTestId("test_course");
    expect(courseList).toBeTruthy();
  });
});

/*

This file is part of Totara Enterprise.
*
Copyright (C) 2020 onwards Totara Learning Solutions LTD
*
Totara Enterprise is provided only to Totara Learning Solutions
LTD’s customers and partners, pursuant to the terms and
conditions of a separate agreement with Totara Learning
Solutions LTD or its affiliate.
*
If you do not have an agreement with Totara Learning Solutions
LTD, you may not access, use, modify, or distribute this software.
Please contact [sales@totaralearning.com] for more information.
*
*/

import renderer from "react-test-renderer";
import React from "react";
import TextTypeLabel from "../TextTypeLabel";

const theme = jest.fn();

const mockEmptyLabel = {
  name: undefined,
  description: undefined,
};

const mockLabelWithName = {
  name: "Some of the activities in this course make brief",
  description: undefined,
};

const mockLabelWithDescription = {
  name: undefined,
  description:
    "Some of the activities in this course make brief reference to the Site Administration menu on the left of the screen",
};

const mockLabelWithNameAndDescription = {
  name: "Some of the activities in this course make brief",
  description:
    "Some of the activities in this course make brief reference to the Site Administration menu on the left of the screen",
};

describe("Activity-Label-Type, testing UI with or without label name and description", () => {
  it("Test result : Both name and description with label", () => {
    const component = renderer.create(
      <TextTypeLabel
        theme={theme}
        label={mockLabelWithNameAndDescription}
      ></TextTypeLabel>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Test result : only the name with label doesn't include description property with label", () => {
    const component = renderer.create(
      <TextTypeLabel theme={theme} label={mockLabelWithName}></TextTypeLabel>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Test result : only the description with label doesn't include name property with label", () => {
    const component = renderer.create(
      <TextTypeLabel
        theme={theme}
        label={mockLabelWithDescription}
      ></TextTypeLabel>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Test result : label doesn't include name property and description with label", () => {
    const component = renderer.create(
      <TextTypeLabel theme={theme} label={mockEmptyLabel}></TextTypeLabel>
    );
    const tree = component.toJSON();
    expect(tree).toBeNull();
  });
});

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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React from "react";
import { shallow } from "enzyme";

import OnlineScormActivity from "../online/OnlineScormActivity";

const mockBackHandler = jest.fn(() => null);
const onlineNavigation = (url) => ({
  uri: url,
  backAction: mockBackHandler
});

describe("OnlineScormActivity", () => {
  let useEffect;
  const mockUseEffect = () => {
    useEffect.mockImplementationOnce((f) => f());
  };
  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect");
    mockUseEffect();
  });
  it("Should render web player for given non-empty url", () => {
    const wrapper = shallow(
      <OnlineScormActivity
        navigation={{ state: { params: onlineNavigation("http://site.url") } }}
      />
    );
    expect(
      wrapper.findWhere((node) => node.prop("testID") === "scorm_online_player")
    ).toExist();
  });
  it("Should render error text component for empty url", () => {
    const wrapper = shallow(
      <OnlineScormActivity
        navigation={{ state: { params: onlineNavigation() } }}
      />
    );
    expect(
      wrapper.findWhere((node) => node.prop("testID") === "scorm_online_error")
    ).toExist();
  });
});

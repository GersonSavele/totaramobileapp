/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2022 onwards Totara Learning Solutions LTD
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
import * as ReactRedux from "react-redux";
import RNNative from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { useApolloClient } from "@apollo/client";
import { shallow } from "enzyme";
import SessionContainer from "../SessionContainer";

describe("SessionContainer", () => {
  beforeAll(() => {
    jest.spyOn(ReactRedux, "useDispatch").mockImplementation(() => jest.fn());
    jest.spyOn(RNNative, "useIsFocused").mockImplementation(() => jest.fn());
  });

  it("Should render empty SessionContainer navigation stack", () => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => jest.fn());

    const { root } = render(<SessionContainer />);
    expect(root).toBeTruthy();
  });

  it("Should render SessionContainer navigation stack", () => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return {
        siteInfo: {
          version: "1.0"
        },
        host: "https://mobile.demo.totara.software",
        apiKey: "testkey"
      };
    });
    const client = useApolloClient();
    // SessionContainer utilises apollo client, which touches the storage and
    //therefore can cause problems when running unit tests in parallel
    //as a workaround, this runs the test passing a client
    const wrapper = shallow(<SessionContainer initialClient={client} />);
    expect(wrapper).toMatchSnapshot();
  });
});

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
import * as redux from "react-redux";
import OfflineScormActivity from "../offline/OfflineScormActivity";
import { render } from "@testing-library/react-native";
import { translate } from "@totara/locale";

const mockScormActivityNavigation = {
  attempt: 1,
  scoid: "1",
  backAction: jest.fn()
};
// const mockResourcesList = [
//   {
//     customId: "10",
//     id: "6ceb3d9c-ce44-4897-b19b-ca06490752d9",
//     jobId: 1,
//     name: "Do not touch",
//     sizeInBytes: 833403,
//     state: 3,
//     type: 0,
//     unzipPath: "/path"
//   }
// ];

describe("OfflineScormActivity", () => {
  it("Should render TEXT general error for non existing scorm or scorm.id", async () => {
    const itemToBeTested = { ...mockScormActivityNavigation };
    const navigation = {
      state: {
        params: {
          ...itemToBeTested
        }
      }
    };
    const tree = <OfflineScormActivity navigation={navigation} />;
    const { getByTestId } = render(tree);
    const labelTitle = getByTestId("test_invalid_scorm");
    expect(labelTitle.children[0]).toBe(translate("general.error_unknown"));
  });

  it("Should render TEXT general error for non downloaded scorm package.", async () => {
    const itemToBeTested = {
      ...mockScormActivityNavigation,
      scorm: { id: "10" }
    };

    const navigation = {
      state: {
        params: {
          ...itemToBeTested
        }
      }
    };
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue([]);

    const tree = <OfflineScormActivity navigation={navigation} />;
    const { getByTestId } = render(tree);
    const labelTitleNo = getByTestId("test_non_exist_resource");
    expect(labelTitleNo.children[0]).toBe(translate("general.error_unknown"));
  });
  it("Should render expect UI for loading .", async () => {
    //TODO
    /*
    const itemToBeTested = {
      ...mockScormActivityNavigation,
      scorm: { id: "10" }
    };

    const navigation = {
      state: {
        params: {
          ...itemToBeTested
        }
      }
    };
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue(mockResourcesList);

    // const spy = jest.spyOn(redux, "setupOfflineScormPlayer");
    // spy.mockReturnValue(undefined);

    jest.mock("../utils", () => ({
      ...jest.requireActual("../utils"),
      setupOfflineScormPlayer: () => Promise.resolve(undefined)
    }));
    // jest.mock("../utils", () => ({
    //   setupOfflineScormPlayer: jest.fn()
    // }));

    const tree = <OfflineScormActivity navigation={navigation} />;
    const { getByTestId } = render(tree);
    const labelTitleNo = getByTestId("text_player_loading");
    expect(labelTitleNo.children[0]).toBe("");
    */
  });
});

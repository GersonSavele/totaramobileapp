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
import { render } from "@testing-library/react-native";
import { translate } from "@totara/locale";

import OfflineScormActivity from "../OfflineScormActivity";
import { SCORM_TEST_IDS } from "../constants";

const mockScormActivityNavigation = {
  attempt: 1,
  scoid: "1",
  backAction: jest.fn()
};

const { NONE_EXIST_RESOURCE, INVALID_SCORM } = SCORM_TEST_IDS;

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
    const labelTitle = getByTestId(INVALID_SCORM);
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
    const labelTitleNo = getByTestId(NONE_EXIST_RESOURCE);
    expect(labelTitleNo.children[0]).toBe(translate("general.error_unknown"));
  });
});

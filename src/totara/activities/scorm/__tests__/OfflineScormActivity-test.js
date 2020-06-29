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
import OfflineScormActivity from "../offline/OfflineScormActivity";
import { render } from "@testing-library/react-native";
import { translate } from "@totara/locale";

const mockScormActivityNavigation = {
  scorm: {},
  attempt: 1,
  scoid: "1",
  backAction: jest.fn()
};

describe("OfflineScormActivity", () => {
  test("Should render loading", async () => {
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
});

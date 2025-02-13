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

import ScormAttempts from "../ScormAttempts";
import { Grade } from "@totara/types/Scorm";
import { SCORM_TEST_IDS } from "@totara/lib/testIds";
import * as Navigation from '@/src/totara/lib/hooks';

const { ATTEMPTS_LIST_ID, ATTEMPT_ITEM_ID } = SCORM_TEST_IDS;

jest.spyOn(Navigation, 'useParams').mockImplementation(() => ({
  gradeMethod: Grade.objective,
  attempts: attempts
}));

describe("ScormAttempts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should render attempts result list for non-empty attempts", async () => {
    const existingAttempts = [
      {
        attempt: 1,
        timestarted: "1594089275",
        gradereported: 1
      },
      {
        attempt: 2,
        timestarted: "1594676524",
        gradereported: 1
      }
    ];

    jest.spyOn(Navigation, 'useParams').mockImplementation(() => ({
      gradeMethod: Grade.objective,
      attempts: existingAttempts
    }));

    const { getByTestId, getAllByTestId } = render(<ScormAttempts />);
    const viewListAttempts = getByTestId(ATTEMPTS_LIST_ID);
    const viewAttemptItems = getAllByTestId(ATTEMPT_ITEM_ID);
    expect(viewListAttempts).toBeTruthy();
    expect(viewAttemptItems.length).toBe(2);
  });

  it("Should render empty attempts result list for empty/undefined or null attempts", async () => {

    jest.spyOn(Navigation, 'useParams').mockImplementation(() => ({
      gradeMethod: Grade.objective,
      attempts: []
    }));

    let tree = render(<ScormAttempts />);
    let viewListAttempts = await tree.getByTestId(ATTEMPTS_LIST_ID);
    expect(viewListAttempts).toBeTruthy();
    expect(viewListAttempts).not.toContain();

    jest.spyOn(Navigation, 'useParams').mockImplementation(() => ({
      gradeMethod: Grade.objective,
    }));

    tree = render(<ScormAttempts />);
    viewListAttempts = await tree.getByTestId(ATTEMPTS_LIST_ID);
    expect(viewListAttempts).toBeTruthy();
    expect(viewListAttempts).not.toContain();

    tree = render(<ScormAttempts />);
    viewListAttempts = await tree.getByTestId(ATTEMPTS_LIST_ID);
    expect(viewListAttempts).toBeTruthy();
    expect(viewListAttempts).not.toContain();
  });
});

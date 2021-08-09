/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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

import { formatPageData, onSearch, getNextPointer } from "../utils";
import { catalogPageMock } from "../api/findLearning.mock";

describe("FindLearning utils", () => {
  describe("Should format response", () => {
    it("Should format passing data", () => {
      const passingData = catalogPageMock(20).catalogPage;
      expect(formatPageData({ pageData: passingData })).toMatchObject(passingData);

      expect(formatPageData({ previousPage: passingData })).toMatchObject(passingData);

      const existingData = catalogPageMock(4).catalogPage;
      expect(formatPageData({ pageData: passingData, previousPage: existingData })).toMatchObject({
        ...passingData,
        items: [...existingData.items, ...passingData.items]
      });
    });
  });

  describe("Should call search with valid data", () => {
    it("Should call search function for none empty string", () => {
      const mockResetSearchResult = jest.fn();
      onSearch({ resetSearchResult: mockResetSearchResult });
      expect(mockResetSearchResult).toBeCalled();

      const mockOnSearchCallback = jest.fn();
      onSearch({ findLearningText: "mocksearch", onSearchCallback: mockOnSearchCallback });
      expect(mockOnSearchCallback).toBeCalled();
    });
  });
});

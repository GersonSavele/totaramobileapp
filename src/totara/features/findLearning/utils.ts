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

import { isEmpty } from "lodash";
import { FindLearningPage } from "@totara/types/FindLearning";

const formatPageData = ({
  pageData,
  previousPage
}: {
  pageData: FindLearningPage;
  previousPage?: FindLearningPage;
}) => {
  if (previousPage?.items) {
    if (pageData) {
      return { ...pageData, items: [...previousPage.items, ...pageData.items] } as FindLearningPage;
    }
    return { ...previousPage };
  }
  return { ...pageData } as FindLearningPage;
};

const onSearch = ({
  pointer,
  findLearningText,
  resetSearchResult,
  onSearchCallback
}: {
  pointer: Number;
  findLearningText: String;
  resetSearchResult: Function;
  onSearchCallback: Function;
}) => {
  if (isEmpty(findLearningText)) {
    resetSearchResult(undefined);
    return;
  }
  onSearchCallback({
    variables: {
      pointer: pointer,
      filter_data: {
        catalog_fts: findLearningText
      }
    },
    notifyOnNetworkStatusChange: true
  });
};

export { formatPageData, onSearch };

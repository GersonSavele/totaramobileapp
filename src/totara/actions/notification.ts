/**
 * This file is part of Totara Enterprise Extensions.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise Extensions is provided only to Totara
 * Learning Solutions LTD's customers and partners, pursuant to
 * the terms and conditions of a separate agreement with Totara
 * Learning Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [licensing@totaralearning.com] for more information.
 */

import { store } from "../store";

const UPDATE_TOKEN = "UPDATE_TOKEN";
const TOKEN_SENT = "TOKEN_SENT";
const UPDATE_COUNT = "UPDATE_COUNT";

const updateToken = (payload) => {
  store.dispatch({
    type: UPDATE_TOKEN,
    payload: payload
  });
};

const tokenSent = (payload) => {
  store.dispatch({
    type: TOKEN_SENT,
    payload: payload
  });
};

const updateCount = (payload) => {
  store.dispatch({
    type: UPDATE_COUNT,
    payload: payload
  });
};

export { UPDATE_TOKEN, TOKEN_SENT, UPDATE_COUNT, updateToken, tokenSent, updateCount };

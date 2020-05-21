/**
 *
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
 */

import { NotificationMessage } from "@totara/types";

const initialState = {
  notifications: [] as NotificationMessage[]
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    }
    case "READ_NOTIFICATION": {
      const newState: NotificationMessage[] = [...state.notifications];
      const idx = newState.findIndex((item) => item.id == action.payload);
      const item = newState[idx];
      item.read = true;
      newState[idx] = item;

      return {
        ...state,
        notifications: newState
      };
    }
    case "DELETE_NOTIFICATION": {
      const notificationList: NotificationMessage[] = state.notifications;
      const ids: string[] = action.payload;
      const filtered = notificationList.filter(
        (item) => ids.indexOf(item.id) === -1
      );
      return {
        ...state,
        notifications: filtered
      };
    }
    // Default
    default: {
      return state;
    }
  }
};

// Exports
export default notificationReducer;

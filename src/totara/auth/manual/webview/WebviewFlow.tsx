/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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
import { Modal } from "react-native";

import WebviewLogin from "./WebviewLogin";
import { ManualFlowChildProps } from "../ManualFlowChildProps";

const WebviewFlow = (props: ManualFlowChildProps) => {
  return (
    <Modal animationType="slide">
      <WebviewLogin {...props} />
    </Modal>
  );
};

export default WebviewFlow;

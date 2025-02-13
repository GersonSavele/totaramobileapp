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

import type { ViewStyle } from 'react-native';

const spacedFlexRow: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between'
};
const flexGrow: ViewStyle = {
  flexGrow: 1,
  flexBasis: 1
};

const activeOpacity = 0.6;

const fullFlex = { flex: 1 };

export { activeOpacity, flexGrow, fullFlex, spacedFlexRow };

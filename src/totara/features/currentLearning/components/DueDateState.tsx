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

import { DATE_FORMAT } from '@totara/lib/constants';
import { getLocale, translate } from '@totara/locale';
import { paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import { formatDistance, parseISO } from 'date-fns';
import * as locales from 'date-fns/locale';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { isInvalidDueDate } from '../utils';

/**
 * Component to render dueDate and change style depending on the dueDateState
 * it would also offer a button fire a function when state is on warning or danger
 */
type Props = {
  dueDate?: Date | string | number;
  dueDateState?: string;
};

const getDueDateModeStyle = (dueDateState?: string) => {
  switch (dueDateState) {
    case DueDateStateStatus.danger:
      return { backgroundColor: TotaraTheme.colorAlert };
    case DueDateStateStatus.warning:
      return { backgroundColor: TotaraTheme.colorWarning };
    default:
      return { backgroundColor: TotaraTheme.colorInfo };
  }
};

const DueDateState = ({ dueDate = '', dueDateState }: Props) => {
  if (isInvalidDueDate({ dueDate, dueDateState })) return null;
  const dueDateModeStyle = getDueDateModeStyle(dueDateState);
  const formatedDistance = formatDistance(new Date(parseISO(`${dueDate}`)), new Date(), {
    locale: locales[getLocale()]
  });
  return (
    <View style={[styles.container, dueDateModeStyle]}>
      <Text style={[TotaraTheme.textXSmall, { color: TotaraTheme.textColorLight }]}>
        {dueDateState && dueDateState == DueDateStateStatus.danger
          ? translate('current_learning.overdue_by')
          : translate('current_learning.due_in')}
        &nbsp;
        <Text style={{ fontWeight: 'bold' }}>{formatedDistance}&nbsp;</Text>
      </Text>
      <Text style={[TotaraTheme.textXSmall, { color: TotaraTheme.textColorLight }]}>
        ({moment(dueDate).format(DATE_FORMAT)})
      </Text>
    </View>
  );
};

enum DueDateStateStatus {
  warning = 'warning',
  danger = 'danger',
  info = 'info'
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: paddings.paddingL,
    flexWrap: 'wrap',
    alignItems: 'center'
  }
});

export default DueDateState;

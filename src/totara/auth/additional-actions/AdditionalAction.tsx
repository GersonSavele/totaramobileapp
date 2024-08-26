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

import { Images } from '@resources/images';
import { Button, InfoModal } from '@totara/components';
import { useSession } from '@totara/core';
import { ADDITIONALACTION_TEST_IDS } from '@totara/lib/testIds';
import { translate } from '@totara/locale';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';

const AdditionalAction = () => {
  const { host, endSession } = useSession();
  const dispatch = useDispatch();
  return (
    <InfoModal
      title={translate('additional_actions_modal.auth_model_title')}
      description={translate('additional_actions_modal.auth_model_description')}
      imageSource={Images.actionRequired as ImageSourcePropType}
      visible={true}
      testID={ADDITIONALACTION_TEST_IDS.INFOR}>
      <Button
        variant="primary"
        text={translate('additional_actions_modal.auth_model_go_to_browser')}
        icon={'up-right-from-square'}
        onPress={() => {
          Linking.openURL(host!);
        }}
        testID={ADDITIONALACTION_TEST_IDS.PRIMARY_BUTTON}
      />
      <Button
        variant="tertiary"
        text={translate('additional_actions_modal.auth_model_logout')}
        onPress={() => {
          dispatch(endSession());
        }}
        testID={ADDITIONALACTION_TEST_IDS.TERTIARY_BUTTON}
      />
    </InfoModal>
  );
};

export default AdditionalAction;

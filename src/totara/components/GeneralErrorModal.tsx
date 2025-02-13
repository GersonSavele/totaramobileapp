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
import { translate } from '@totara/locale';
import React, { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Linking } from 'react-native';

import Button from './Button';
import InfoModal from './InfoModal';

type GeneralErrorModalProps = {
  customTitle?: string;
  customDescription?: string;
  primaryActionCustomText?: string;
  onPrimaryActionTap?: () => void;
  siteUrl?: string;
  visible?: boolean;
};

const GeneralErrorModal = ({
  siteUrl,
  onPrimaryActionTap,
  primaryActionCustomText,
  customDescription,
  customTitle,
  visible = false
}: GeneralErrorModalProps) => {
  const [_visible, setVisible] = useState(visible);

  return (
    <InfoModal
      title={customTitle ?? translate('general_error_feedback_modal.title')}
      description={customDescription ?? translate('general_error_feedback_modal.description')}
      imageSource={Images.generalError as ImageSourcePropType}
      visible={_visible}>
      <Button
        variant="primary"
        testID={'test_generalErrorDismiss'}
        text={primaryActionCustomText ?? translate('general_error_feedback_modal.action_primary')}
        onPress={() => {
          setVisible(!visible);
          if (onPrimaryActionTap) {
            onPrimaryActionTap();
          }
        }}
      />
      {siteUrl && siteUrl.length > 0 && (
        <Button
          variant="tertiary"
          testID={'test_generalErrorOpenURL'}
          text={translate('general_error_feedback_modal.action_tertiary')}
          onPress={() => {
            Linking.openURL(siteUrl);
          }}
        />
      )}
    </InfoModal>
  );
};

export default GeneralErrorModal;

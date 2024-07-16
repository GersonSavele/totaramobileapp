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

import { Images } from '@resources/images';
import { Button, InfoModal } from '@totara/components';
import { translate } from '@totara/locale';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Linking } from 'react-native';

type Props = {
  onClose: () => void;
  urlView: string;
};

const NativeAccessRestriction = ({ onClose, urlView }: Props) => {
  return (
    <InfoModal
      title={translate('current_learning.restriction_view.title')}
      description={translate('current_learning.restriction_view.description')}
      imageSource={Images.courseCompatible as ImageSourcePropType}
      visible>
      <Button
        variant="primary"
        onPress={() => Linking.openURL(urlView)}
        text={translate('current_learning.restriction_view.primary_button_title')}
        icon="external-link-alt"
        style={{ alignSelf: 'center' }}
      />
      <Button
        variant="tertiary"
        text={translate('current_learning.restriction_view.tertiary_button_title')}
        onPress={onClose}
      />
    </InfoModal>
  );
};

export default NativeAccessRestriction;

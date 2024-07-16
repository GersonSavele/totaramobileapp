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
import { isValidApiVersion } from '@totara/core/coreUtils';
import { config } from '@totara/lib';
import { translate } from '@totara/locale';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Linking } from 'react-native';

type Props = {
  onCancel?: () => void;
  siteUrl?: string;
  testID?: string;
};

const IncompatibleApiModal = ({ onCancel, siteUrl, testID }: Props) => {
  const { siteInfo, host } = useSession();
  const isShowIncompatibleApi = siteInfo ? !isValidApiVersion(siteInfo.version) : true;
  const site = host || siteUrl;
  if (isShowIncompatibleApi)
    return (
      <InfoModal
        title={translate('incompatible_api.title')}
        description={translate('incompatible_api.description')}
        imageSource={Images.urlNotValid as ImageSourcePropType}
        visible={isShowIncompatibleApi}
        testID={testID}>
        {site && (
          <Button
            variant="primary"
            text={translate('incompatible_api.action_primary')}
            onPress={() => {
              Linking.openURL(config.loginUri(site));
            }}
          />
        )}
        <Button
          variant="tertiary"
          text={translate('incompatible_api.action_tertiary_cancel')}
          onPress={() => {
            onCancel && onCancel();
          }}
        />
      </InfoModal>
    );
  else return null;
};

export default IncompatibleApiModal;

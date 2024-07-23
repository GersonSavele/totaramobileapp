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
import { useSession } from '@totara/core';
import { translate } from '@totara/locale';
import { margins, paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, Text } from 'react-native';
import { Clipboard } from 'react-native';
import { View } from 'react-native-animatable';
import { getBuildNumber, getVersion } from 'react-native-device-info';
import { showMessage } from 'react-native-flash-message';

const About = () => {
  const { host, siteInfo } = useSession();
  const onSiteURLLongPress = () => {
    Clipboard.setString(host!);
    showToast();
  };

  const onPluginVersionLongPress = () => {
    Clipboard.setString(siteInfo!.version as string);
    showToast();
  };

  const showToast = () =>
    showMessage({
      message: translate('general.copied_to_clipboard'),
      backgroundColor: 'black',
      icon: 'info',
      floating: true
    });

  return (
    <View style={styles.container} testID={'aboutContainer'}>
      <View style={styles.logoContainer} animation={'slideInUp'}>
        {/* TODO: Set up better type declarations for image assets */}
        <Image source={Images.totaraLogo as unknown as ImageSourcePropType} style={styles.logo} />
      </View>
      <View style={styles.versionContainer}>
        <Text style={styles.versionBuild}>{translate('about.version', { version: getVersion() })}</Text>
        <Text style={styles.versionBuild}>{`(${getBuildNumber()})`}</Text>
      </View>
      <View style={styles.environmentDetails}>
        <Text style={styles.siteUrlPluginVersion} onLongPress={onSiteURLLongPress}>
          {translate('about.site_url', { url: host })}
        </Text>
        <Text style={styles.siteUrlPluginVersion} onLongPress={onPluginVersionLongPress}>
          {translate('about.plugin_version', { version: siteInfo!.version })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1
  },
  logoContainer: { alignSelf: 'center' },
  logo: {
    height: 240 / 2, //half-size of original file
    aspectRatio: 240 / 170 //using aspectRatio of logo_totara@2x.png
  },
  versionContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: paddings.padding2XL
  },
  versionBuild: {
    ...TotaraTheme.textSmall,
    color: TotaraTheme.colorNeutral6,
    alignSelf: 'center'
  },
  environmentDetails: {
    alignSelf: 'center',
    marginTop: margins.marginL
  },
  siteUrlPluginVersion: {
    ...TotaraTheme.textXSmall,
    color: TotaraTheme.colorNeutral6,
    alignSelf: 'center',
    marginTop: margins.marginXS
  }
});

export default About;

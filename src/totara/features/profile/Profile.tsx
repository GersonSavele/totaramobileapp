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

import { useQuery } from '@apollo/client';
import { NetworkStatus } from '@apollo/client';
import type { StackScreenProps } from '@react-navigation/stack';
import { ImageWrapper, Loading, MessageBar, NetworkStatusIndicator } from '@totara/components';
import Icon from '@totara/components/Icon';
import event, { EVENT_LISTENER, Events } from '@totara/lib/event';
import { NAVIGATION } from '@totara/lib/navigation';
import { PROFILE_TEST_IDS } from '@totara/lib/testIds';
import { deviceScreen } from '@totara/lib/tools';
import { translate } from '@totara/locale';
import { ThemeContext } from '@totara/theme';
import { margins, paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import type { UserProfile } from '@totara/types';
import React, { useContext, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { userOwnProfile } from './api';

const Profile = ({ navigation }: StackScreenProps<any>) => {
  const { error, data, refetch, networkStatus } = useQuery(userOwnProfile, { notifyOnNetworkStatusChange: true });

  if (networkStatus === NetworkStatus.loading) return <Loading testID={'test_ProfileLoading'} />;

  return (
    <View>
      <NetworkStatusIndicator />
      {error && <MessageBar mode={'alert'} text={translate('general.error_unknown')} icon={'exclamation-circle'} />}
      <ScrollView
        style={{ backgroundColor: TotaraTheme.colorNeutral2 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={TotaraTheme.colorNeutral8}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={refetch}
          />
        }>
        <ProfileContent profile={data ? data.profile : undefined} navigation={navigation} />
      </ScrollView>
    </View>
  );
};

type ProfileContentProps = {
  navigation: any;
  profile: UserProfile;
};

const ProfileContent = ({ profile, navigation }: ProfileContentProps) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const theme = useContext(ThemeContext);

  const confirmedLogout = async () => {
    setLoggingOut(true);
    event.emit(EVENT_LISTENER, { event: Events.Logout });
  };

  const confirmationLogout = () => {
    return Alert.alert(
      translate('user_profile.logout.title'),
      translate('user_profile.logout.message_with_warn'),
      [
        {
          text: translate('general.cancel'),
          onPress: () => {},
          style: 'cancel'
        },
        { text: translate('general.yes'), onPress: confirmedLogout }
      ],
      { cancelable: false }
    );
  };

  const goToAbout = () => {
    navigation.navigate(NAVIGATION.ABOUT);
  };

  const { profileimage } = profile || {};

  return (
    <View style={[TotaraTheme.viewContainer]} testID={'test_ProfileContainer'}>
      <View style={styles.headerContent}>
        <View
          style={{
            ...styles.avatarContainer,
            borderColor: theme.colorPrimary
          }}>
          {profileimage ? (
            <ImageWrapper
              url={profileimage}
              style={styles.avatar}
              accessibilityLabel={translate('user_profile.accessibility_image')}
            />
          ) : (
            <View style={styles.avatar}>
              <Icon name="user" color={TotaraTheme.colorNeutral4} size={65} />
            </View>
          )}
        </View>
        {profile && (
          <>
            <Text style={styles.userDetails} testID={'test_ProfileUserDetails'}>
              {`${profile.firstname} ${profile.surname}`}
            </Text>
            <Text style={styles.userEmail} testID={'test_ProfileUserEmail'}>
              {profile.email}
            </Text>
            <Text style={styles.userLoginAs} testID={'test_ProfileUserLogin'}>
              {translate('user_profile.login_as', { username: profile.username })}
            </Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity testID={PROFILE_TEST_IDS.ABOUT} onPress={goToAbout} style={styles.sectionOption}>
          <Text style={TotaraTheme.textRegular}>{translate('user_profile.about')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID={PROFILE_TEST_IDS.LOGOUT}
          onPress={() => confirmationLogout()}
          style={styles.sectionOption}>
          <Text style={TotaraTheme.textRegular}>{translate('user_profile.logout.button_text')}</Text>
        </TouchableOpacity>
        <View>{loggingOut && <Loading />}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    padding: paddings.padding2XL,
    alignItems: 'center',
    backgroundColor: TotaraTheme.colorSecondary1,
    borderBottomColor: TotaraTheme.colorNeutral3,
    borderBottomWidth: 1
  },
  avatarContainer: {
    width: deviceScreen.width / 3,
    height: deviceScreen.width / 3,
    borderRadius: deviceScreen.width / 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: deviceScreen.width / 3 - 16,
    height: deviceScreen.width / 3 - 16,
    borderRadius: deviceScreen.width / 6,
    backgroundColor: TotaraTheme.colorNeutral3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userDetails: {
    marginTop: margins.marginS,
    ...TotaraTheme.textHeadline
  },
  userEmail: {
    ...TotaraTheme.textXSmall,
    ...{ color: TotaraTheme.colorNeutral6 }
  },
  userLoginAs: {
    ...TotaraTheme.textXSmall,
    ...{
      color: TotaraTheme.colorNeutral6,
      marginTop: margins.marginXS
    }
  },
  section: {
    minHeight: deviceScreen.height / 2,
    paddingHorizontal: paddings.paddingXL
  },
  sectionOption: {
    paddingVertical: paddings.paddingXL,
    borderBottomColor: TotaraTheme.colorNeutral3,
    borderBottomWidth: 1
  }
});

export default Profile;

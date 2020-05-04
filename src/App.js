/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React, { useContext, useEffect } from "react";
import { createAppContainer } from "react-navigation";
import { library } from "@fortawesome/fontawesome-svg-core";
import AsyncStorage from "@react-native-community/async-storage";
import * as Sentry from "@sentry/react-native";

import {
  faHome,
  faCloudDownloadAlt,
  faBell,
  faUser,
  faVideo,
  faTimes,
  faChevronRight,
  faFilm,
  faListUl,
  faTasks,
  faComments,
  faExternalLinkAlt,
  faCheck,
  faChevronUp,
  faChevronDown,
  faExclamationTriangle,
  faLock,
  faBoxOpen,
  faExclamationCircle,
  faArrowRight,
  faArrowLeft,
  faBullhorn,
  faBookOpen,
  faPenSquare,
  faBook,
  faPen,
  faChevronLeft,
  faUnlockAlt,
  faCaretUp,
  faCaretDown,
  faTrashAlt,
  faCaretRight,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

import ActivitySheetWrapper from "@totara/activities/ActivitySheetWrapper";
import { AuthProvider } from "@totara/core/AuthProvider";
import { AuthFlow } from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { AppModal } from "@totara/components";
import { ThemeProvider, ThemeContext } from "@totara/theme";
import { FeatureNavigator } from "@totara/features";
import ResourceManager from "@totara/core/ResourceManager/ResourceManager";
import { AttemptSynchronizer } from "@totara/activities/scorm/offline";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { config, Log } from "@totara/lib";
import messaging from '@react-native-firebase/messaging';

Sentry.init({
  dsn: config.sentryUri,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  Log.info('Message handled in the background: ', JSON.stringify(remoteMessage));
});

const App: () => React$Node = () => {

  useEffect(() => {
    messaging().getToken().then(token=>{
      Log.info('FIREBASE TOKEN: ', token);
    })

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Log.info('A new FCM message arrived: ', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    new ResourceManager().init();
  }, []);

  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthFlow>
            <ActivitySheetWrapper>
              <AppContainer />
            </ActivitySheetWrapper>
            <AdditionalAction />
            <AppModal />
            <AttemptSynchronizer />
          </AuthFlow>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppContainer = () => {
  const [theme] = useContext(ThemeContext);
  const AppMainNavigation = createAppContainer(FeatureNavigator());

  return <AppMainNavigation screenProps={{ theme: theme }} />;
};

// init is needeed for FA to bundle the only needed icons
// https://github.com/FortAwesome/react-native-fontawesome#build-a-library-to-reference-icons-throughout-your-app-more-conveniently
// TODO this will be an issue extending this app, probably best to put this somewhere else
const initFontAwesome = () => {
  library.add(
    faHome,
    faCloudDownloadAlt,
    faBell,
    faUser,
    faVideo,
    faTimes,
    faChevronRight,
    faFilm,
    faListUl,
    faTasks,
    faComments,
    faExternalLinkAlt,
    faCheck,
    faExclamationTriangle,
    faChevronUp,
    faLock,
    faBoxOpen,
    faExclamationCircle,
    faArrowLeft,
    faArrowRight,
    faBullhorn,
    faBookOpen,
    faPenSquare,
    faBook,
    faPen,
    faChevronLeft,
    faUnlockAlt,
    faCaretUp,
    faCaretDown,
    faTrashAlt,
    faCaretRight,
    faBolt,
    faChevronDown
  );
};
initFontAwesome();

export default App;

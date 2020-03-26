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

import React, {useContext, useEffect} from "react";
import { createAppContainer } from "react-navigation";
import { library } from '@fortawesome/fontawesome-svg-core';
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
  faBolt
} from "@fortawesome/free-solid-svg-icons";

import { ActivitySheetProvider } from "@totara/activities";
import { AuthProvider } from "@totara/core/AuthProvider";
import { AuthFlow } from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { AppModal } from "@totara/components";
import { ThemeProvider, ThemeContext } from "@totara/theme";
import {FeatureNavigator} from "@totara/features";
import ResourceManager from "@totara/core/ResourceManager/ResourceManager";
import {AttemptSynchronizer} from "@totara/activities/scorm/offline";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { config } from "@totara/lib";

Sentry.init({
  dsn: config.sentryUri,
});

const App : () => React$Node = () => {

  // constructor() {
  //   super();
  // }
  //
  // // TODO: this is just basic notification callback to check if notification to RN.
  // async onPushRegistered(deviceToken) {
  //   // TODO: Send the token to my server so it could send back push notifications...
  //   Log.info("Device Token Received", deviceToken);
  // }
  //
  // // TODO: this is just basic notification callback to check if notification to RN.
  // onPushRegistrationFailed(error) {
  //   Log.error(error);
  // }
  //
  // // TODO: this is just basic notification callback to check if notification to RN.
  // onNotificationReceivedForeground(notification) {
  //   Log.info("Notification Received - Foreground", notification);
  // }
  //
  // // TODO: this is just basic notification callback to check if notification to RN.
  // onNotificationReceived(notification) {
  //   Log.info("Notification Received", notification);
  // }
  //
  // // TODO: this is just basic notification callback to check if notification to RN.
  // onNotificationOpened(notification) {
  //   Log.info("Notification opened by device user", notification);
  // }
  //
  // async componentWillUnmount() {
  //   // prevent memory leaks!
  //   await notifications.cleanUp();
  // }
  //
  // async componentDidMount() {
  //   await new ResourceManager().init();
  //   await notifications.init(
  //     this.onNotificationReceivedForeground,
  //     this.onNotificationOpened,
  //     this.onPushRegistered,
  //     this.onPushRegistrationFailed
  //   );
  // }

  useEffect(()=>{
    new ResourceManager().init();
  });


  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthFlow>
            <ActivitySheetProvider>
              <AppContainer />
            </ActivitySheetProvider>
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

  return (
      <AppMainNavigation screenProps={{ theme: theme }}/>
  );
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
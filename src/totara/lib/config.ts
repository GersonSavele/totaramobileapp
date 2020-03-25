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

import localConfig from "./config.local";
import ConsoleLogger from "./logger/ConsoleLogger";


const defaultConfig = {
  urlProtocol: "https",
  mobileApi: {
    persistentQuery: true
  },
  userAgent: "TotaraMobileApp",
  apiUri: (host: string) => (`${host}/totara/mobile/api.php`),
  infoUri: (host: string) => (`${host}/totara/mobile/site_info.php`),
  loginUri: (host: string) => (`${host}/login/index.php`),
  deviceRegisterUri: (host: string) => (`${host}/totara/mobile/device_register.php`),
  webViewUri: (host: string) => (`${host}/totara/mobile/device_webview.php`),
  forgotPasswordUri: (host: string) => (`${host}/login/forgot_password.php`),
  nativeLoginSetupUri: (host: string) => (`${host}/totara/mobile/login_setup.php`),
  nativeLoginUri: (host: string) => (`${host}/totara/mobile/login.php`),
  appLinkDomain: "https://mobile.totaralearning.com",
  deepLinkSchema: "totara://",
  minApiVersion: "2019111100", // "disabled"

  features:{
    downloads: true,
    notifications: false
  },
  rootOfflineScormPlayer: "html",
};

export const internalConfig = {
  logger: ConsoleLogger
};

let config = {...defaultConfig, ...localConfig};

export default config;


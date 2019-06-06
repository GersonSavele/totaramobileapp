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

const defaultConfig = {
  mobileApi: "http://localhost:4000",
  mobileStatic: "http://localhost:4001",
  // startNodeJsMobile: true
  startNodeJsMobile: false,
  userAgent: "TotaraMobileApp",

  loginUri: (host: string)=> { return `${host}/login/index.php` },
  deviceRegisterUri: (host: string) => { return `${host}/totara/mobile/device_register.php` }
};

let config = {...defaultConfig, ...localConfig};

export default config;


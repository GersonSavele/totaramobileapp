/*
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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 */

import { Logger } from "./Logger"

/**
 * ConsoleLogger is a basic logger that outputs into JS console
 */
class ConsoleLogger implements Logger {

  init() {
  }

  close() {
  }

  debug(message: string, ...others: any[]) {
    console.debug("[DEBUG]", message, others);
  }

  info(message: string, ...others: any[]) {
    console.info("[INFO]", message, others);
  }

  warn(message: string, ...others: any[]) {
    console.warn("[WARN]", message, others);
  }

  error(message: string, error: Error, ...others: any[]){
    // eslint-disable-next-line no-undef
    if (__DEV__) { // its ok to ignore __DEV__ not defined on TS.  It is defined globally
      console.error("[ERROR]", message, error, others); // only blow up on development mode
    } else {
      console.log("[ERROR]", message, error, others);
    }
  }
}

export default new ConsoleLogger()
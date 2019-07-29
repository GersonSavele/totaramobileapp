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
 */


/**
 * Logger an interface for logging systems used by the app.  There can be different implementations
 * of logging and it should be abstracted away from the other parts of the app
 */
export interface Logger {
  /**
   * Implementations that require initialization before logging can be used by the app should implement this
   * @param params
   */
  init: (params: any[]) => void

  /**
   * Implementations that require cleanup, teardown during shutdown of the app should implement this
   * @param params
   */
  close: (params: any[]) => void

  /**
   * Used for debugging level message
   */
  debug: (message: string, ...others: any[]) => void

  /**
   * Used for info level message
   */
  info: (message: string, ...others: any[]) => void

  /**
   * Used for warning level message
   */
  warn: (message: string, ...others: any[]) => void

  /**
   * Used for error level message.  Do NOT use this for error handling
   * @param message
   * @param error - the Error being reported
   * @param others
   */
  error: (message: string, error: Error, ...others: any[]) => void
}

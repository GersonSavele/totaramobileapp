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
 * @author Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 *
 */

import i18n from "./i18n";
import { Scope, TranslateOptions } from "i18n-js";

const translate = (scope: Scope, options?: TranslateOptions) =>
  i18n.t(scope, options);

const addLocale = (locale: string, json: any) => {
  i18n.translations[locale] = json;
};

const changeLocale = (locale: string) => {
  i18n.locale = locale;
};

const getLocale = () => {
  return i18n.locale;
};

const getTranslations = () => {
  return i18n.translations;
};

export { translate, addLocale, changeLocale, getLocale, getTranslations };

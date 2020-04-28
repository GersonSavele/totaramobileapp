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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

import { CourseSets } from "./Course";

export interface Certification {
  id: number;
  itemtype: "certificate" | string;
  shortname: string;
  fullname?: string;
  summary?: string;
  duedateState?: string;
  duedate?: Date;
  progress?: number;
  courseSets: [CourseSets];
  completion: Completion;
  imageSrc?: string;
  criteria?: [Criteria];
}

interface Completion {
  id: number;
  statuskey:
    | ""
    | "completeviarpl"
    | "complete"
    | "inprogress"
    | "notyetstarted";
  progress: number;
  timecompleted?: Date;
  grademax: number;
  gradefinal: number;
}

interface Criteria {
  id: number;
  type?: string;
  typeaggregation?: string;
  criteria?: string;
  requirement?: string;
  status?: string;
  complete: boolean;
  completiondate?: Date;
}

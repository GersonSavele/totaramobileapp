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

import {LearningStatus} from "./LearningStatus";


export interface Activity extends LearningStatus {
  id: number,
  type: string,
  itemName: string,
  progressPercentage?: number
}

export interface Section {
  sectionName: string
  activities: [Activity]
}

export interface LearningItem extends LearningStatus {
  id: number
  type: string
  shortname: string
  fullname?: string
  summary?: string
  dueDateState?: string
  dueDate?: Date
  progressPercentage?: number
  groupCount?: number
  sections: [Section]
}
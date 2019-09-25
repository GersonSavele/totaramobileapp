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

import { LearningStatus } from "./LearningStatus";
import { Activity } from "./Activity";

export interface Section {
  sectionName: string
  activities: [Activity]
}

export enum LearningItemType {
  Course = "Course",
  Program = "Program",
  Certification = "Certification"
}

export interface LearningItem extends LearningStatus {
  id: number
  itemtype: string
  shortname: string
  fullname?: string
  summary?: string
  duedateState?: string
  duedate?: Date
  progress?: number
  imageSrc?: string
}
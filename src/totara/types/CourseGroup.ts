/*

This file is part of Totara Enterprise.
*
Copyright (C) 2020 onwards Totara Learning Solutions LTD
*
Totara Enterprise is provided only to Totara Learning Solutions
LTD’s customers and partners, pursuant to the terms and
conditions of a separate agreement with Totara Learning
Solutions LTD or its affiliate.
*
If you do not have an agreement with Totara Learning Solutions
LTD, you may not access, use, modify, or distribute this software.
Please contact [sales@totaralearning.com] for more information.
*
*/

import { Completion } from "./Completion";

export interface CourseGroup {
  id: number;
  fullname?: string;
  shortname: string;
  duedate?: Date;
  duedateState?: string;
  summary?: string;
  availablefrom: Date;
  availableuntil?: Date;
  imageSrc?: string;
  completion: Completion;
  currentCourseSets: [CourseSets];
  countUnavailableSets: number;
}

export interface CourseSets {
  id: number;
  label: string;
  nextsetoperator: string;
  completionCriteria: string;
  courses: [Courses];
}

export interface Courses {
  id: number;
  itemtype: string;
  itemcomponent: string;
  fullname: string;
  shortname: string;
  summary?: string;
  progress: number;
  urlView: string;
  duedate?: Date;
  duedateState: string;
  native: boolean;
  imageSrc: string;
}

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

export interface CourseGroup {
  id: number;
  fullname?: string;
  shortname: string;
  duedate?: Date;
  duedateState?: string;
  summary?: string;
  endnote?: string;
  availablefrom: Date;
  availableuntil?: Date;
  imageSrc?: string;
  completion: Completion;
  currentCourseSets: [[CourseSets]];
  countUnavailableSets: number;
  itemtype: string;
}

export interface CourseSets {
  id: number;
  label: string;
  nextsetoperator: string;
  completionCriteria: [string];
  courses: [Course];
}

export interface Course {
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

export enum statusKey {
  assigned = "assigned",
  completed = "completed",
  inProgress = "inprogress",
  expired = "expired"
}

export enum renewalStatusKey {
  notdue = "notdue",
  dueforrenewal = "dueforrenewal",
  expired = "expired"
}

export interface Completion {
  id: number;
  statuskey: statusKey;
  progress: number;
  timecompleted?: Date;
  renewalstatuskey?: renewalStatusKey;
}

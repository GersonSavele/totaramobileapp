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

import { Activity } from "./Activity";
import { learningItemEnum } from "@totara/features/currentLearning/constants";

export interface Section {
  id: number;
  title: string;
  available: boolean;
  availablereason?: [string];
  summary: string;
  data?: [Activity];
}

export interface LearningItem {
  id: number;
  itemComponent: string;
  itemtype: learningItemEnum.Program | learningItemEnum.Course | learningItemEnum.Certification;
  shortname: string;
  fullname?: string;
  summary?: string;
  duedateState?: string;
  urlView?: string;
  duedate?: Date;
  progress?: number;
  native: boolean;
  imageSrc: string;
}

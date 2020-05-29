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

import { CourseSets } from "./Course";
import { Completion } from "./Completion";
import { Criteria } from "./Criteria";
import { learningItemEnum } from "@totara/lib/constants";

export interface CourseGroup {
  id: number;
  itemtype: learningItemEnum.Certification | learningItemEnum.Program;
  shortname: string;
  fullname?: string;
  summary?: string;
  duedateState?: string;
  duedate?: Date;
  progress?: number;
  completion: Completion;
  courseSets: [CourseSets];
  image?: string;
  criteria?: [Criteria];
}

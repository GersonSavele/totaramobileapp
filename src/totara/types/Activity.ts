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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 */

import { completionTrack, completionStatus } from "@totara/features/currentLearning/constants";

export interface Activity {
  id: number;
  instanceid: number;
  name: string;
  modtype: string;
  viewurl?: string;
  completion?: completionTrack;
  completionstatus?: completionStatus;
  available: boolean;
  availablereason?: [string];
  description?: string;
}

export interface ScormActivity extends Activity {
  modtype: "scorm";
  currentAttempt: number;
  maxAttempt: number;
  score: number;
  webEntryUrl?: string;
  isAvailable: boolean;
  offlineAttemptsAllowed: boolean;
  packageUrl: string;
  courseid: number;
}

export interface SeminarActivity extends Activity {
  modtype: "facetoface";
}

export interface ForumsActivity extends Activity {
  modtype: "forum";
}

export interface QuizActivity extends Activity {
  modtype: "quiz";
}

export interface AssignmentActivity extends Activity {
  modtype: "assign";
}

export type ActivityType = ScormActivity | SeminarActivity | ForumsActivity | QuizActivity | AssignmentActivity;

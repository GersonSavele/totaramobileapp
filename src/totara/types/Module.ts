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

export interface Module {
  id: number
  modtype: string
  name: string
  viewurl?: string
  completion?: number // TODO change to : "COMPLETION_TRACKING_NONE" | "COMPLETION_TRACKING_MANUAL" | "COMPLETION_TRACKING_AUTOMATIC"
  completionstatus?: number // TODO change to : "COMPLETION_INCOMPLETE" | "COMPLETION_COMPLETE" | "COMPLETION_COMPLETE_PASS" | "COMPLETION_COMPLETE_FAIL"
  available: boolean
  availablereason?: string
}

export interface ScormModule extends Module {
  modtype: "scorm",
  currentAttempt : number,
  maxAttempt : number,
  score : number,
  webEntryUrl?: string,
  isAvailable :boolean
}

export interface SeminarModule extends Module {
  modtype: "facetoface"
}

export interface ForumsModule extends Module {
  modtype: "forum"
}

export interface QuizModule extends Module {
  modtype: "quiz"
}

export interface AssignmentModule extends Module {
  modtype: "assign"
}

export type ModuleType =
  ScormModule |
  SeminarModule |
  ForumsModule |
  QuizModule |
  AssignmentModule;
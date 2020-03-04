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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { ScormActivity } from "@totara/types";

export type Response = {
    scorm: ScormActivity;
}

export type Variables = {
    scormid: number;
}

export const scormQuery = gql` 
    query totara_mobile_scorm($scormid: core_id!) {
      scorm: mod_scorm_scorm(scormid: $scormid) {
        id
        courseid
        name
        description(format: PLAIN)
        type
        packageUrl: package_url
        offlineAttemptsAllowed: offlineAttemptsAllowed
        attemptsMax: attempts_max
        attemptsCurrent: attempts_current
        attemptsForceNew: attempts_forcenew
        attemptsLockFinal: attempts_lockfinal
        autoContinue: compatibility_autocontinue
        launchUrl: launch_url
        calculatedGrade: calculated_grade
      }
    }
`;

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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */


import { getGradeForAttempt, getAttemptsGrade } from "../OfflineSCORMController";
import { Grade, AttemptGrade } from "@totara/types/scorm";

describe("getGradeForAttempt", () => {
  it("return correct values for complete `attemptcmi`", () => {
    const attemptCmi = eval({ 
      "id1": {
        core: {
          score: {
            raw: 4
          },
          lesson_status: "completed"
        }
      },
      "id2": {
        core: {
          score: {
            raw: 2
          },
          lesson_status: "failed"
        }
      },
      "id3": {
        core: {
          score: {
            raw: 8
          },
          lesson_status: "passed"
        }
      }
    });
    expect(getGradeForAttempt(attemptCmi, 10, Grade.objective)).toEqual(2);
    expect(getGradeForAttempt(attemptCmi, 10, Grade.highest)).toEqual(80);
    expect(getGradeForAttempt(attemptCmi, 10, Grade.average)).toEqual(47);
    expect(getGradeForAttempt(attemptCmi, 10, Grade.sum)).toEqual(140);
  });

  it("should return correct for `grademethod` [objective] and 0 for [highest/average/sum], if `attemptcmi` has only lesson_status and no score", () => {
    const blankAttemptCmi = eval({ 
      "id1": {
        core: {
          lesson_status: "completed"
        }
      },
      "id2": {
        core: {
          lesson_status: "failed"
        }
      },
      "id3": {
      }
    });
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.objective)).toEqual(1);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.highest)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.average)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.sum)).toEqual(0);
  });

  it("should return 0 for all the `grademethod`, if there is no any lesson_status or score in `attemptcmi`", () => {
    const blankAttemptCmi = eval({ 
      "id1": {
        core: {
        }
      },
      "id2": {
        core: {
        }
      },
      "id3": {
      }
    });
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.objective)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.highest)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.average)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.sum)).toEqual(0);
  });
  
});

describe("getAttemptsGrade", () => {

  it("return particular value for `attemptGrade` with non-empty `attemptsReport`", () => {
    const attemptsReport = [{ 
      attempt: 1,
      gradereported: 60
    }, { 
      attempt: 2,
      gradereported: 40
    }, { 
      attempt: 3,
      gradereported: 70
    }, { 
      attempt: 4,
      gradereported: 50
    }];
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.highest, 10)).toEqual(70);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.average, 10)).toEqual(60);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.first, 10)).toEqual(60);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.last, 10)).toEqual(50);
  });

  it("return 0 for all `attemptGrade` with empty attemptsReport", () => {
    const attemptsReport = [];
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.highest, 10)).toEqual(0);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.average, 10)).toEqual(0);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.first, 10)).toEqual(0);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.last, 10)).toEqual(0);
  });

});
/**
 * This file is part of Totara Enterprise.
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { getGradeForAttempt, getAttemptsGrade } from "../OfflineSCORMController";
import { Grade, AttemptGrade } from "@totara/types/scorm";
import { LessonStatus } from "@totara/lib/Constant";

describe("getGradeForAttempt", () => {
  it("return correct values for complete `attemptcmi`", () => {
    const attemptCmi = eval({ 
      "id1": {
        core: {
          score: {
            raw: 4
          },
          lesson_status: LessonStatus.completed
        }
      },
      "id2": {
        core: {
          score: {
            raw: 2
          },
          lesson_status: LessonStatus.failed
        }
      },
      "id3": {
        core: {
          score: {
            raw: 8
          },
          lesson_status: LessonStatus.passed
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
          lesson_status: LessonStatus.completed
        }
      },
      "id2": {
        core: {
          lesson_status: LessonStatus.failed
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
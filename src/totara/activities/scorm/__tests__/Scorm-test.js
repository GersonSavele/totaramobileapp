/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */
import moment from "moment";
import {
  saveScormActivityData,
  getDataForScormSummary,
  getAttemptsGrade,
  getGradeForAttempt,
  calculatedAttemptsGrade
} from "../utils";
import { AttemptGrade, Grade } from "@totara/types/Scorm";
import { scormLessonStatus } from "@totara/lib/constants";

describe("getDataForScormSummary", () => {
  it("return correct object for valid `scormBundle` and default values for undefined ", () => {
    const scormBundle = eval({
      scorm: {
        id: "8",
        courseid: "30",
        name: "Creating a dynamic audience",
        scormtype: "local",
        reference: "Creating a dynamic audience.zip",
        intro: "",
        version: "SCORM_1.2",
        maxgrade: 100,
        grademethod: Grade.highest,
        whatgrade: AttemptGrade.highest,
        maxattempt: null,
        forcecompleted: false,
        forcenewattempt: false,
        lastattemptlock: false,
        masteryoverride: false,
        displaycoursestructure: false,
        skipview: 2,
        nav: 1,
        navpositionleft: -100,
        navpositiontop: -100,
        auto: false,
        width: 100,
        height: 500,
        timeopen: null,
        timeclose: null,
        displayactivityname: true,
        autocommit: false,
        allowmobileoffline: true,
        completion: 2,
        completionview: false,
        completionstatusrequired: 4,
        completionscorerequired: null,
        completionstatusallscos: false,
        packageUrl:
          "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/396/mod_scorm/package/0/Creating%20a%20dynamic%20audience.zip?forcedownload=1",
        launchUrl:
          "https://mobile.demo.totara.software/mod/scorm/player.php?mode=normal&newattempt=on&cm=122&scoid=0",
        repeatUrl: "",
        attemptsCurrent: 1,
        calculatedGrade: "10%",
        offlinePackageUrl:
          "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/396/mod_scorm/package/12/Creating%20a%20dynamic%20audience.zip",
        offlinePackageContentHash: "e99447a9fa5447cdcfffb2bdefdefbc15bdd0821",
        offlinePackageScoIdentifiers: ["Software_Simulation_SCO"],
        attempts: [
          {
            attempt: 1,
            timestarted: null,
            gradereported: 0
          }
        ],
        description: "Title",
        attemptsMax: null,
        attemptsForceNew: false,
        attemptsLockFinal: false,
        autoContinue: false,
        offlineAttemptsAllowed: true
      },
      lastsynced: 1588040660
    });
    const expectResultDefault = {
      name: undefined,
      description: undefined,
      totalAttempt: 0,
      calculatedGrade: undefined,
      actionPrimary: false,
      actionSecondary: false,
      gradeMethod: undefined,
      attemptGrade: undefined,
      lastsynced: undefined,
      timeOpen: undefined,
      maxAttempts: undefined,
      attempts: undefined,
      completionScoreRequired: undefined
    };
    expect(getDataForScormSummary(true, undefined)).toEqual(
      expectResultDefault
    );

    const expectResultScormBundleOnline = {
      name: "Creating a dynamic audience",
      description: "Title",
      totalAttempt: 1,
      calculatedGrade: "10%",
      actionPrimary: true,
      actionSecondary: false,
      gradeMethod: Grade.highest,
      attemptGrade: AttemptGrade.highest,
      lastsynced: undefined,
      timeOpen: undefined,
      maxAttempts: undefined,
      attempts: [
        {
          attempt: 1,
          timestarted: null,
          gradereported: 0
        }
      ],
      completionScoreRequired: undefined
    };
    expect(getDataForScormSummary(true, scormBundle)).toEqual(
      expectResultScormBundleOnline
    );

    const expectResultScormBundleOffline = {
      name: "Creating a dynamic audience",
      description: "Title",
      totalAttempt: 1,
      calculatedGrade: "10%",
      actionPrimary: true,
      actionSecondary: false,
      gradeMethod: Grade.highest,
      attemptGrade: AttemptGrade.highest,
      lastsynced: moment.unix(scormBundle.lastsynced),
      timeOpen: undefined,
      maxAttempts: undefined,
      attempts: [
        {
          attempt: 1,
          timestarted: null,
          gradereported: 0
        }
      ],
      completionScoreRequired: undefined
    };
    expect(getDataForScormSummary(false, scormBundle)).toEqual(
      expectResultScormBundleOffline
    );
  });
});

describe("saveScormActivityData", () => {
  it("should call `saveInTheCache` for `completed` attempt with new formatted data, if there is no any existing cache", () => {
    const client = require("@apollo/react-hooks");

    const completedCommitData = {
      scormid: "18",
      attempt: "16",
      scoid: "item_1",
      commit: {
        timestarted: 1592950901,
        tracks: [
          {
            identifier: "item_1",
            element: "cmi.core.lesson_status",
            value: scormLessonStatus.completed,
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.suspend_data",
            value:
              '{"lang":"en","completion":"-1111111","questions":"","_isCourseComplete":true,"_isAssessmentPassed":false}',
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.id",
            value: "5cd58e9cd35dedaa11771534",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.type",
            value: "matching",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.student_response",
            value: "1.2,2.1,3.1,4.1",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.result",
            value: "correct",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.time",
            value: "10:22:01",
            timemodified: 1592950921
          }
        ]
      },
      cmi: {
        core: {
          score: { _children: "raw,min,max", raw: "", max: "", min: "" },
          _children:
            "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
          student_id: "kamala",
          student_name: "Tennakoon, Kamala",
          lesson_location: "",
          credit: "credit",
          lesson_status: scormLessonStatus.completed,
          entry: "ab-initio",
          total_time: "00:00:00",
          lesson_mode: "normal",
          exit: "",
          session_time: "00:00:00"
        },
        objectives: { _children: "id,score,status", _count: "0" },
        student_data: {
          _children: "mastery_score,max_time_allowed,time_limit_action",
          mastery_score: "",
          max_time_allowed: "",
          time_limit_action: ""
        },
        student_preference: {
          _children: "audio,language,speed,text",
          audio: "0",
          language: "",
          speed: "0",
          text: "0"
        },
        interactions: {
          _children:
            "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
          _count: 1
        },
        evaluation: {
          comments: { _count: "0", _children: "content,location,time" }
        },
        _children:
          "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
        _version: "3.4",
        suspend_data:
          '{"lang":"en","completion":"-1111111","questions":"","_isCourseComplete":true,"_isAssessmentPassed":false}',
        launch_data: "",
        comments: "",
        comments_from_lms: "",
        interactions_0: {
          objectives: { _count: 0 },
          correct_responses: { _count: 0 },
          id: "5cd58e9cd35dedaa11771534",
          type: "matching",
          student_response: "1.2,2.1,3.1,4.1",
          result: "correct",
          time: "10:22:01"
        }
      }
    };
    const mockAttemptGrade = 10;
    const retrieveAllDataMock = jest.fn(() => ({}));
    const getGradeForAttemptMock = jest.fn(() => mockAttemptGrade);
    const saveInTheCacheMock = jest.fn();

    const expectedResult = {
      "18": {
        cmi: {
          [completedCommitData.attempt]: {
            [completedCommitData.scoid]: completedCommitData.cmi
          }
        },
        offlineActivity: {
          attempts: [
            {
              attempt: completedCommitData.attempt,
              gradereported: mockAttemptGrade
            }
          ]
        },
        commits: {
          [completedCommitData.attempt]: {
            [completedCommitData.scoid]: completedCommitData.commit
          }
        }
      }
    };
    saveScormActivityData({
      data: completedCommitData,
      client,
      maxGrade: null,
      gradeMethod: Grade.highest,
      onRetrieveAllData: retrieveAllDataMock,
      onGetGradeForAttempt: getGradeForAttemptMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(retrieveAllDataMock).toBeCalledTimes(1);
    expect(getGradeForAttemptMock).toBeCalledTimes(1);
    expect(saveInTheCacheMock).toBeCalledWith({
      client,
      scormBundles: expectedResult
    });
  });
  it("should call `saveInTheCache` with updated existing cache for `completed` attempt", () => {
    const client = require("@apollo/react-hooks");

    const completedCommitData = {
      scormid: "18",
      attempt: "16",
      scoid: "item_1",
      commit: {
        timestarted: 1592950901,
        tracks: [
          {
            identifier: "item_1",
            element: "cmi.core.lesson_status",
            value: scormLessonStatus.completed,
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.suspend_data",
            value:
              '{"lang":"en","completion":"-1111111","questions":"","_isCourseComplete":true,"_isAssessmentPassed":false}',
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.id",
            value: "5cd58e9cd35dedaa11771534",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.type",
            value: "matching",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.student_response",
            value: "1.2,2.1,3.1,4.1",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.result",
            value: "correct",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.time",
            value: "10:22:01",
            timemodified: 1592950921
          }
        ]
      },
      cmi: {
        core: {
          score: { _children: "raw,min,max", raw: "", max: "", min: "" },
          _children:
            "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
          student_id: "kamala",
          student_name: "Tennakoon, Kamala",
          lesson_location: "",
          credit: "credit",
          lesson_status: scormLessonStatus.completed,
          entry: "ab-initio",
          total_time: "00:00:00",
          lesson_mode: "normal",
          exit: "",
          session_time: "00:00:00"
        },
        objectives: { _children: "id,score,status", _count: "0" },
        student_data: {
          _children: "mastery_score,max_time_allowed,time_limit_action",
          mastery_score: "",
          max_time_allowed: "",
          time_limit_action: ""
        },
        student_preference: {
          _children: "audio,language,speed,text",
          audio: "0",
          language: "",
          speed: "0",
          text: "0"
        },
        interactions: {
          _children:
            "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
          _count: 1
        },
        evaluation: {
          comments: { _count: "0", _children: "content,location,time" }
        },
        _children:
          "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
        _version: "3.4",
        suspend_data:
          '{"lang":"en","completion":"-1111111","questions":"","_isCourseComplete":true,"_isAssessmentPassed":false}',
        launch_data: "",
        comments: "",
        comments_from_lms: "",
        interactions_0: {
          objectives: { _count: 0 },
          correct_responses: { _count: 0 },
          id: "5cd58e9cd35dedaa11771534",
          type: "matching",
          student_response: "1.2,2.1,3.1,4.1",
          result: "correct",
          time: "10:22:01"
        }
      }
    };
    const retrieveDataResultMock = {
      "18": {
        cmi: {
          [completedCommitData.attempt]: {
            [completedCommitData.scoid]: completedCommitData.cmi
          }
        },
        offlineActivity: {
          attempts: [
            {
              attempt: 9,
              gradereported: "0"
            }
          ]
        },
        commits: {
          [completedCommitData.attempt]: {
            [completedCommitData.scoid]: completedCommitData.commit
          }
        }
      }
    };
    const mockAttemptGrade = 10;
    const retrieveAllDataMock = jest.fn(() => retrieveDataResultMock);
    const getGradeForAttemptMock = jest.fn(() => mockAttemptGrade);
    const saveInTheCacheMock = jest.fn();
    const newAttempts = retrieveDataResultMock[
      completedCommitData.scormid
    ].offlineActivity.attempts.concat({
      attempt: completedCommitData.attempt,
      gradereported: mockAttemptGrade
    });
    const expectedResult = {
      "18": {
        cmi: {
          [completedCommitData.attempt]: {
            [completedCommitData.scoid]: completedCommitData.cmi
          }
        },
        offlineActivity: {
          attempts: newAttempts
        },
        commits: {
          [completedCommitData.attempt]: {
            [completedCommitData.scoid]: completedCommitData.commit
          }
        }
      }
    };
    saveScormActivityData({
      data: completedCommitData,
      client,
      maxGrade: null,
      gradeMethod: Grade.highest,
      onRetrieveAllData: retrieveAllDataMock,
      onGetGradeForAttempt: getGradeForAttemptMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(retrieveAllDataMock).toBeCalledTimes(1);
    expect(getGradeForAttemptMock).toBeCalledTimes(1);
    expect(saveInTheCacheMock).toBeCalledWith({
      client,
      scormBundles: expectedResult
    });
  });
  it("should NOT proceed saving, if it is incomplete attempt", () => {
    const client = require("@apollo/react-hooks");

    const inCompleteCommitData = {
      scormid: "18",
      attempt: "16",
      scoid: "item_1",
      commit: {
        timestarted: 1592950901,
        tracks: [
          {
            identifier: "item_1",
            element: "cmi.core.lesson_status",
            value: scormLessonStatus.incomplete,
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.suspend_data",
            value:
              '{"lang":"en","completion":"-1111111","questions":"","_isCourseComplete":true,"_isAssessmentPassed":false}',
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.id",
            value: "5cd58e9cd35dedaa11771534",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.type",
            value: "matching",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.student_response",
            value: "1.2,2.1,3.1,4.1",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.result",
            value: "correct",
            timemodified: 1592950921
          },
          {
            identifier: "item_1",
            element: "cmi.interactions_0.time",
            value: "10:22:01",
            timemodified: 1592950921
          }
        ]
      },
      cmi: {
        core: {
          score: { _children: "raw,min,max", raw: "", max: "", min: "" },
          _children:
            "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
          student_id: "kamala",
          student_name: "Tennakoon, Kamala",
          lesson_location: "",
          credit: "credit",
          lesson_status: scormLessonStatus.incomplete,
          entry: "ab-initio",
          total_time: "00:00:00",
          lesson_mode: "normal",
          exit: "",
          session_time: "00:00:00"
        },
        objectives: { _children: "id,score,status", _count: "0" },
        student_data: {
          _children: "mastery_score,max_time_allowed,time_limit_action",
          mastery_score: "",
          max_time_allowed: "",
          time_limit_action: ""
        },
        student_preference: {
          _children: "audio,language,speed,text",
          audio: "0",
          language: "",
          speed: "0",
          text: "0"
        },
        interactions: {
          _children:
            "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
          _count: 1
        },
        evaluation: {
          comments: { _count: "0", _children: "content,location,time" }
        },
        _children:
          "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
        _version: "3.4",
        suspend_data:
          '{"lang":"en","completion":"-1111111","questions":"","_isCourseComplete":true,"_isAssessmentPassed":false}',
        launch_data: "",
        comments: "",
        comments_from_lms: "",
        interactions_0: {
          objectives: { _count: 0 },
          correct_responses: { _count: 0 },
          id: "5cd58e9cd35dedaa11771534",
          type: "matching",
          student_response: "1.2,2.1,3.1,4.1",
          result: "correct",
          time: "10:22:01"
        }
      }
    };
    const mockAttemptGrade = 10;
    const retrieveAllDataMock = jest.fn(() => ({}));
    const getGradeForAttemptMock = jest.fn(() => mockAttemptGrade);
    const saveInTheCacheMock = jest.fn();

    saveScormActivityData({
      data: inCompleteCommitData,
      client,
      maxGrade: null,
      gradeMethod: Grade.highest,
      onRetrieveAllData: retrieveAllDataMock,
      onGetGradeForAttempt: getGradeForAttemptMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(retrieveAllDataMock).toBeCalledTimes(0);
    expect(getGradeForAttemptMock).toBeCalledTimes(0);
    expect(saveInTheCacheMock).toBeCalledTimes(0);
  });
});

describe("getGradeForAttempt", () => {
  it("return correct values for complete `attemptcmi`", () => {
    const attemptCmi = eval({
      id1: {
        core: {
          score: {
            raw: 4
          },
          lesson_status: scormLessonStatus.completed
        }
      },
      id2: {
        core: {
          score: {
            raw: 2
          },
          lesson_status: scormLessonStatus.failed
        }
      },
      id3: {
        core: {
          score: {
            raw: 8
          },
          lesson_status: scormLessonStatus.passed
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
      id1: {
        core: {
          lesson_status: scormLessonStatus.completed
        }
      },
      id2: {
        core: {
          lesson_status: scormLessonStatus.failed
        }
      },
      id3: {}
    });
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.objective)).toEqual(1);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.highest)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.average)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.sum)).toEqual(0);
  });

  it("should return 0 for all the `grademethod`, if there is no any lesson_status or score in `attemptcmi`", () => {
    const blankAttemptCmi = eval({
      id1: {
        core: {}
      },
      id2: {
        core: {}
      },
      id3: {}
    });
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.objective)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.highest)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.average)).toEqual(0);
    expect(getGradeForAttempt(blankAttemptCmi, 10, Grade.sum)).toEqual(0);
  });
});

describe("getAttemptsGrade", () => {
  it("return particular value for `attemptGrade` with non-empty `attemptsReport`", () => {
    const attemptsReport = [
      {
        attempt: 1,
        gradereported: 60
      },
      {
        attempt: 2,
        gradereported: 40
      },
      {
        attempt: 3,
        gradereported: 70
      },
      {
        attempt: 4,
        gradereported: 50
      }
    ];
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.highest, 10)).toEqual(
      70
    );
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.average, 10)).toEqual(
      60
    );
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.first, 10)).toEqual(
      60
    );
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.last, 10)).toEqual(50);
  });

  it("return 0 for all `attemptGrade` with empty attemptsReport", () => {
    const attemptsReport = [];
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.highest, 10)).toEqual(
      0
    );
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.average, 10)).toEqual(
      0
    );
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.first, 10)).toEqual(0);
    expect(getAttemptsGrade(attemptsReport, AttemptGrade.last, 10)).toEqual(0);
  });
});

describe("calculatedAttemptsGrade", () => {
  it("return grade with appending `%` for the `gradeMethod` [highest, average, sum] else it should return grade", () => {
    const attemptsOnlineReport = [
      {
        attempt: 1,
        gradereported: 60
      },
      {
        attempt: 2,
        gradereported: 40
      },
      {
        attempt: 3,
        gradereported: 60
      },
      {
        attempt: 4,
        gradereported: 50
      }
    ];
    const attemptsOfflineReport = [
      {
        attempt: 5,
        gradereported: 70
      },
      {
        attempt: 6,
        gradereported: 50
      }
    ];

    expect(
      calculatedAttemptsGrade(
        AttemptGrade.average,
        Grade.average,
        100,
        "40%",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("55%");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.average,
        Grade.highest,
        100,
        "60%",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("55%");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.average,
        Grade.sum,
        100,
        "40%",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("55%");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.average,
        Grade.objective,
        100,
        "60",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("55");

    expect(
      calculatedAttemptsGrade(
        AttemptGrade.highest,
        Grade.average,
        100,
        "40%",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("70%");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.highest,
        Grade.objective,
        100,
        "40%",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("70");

    expect(
      calculatedAttemptsGrade(
        AttemptGrade.first,
        Grade.highest,
        100,
        "60",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("60%");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.first,
        Grade.objective,
        100,
        "60",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("60");

    expect(
      calculatedAttemptsGrade(
        AttemptGrade.last,
        Grade.sum,
        100,
        "40%",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("50%");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.last,
        Grade.objective,
        100,
        "40",
        attemptsOnlineReport,
        attemptsOfflineReport
      )
    ).toEqual("50");

    expect(
      calculatedAttemptsGrade(
        AttemptGrade.average,
        Grade.objective,
        100,
        "60",
        undefined,
        undefined
      )
    ).toEqual("60");
    expect(
      calculatedAttemptsGrade(
        AttemptGrade.average,
        Grade.objective,
        100,
        "60",
        null,
        null
      )
    ).toEqual("60");
  });
});

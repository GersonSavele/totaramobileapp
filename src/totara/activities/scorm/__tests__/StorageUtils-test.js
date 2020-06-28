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
import { useApolloClient } from "@apollo/react-hooks";

import {
  saveScormActivityData,
  setCompletedScormAttempt,
  clearSyncedScormCommit,
  saveInTheCache,
  retrieveAllData,
  getOfflineLastActivityResult,
  getOfflineActivity,
  getOfflineScormCommits,
  getScormAttemptData
} from "../storageUtils";
import { Grade } from "@totara/types/Scorm";
import { scormLessonStatus } from "@totara/lib/constants";
import { scormActivitiesRecordsQuery } from "@totara/activities/scorm/api";

const commitData = (completeValue = scormLessonStatus.completed) => ({
  scormid: "18",
  attempt: "16",
  scoid: "item_1",
  commit: {
    timestarted: 1592950901,
    tracks: [
      {
        identifier: "item_1",
        element: "cmi.core.lesson_status",
        value: completeValue,
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
      lesson_status: completeValue,
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
});

describe("retrieveAllData", () => {
  it("should call `readQuery` and return non empty object for existing cache data and empty object for non existing cache.", () => {
    const existingDataMock = {
      scormBundles: {
        data: "mock_data"
      }
    };
    const client = useApolloClient();
    client.readQuery.mockImplementation(() => {
      return existingDataMock;
    });

    const result = retrieveAllData({ client });

    expect(client.readQuery).toBeCalled();
    expect(client.readQuery).not.toThrowError();
    expect(result).toMatchObject(existingDataMock.scormBundles);

    client.readQuery.mockImplementation(() => {
      throw new Error("no cache");
    });
    const nonExistingResult = retrieveAllData({ client });
    expect(client.readQuery).toBeCalled();
    expect(client.readQuery).toThrowError();
    expect(nonExistingResult).toMatchObject({});
  });
});

describe("saveInTheCache", () => {
  it("should call `writeQuery`for the cache data.", () => {
    const client = useApolloClient();
    const blankDataMock = {};
    saveInTheCache({ client, scormBundles: blankDataMock });
    expect(client.writeQuery).toBeCalledWith({
      query: scormActivitiesRecordsQuery,
      data: {
        scormBundles: blankDataMock
      }
    });
    const fullDataMock = {
      "1": {
        cmi: "data_cmi",
        commits: "data_commits",
        offlineActivity: { attemps: [{ attempt: 1, gradereported: 10 }] }
      },
      completed_attempts: {
        "1": [1]
      }
    };
    saveInTheCache({ client, scormBundles: fullDataMock });
    expect(client.writeQuery).toBeCalledWith({
      query: scormActivitiesRecordsQuery,
      data: {
        scormBundles: fullDataMock
      }
    });
    saveInTheCache({ client, scormBundles: undefined });
    expect(client.writeQuery).toBeCalledWith({
      query: scormActivitiesRecordsQuery,
      data: {
        scormBundles: undefined
      }
    });
  });
});

describe("saveScormActivityData", () => {
  it("should call `saveInTheCache` for `completed` attempt with new formatted data, if there is no any existing cache.", () => {
    const client = useApolloClient();

    const mockAttemptGrade = 10;
    const retrieveAllDataMock = jest.fn(() => ({}));
    const getGradeForAttemptMock = jest.fn(() => mockAttemptGrade);
    const saveInTheCacheMock = jest.fn();

    const { attempt, scoid, cmi, commit } = commitData();

    const expectedResult = {
      "18": {
        cmi: {
          [attempt]: {
            [scoid]: cmi
          }
        },
        commits: {
          [attempt]: {
            [scoid]: commit
          }
        },
        offlineActivity: {
          attempts: [
            {
              attempt,
              gradereported: mockAttemptGrade
            }
          ]
        }
      }
    };
    saveScormActivityData({
      data: commitData(),
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
  it("should call `saveInTheCache` with updated existing cache for `completed` attempt.", () => {
    const client = useApolloClient();

    const { scormid, attempt, scoid, cmi, commit } = commitData();

    const retrieveDataResultMock = {
      "18": {
        cmi: {
          [attempt]: {
            [scoid]: cmi
          }
        },
        commits: {
          [attempt]: {
            [scoid]: commit
          }
        },
        offlineActivity: {
          attempts: [
            {
              attempt: 9,
              gradereported: "0"
            }
          ]
        }
      }
    };
    const mockAttemptGrade = 10;
    const retrieveAllDataMock = jest.fn(() => retrieveDataResultMock);
    const getGradeForAttemptMock = jest.fn(() => mockAttemptGrade);
    const saveInTheCacheMock = jest.fn();
    const newAttempts = retrieveDataResultMock[
      scormid
    ].offlineActivity.attempts.concat({
      attempt,
      gradereported: mockAttemptGrade
    });
    const expectedResult = {
      "18": {
        cmi: {
          [attempt]: {
            [scoid]: cmi
          }
        },
        commits: {
          [attempt]: {
            [scoid]: commit
          }
        },
        offlineActivity: {
          attempts: newAttempts
        }
      }
    };
    saveScormActivityData({
      data: commitData(),
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
  it("should NOT proceed saving, if it is incomplete attempt.", () => {
    const client = useApolloClient();

    const mockAttemptGrade = 10;
    const retrieveAllDataMock = jest.fn(() => ({}));
    const getGradeForAttemptMock = jest.fn(() => mockAttemptGrade);
    const saveInTheCacheMock = jest.fn();

    saveScormActivityData({
      data: commitData(scormLessonStatus.incomplete),
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

describe("setCompletedScormAttempt", () => {
  it("should call `saveInTheCache` with adding attempt to the `completed_attempts`, if there is no any cache for it.", () => {
    const client = useApolloClient();
    const retrieveAllDataMock = jest.fn(() => ({}));
    const saveInTheCacheMock = jest.fn();
    const attempt = 3;
    const scormId = "10";
    const saveResultDataMock = {
      completed_attempts: {
        [scormId]: [attempt]
      }
    };
    setCompletedScormAttempt({
      scormId,
      attempt,
      client,
      onRetrieveAllData: retrieveAllDataMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(saveInTheCacheMock).toBeCalledWith({
      client,
      scormBundles: saveResultDataMock
    });
  });
  it("should call `saveInTheCache` for non existing attempt in the `completed_attempt` with adding it of the existing cache.", () => {
    const client = useApolloClient();
    const existingCompletedAttempts = [1, 2];
    const retrieveAllDataMock = jest.fn(() => ({
      completed_attempts: {
        [scormId]: existingCompletedAttempts
      }
    }));
    const saveInTheCacheMock = jest.fn();
    const attempt = 3;
    const scormId = "10";
    const saveResultDataMock = {
      completed_attempts: {
        [scormId]: existingCompletedAttempts.concat(attempt)
      }
    };
    setCompletedScormAttempt({
      scormId,
      attempt,
      client,
      onRetrieveAllData: retrieveAllDataMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(saveInTheCacheMock).toBeCalledWith({
      client,
      scormBundles: saveResultDataMock
    });
  });
  it("should NOT call `saveInTheCache`, if attempt number already exist in the `completed_attempts` list of the cache.", () => {
    const client = useApolloClient();
    const existingCompletedAttempts = [1, 2, 3];
    const retrieveAllDataMock = jest.fn(() => ({
      completed_attempts: {
        [scormId]: existingCompletedAttempts
      }
    }));
    const saveInTheCacheMock = jest.fn();
    const attempt = 3;
    const scormId = "10";
    setCompletedScormAttempt({
      scormId,
      attempt,
      client,
      onRetrieveAllData: retrieveAllDataMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(saveInTheCacheMock).not.toBeCalled();
  });
});

describe("getOfflineLastActivityResult", () => {
  it("should return last attempt result of the offlineAttempts if exist.", () => {
    const scormId = 10;
    const existingAttempts = [
      { attempt: 1, gradereported: 10 },
      { attempt: 2, gradereported: 20 },
      { attempt: 3, gradereported: 30 },
      { attempt: 4, gradereported: 40 }
    ];
    const existingDataMock = {
      [scormId]: {
        offlineActivity: {
          attempts: existingAttempts
        }
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getOfflineLastActivityResult({
      client,
      scormId,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toMatchObject({ attempt: 4, gradereported: 40 });
  });
  it("should return undefined, if rhere is no any offline attempts.", () => {
    const scormId = 10;

    const existingDataMock = {
      [scormId]: {
        offlineActivity: {}
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getOfflineLastActivityResult({
      client,
      scormId,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toBeUndefined();
  });
});

describe("getOfflineActivity", () => {
  it("should return offline activities if exist.", () => {
    const scormId = 10;
    const existingAttempts = [
      { attempt: 1, gradereported: 10 },
      { attempt: 2, gradereported: 20 },
      { attempt: 3, gradereported: 30 },
      { attempt: 4, gradereported: 40 }
    ];
    const existingDataMock = {
      [scormId]: {
        offlineActivity: {
          attempts: existingAttempts
        }
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getOfflineActivity({
      client,
      scormId,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toMatchObject(existingDataMock[scormId].offlineActivity);
  });
  it("should return undefined, if rhere is no any offline activities.", () => {
    const scormId = 10;

    const existingDataMock = {
      [scormId]: {
        offlineActivity: {}
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getOfflineActivity({
      client,
      scormId,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toBeUndefined();
  });
});

describe("getOfflineScormCommits", () => {
  it("should return completed attemps commits for all scormIds if exist.", () => {
    const existingDataMock = {
      10: {
        commits: {
          1: {
            scoId1: { data: "data for attemppt 1 sco 1" },
            scoId2: { data: "data for attemppt 1 sco 2" }
          },

          2: {
            scoId1: { data: "data for attemppt 2 sco 1" },
            scoId2: { data: "data for attemppt 2 sco 2" }
          }
        }
      },
      11: {
        commits: {
          1: {
            scoId1: { data: "data for attemppt 1 sco 1" },
            scoId2: { data: "data for attemppt 1 sco 2" }
          },

          2: {
            scoId1: { data: "data for attemppt 2 sco 1" },
            scoId2: { data: "data for attemppt 2 sco 2" }
          }
        }
      },
      completed_attempts: {
        10: [1, 2],
        11: [2]
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getOfflineScormCommits({
      client,
      onRetrieveAllData: retrieveAllDataMock
    });
    const expectedData = [
      {
        scormId: "10",
        attempt: 1,
        tracks: [
          { data: "data for attemppt 1 sco 1" },
          { data: "data for attemppt 1 sco 2" }
        ]
      },
      {
        scormId: "10",
        attempt: 2,
        tracks: [
          { data: "data for attemppt 2 sco 1" },
          { data: "data for attemppt 2 sco 2" }
        ]
      },
      {
        scormId: "11",
        attempt: 2,
        tracks: [
          { data: "data for attemppt 2 sco 1" },
          { data: "data for attemppt 2 sco 2" }
        ]
      }
    ];

    expect(result).toMatchObject(expectedData);
  });
  it("should NOT return any data if there is no any completed attemps.", () => {
    const scormId = "10";
    const existingDataMock = {
      [scormId]: {
        commits: {
          1: {
            scoId1: { data: "data for attemppt 1 sco 1" },
            scoId2: { data: "data for attemppt 1 sco 2" }
          },

          2: {
            scoId1: { data: "data for attemppt 2 sco 1" },
            scoId2: { data: "data for attemppt 2 sco 2" }
          }
        }
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getOfflineScormCommits({
      client,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toBeUndefined();
  });
});
describe("clearSyncedScormCommit", () => {
  it("should remove all cached data for scormId and attempt, then trigger `saveInTheCache` with updated data.", () => {
    const client = useApolloClient();
    const attempt = 3;
    const nextAttempt = attempt + 1;
    const scormId = "10";
    const existingScormBundles = {
      [scormId]: {
        commits: {
          [attempt]: { data: "commit_mock" },
          [nextAttempt]: { data: "commit_mock" }
        },
        cmi: {
          [attempt]: { data: "cmi_mock" },
          [nextAttempt]: { data: "commit_mock" }
        },
        offlineActivity: {
          attempts: [{ attempt: attempt }, { attempt: nextAttempt }]
        }
      },
      completed_attempts: {
        [scormId]: [attempt, nextAttempt]
      }
    };
    const expectingScormBundles = {
      [scormId]: {
        commits: {
          [nextAttempt]: existingScormBundles[scormId].commits[nextAttempt]
        },
        cmi: {
          [nextAttempt]: existingScormBundles[scormId].cmi[nextAttempt]
        },
        offlineActivity: {
          attempts: [{ attempt: nextAttempt }]
        }
      },
      completed_attempts: {
        [scormId]: [nextAttempt]
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingScormBundles);
    const saveInTheCacheMock = jest.fn();
    clearSyncedScormCommit({
      client,
      scormId,
      attempt,
      onRetrieveAllData: retrieveAllDataMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(saveInTheCacheMock).toBeCalledWith({
      client,
      scormBundles: expectingScormBundles
    });
  });
  it("should NOT remove any data if attempt is mismatch, then trigger `saveInTheCache` with updated data.", () => {
    const client = useApolloClient();
    const attempt = 3;
    const nextAttempt = attempt + 1;
    const scormId = "10";
    const existingScormBundles = {
      [scormId]: {
        commits: {
          [nextAttempt]: { data: "commit_mock" },
          [nextAttempt + 1]: { data: "commit_mock" }
        },
        cmi: {
          [nextAttempt]: { data: "cmi_mock" },
          [nextAttempt + 1]: { data: "commit_mock" }
        },
        offlineActivity: {
          attempts: [{ attempt: nextAttempt }, { attempt: nextAttempt + 1 }]
        }
      },
      completed_attempts: {
        [scormId]: [nextAttempt, nextAttempt + 1]
      }
    };

    const retrieveAllDataMock = jest.fn(() => existingScormBundles);
    const saveInTheCacheMock = jest.fn();
    clearSyncedScormCommit({
      client,
      scormId,
      attempt,
      onRetrieveAllData: retrieveAllDataMock,
      onSaveInTheCache: saveInTheCacheMock
    });
    expect(saveInTheCacheMock).toBeCalledWith({
      client,
      scormBundles: existingScormBundles
    });
  });
});

describe("getScormAttemptData", () => {
  it("should return cmi data for scormId and attempt, if records exist.", () => {
    const scormId = 10;
    const attempt = 2;
    const existingCmis = {
      [attempt - 1]: {
        data: `mock_data_${attempt - 1}`
      },
      [attempt]: {
        data: "mock_data"
      },
      [attempt + 1]: {
        data: `mock_data_${attempt + 1}`
      }
    };
    const existingDataMock = {
      [scormId]: {
        cmi: existingCmis
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getScormAttemptData({
      client,
      scormId,
      attempt,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toMatchObject(existingDataMock[scormId].cmi[attempt]);
  });
  it("should return undefined, if rhere is no any offline attempts for the scormId.", () => {
    const scormId = 10;
    const attempt = 2;

    const existingDataMock = {
      [scormId]: {
        offlineActivity: {},
        cmi: {}
      }
    };
    const retrieveAllDataMock = jest.fn(() => existingDataMock);
    const client = useApolloClient();
    const result = getScormAttemptData({
      client,
      scormId,
      attempt,
      onRetrieveAllData: retrieveAllDataMock
    });
    expect(result).toBeUndefined();
  });
});

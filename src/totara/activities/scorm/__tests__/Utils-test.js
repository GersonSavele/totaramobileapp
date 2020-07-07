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
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import moment from "moment";
import {
  getDataForScormSummary,
  calculatedAttemptsGrade,
  getAttemptsGrade,
  getGradeForAttempt,
  getScormPlayerInitialData,
  setupOfflineScormPlayer
} from "../utils";
import { AttemptGrade, Grade } from "@totara/types/Scorm";
import { scormLessonStatus } from "@totara/lib/constants";

const defaultData = {
  name: "Creating a dynamic audience",
  description: "Title",
  calculatedGrade: "10%",
  attempts: [
    {
      attempt: 1,
      timestarted: null,
      gradereported: 0
    }
  ],
  launchUrl: "https://path.to.launch.url",
  repeatUrl: "https://path.to.repeat.url",
  offlinePackageScoIdentifiers: ["Software_Simulation_SCO"]
};

//this fields are from API response
const scormBundle = eval({
  scorm: {
    id: "8",
    courseid: "30",
    grademethod: Grade.highest,
    scormtype: "local",
    reference: "Creating a dynamic audience.zip",
    intro: "",
    version: "SCORM_1.2",
    maxgrade: 100,
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
    packageUrl: "https://path.to.package.url",
    attemptsCurrent: 1,
    offlinePackageUrl: "https://path.to.package.url",
    offlinePackageContentHash: "e99447a9fa5447cdcfffb2bdefdefbc15bdd0821",
    attemptsMax: null,
    attemptsForceNew: false,
    attemptsLockFinal: false,
    autoContinue: false,
    offlineAttemptsAllowed: true,
    ...defaultData
  },
  lastsynced: 1588040660
});

describe("getDataForScormSummary", () => {
  const expectedDataForUndefined = {
    totalAttempt: 0,
    shouldAllowLastAttempt: false,
    shouldAllowNewAttempt: false
  };
  it("return correct object for valid `scormBundle` and default values for undefined on offline mode.", () => {
    expect(getDataForScormSummary(true, undefined)).toEqual(
      expectedDataForUndefined
    );

    const expectResultScormBundleOffline = {
      ...defaultData,
      totalAttempt: 1,
      shouldAllowLastAttempt: false,
      gradeMethod: Grade.highest,
      attemptGrade: AttemptGrade.highest,
      lastsynced: moment.unix(scormBundle.lastsynced),
      shouldAllowNewAttempt: true
    };
    expect(getDataForScormSummary(true, scormBundle)).toEqual(
      expectResultScormBundleOffline
    );
  });

  it("return correct object for valid `scormBundle` for online mode", () => {
    expect(getDataForScormSummary(false, undefined)).toEqual(
      expectedDataForUndefined
    );

    const expectResultScormBundleOnline = {
      ...defaultData,
      totalAttempt: 1,
      shouldAllowLastAttempt: true,
      gradeMethod: Grade.highest,
      attemptGrade: AttemptGrade.highest,
      lastsynced: moment.unix(scormBundle.lastsynced),
      shouldAllowNewAttempt: true
    };
    expect(getDataForScormSummary(false, scormBundle)).toEqual(
      expectResultScormBundleOnline
    );
  });
});

describe("getAttemptsGrade", () => {
  it("return particular value for `attemptGrade` with non-empty `attemptsReport`.", () => {
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
describe("getGradeForAttempt", () => {
  it("return correct values for complete `attemptcmi`.", () => {
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
    expect(
      getGradeForAttempt({
        attemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.objective
      })
    ).toEqual(2);
    expect(
      getGradeForAttempt({
        attemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.highest
      })
    ).toEqual(80);
    expect(
      getGradeForAttempt({
        attemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.average
      })
    ).toEqual(47);
    expect(
      getGradeForAttempt({
        attemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.sum
      })
    ).toEqual(140);
  });

  it("should return correct for `grademethod` [objective] and 0 for [highest/average/sum], if `attemptcmi` has only lesson_status and no score.", () => {
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
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.objective
      })
    ).toEqual(1);
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.highest
      })
    ).toEqual(0);
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.average
      })
    ).toEqual(0);
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.sum
      })
    ).toEqual(0);
  });

  it("should return 0 for all the `grademethod`, if there is no any lesson_status or score in `attemptcmi`.", () => {
    const blankAttemptCmi = eval({
      id1: {
        core: {}
      },
      id2: {
        core: {}
      },
      id3: {}
    });
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.objective
      })
    ).toEqual(0);
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.highest
      })
    ).toEqual(0);
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.average
      })
    ).toEqual(0);
    expect(
      getGradeForAttempt({
        attemptCmi: blankAttemptCmi,
        maxGrade: 10,
        gradeMethod: Grade.sum
      })
    ).toEqual(0);
  });
});
describe("calculatedAttemptsGrade", () => {
  it("return grade with appending `%` for the `gradeMethod` [highest, average, sum] else it should return grade.", () => {
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

describe("getScormPlayerInitialData", () => {
  it("should return initialize data for scomr player", () => {
    const scormId = "1";
    const attempt = 1;
    const scoId = "sco-1";
    const scos = [
      { id: "sco-1", organizationId: "org-1", launchSrc: "sco-1/index.html" },
      { id: "sco-2", organizationId: "org-1", launchSrc: "sco-2/index.html" }
    ];
    const packageLocation = "path/packagName";
    const playerInitalData = {
      defaults: {
        "sco-1": "initial default data 1",
        "sco-2": "initial default data 2"
      },
      objectives: {
        "sco-1": "initial objective data 1",
        "sco-2": "initial objective data 2"
      },
      interactions: {
        "sco-1": "initial interaction data 1",
        "sco-2": "initial interaction data 2"
      }
    };
    const result = getScormPlayerInitialData({
      scormId,
      scos,
      scoId,
      attempt,
      packageLocation,
      playerInitalData
    });

    expect(result.entrysrc).toBe(packageLocation + "/sco-1/index.html");
    expect(result.def).toMatchObject(playerInitalData.defaults);
    expect(result.obj).toMatchObject(playerInitalData.objectives);
    expect(result.int).toMatchObject(playerInitalData.interactions);
    expect(result.scormdebugging).toBeFalsy();
    expect(result.scormauto).toBe(0);
    expect(result.scormid).toBe(scormId);
    expect(result.scoid).toBe(scoId);
    expect(result.attempt).toBe(attempt);
    expect(result.autocommit).toBeFalsy();
    expect(result.masteryoverride).toBeTruthy();
    expect(result.hidetoc).toBe(1);
  });
});

describe("setupOfflineScormPlayer", () => {
  it("should set up the offline scorm player and return the root path", () => {
    //TODO: retest this
    const initializedMock = jest.fn(() => {
      return Promise.resolve(true);
    });
    setupOfflineScormPlayer(initializedMock).then((result) => {
      expect(result).toBeTruthy();
    });
  });
});

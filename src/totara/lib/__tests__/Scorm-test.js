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

import { getDataForScormSummary } from "../scorm";
import { translate } from "@totara/locale";
import { DATE_FORMAT } from "@totara/lib/constants";

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
        grademethod: "1",
        whatgrade: "0",
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
            gradereported: 0,
          },
        ],
        description: "Title",
        attemptsMax: null,
        attemptsForceNew: false,
        attemptsLockFinal: false,
        autoContinue: false,
        offlineAttemptsAllowed: true,
      },
      lastsynced: 1588040660,
    });
    const expectResultDefault = {
      description: undefined,
      totalAttempt: 0,
      attemptGrade: undefined,
      calculatedGrade: undefined,
      actionPrimary: undefined,
      actionSecondary: undefined,
      shouldShowAction: false,
      lastsyncText: undefined,
      completedAttemptsText: undefined,
      upcommingActivityText: undefined,
      maxAttempts: undefined,
    };
    expect(getDataForScormSummary(true, undefined)).toEqual(
      expectResultDefault
    );

    const expectResultScormBundleOnline = {
      description: scormBundle.scorm.description,
      totalAttempt: scormBundle.scorm.attemptsCurrent,
      attemptGrade: translate(
        `scorm.grading_method.${scormBundle.scorm.whatgrade}`
      ),
      calculatedGrade: scormBundle.scorm.calculatedGrade,
      actionPrimary: { title: translate("scorm.summary.new_attempt") },
      actionSecondary: undefined,
      shouldShowAction: true,
      lastsyncText: undefined,
      completedAttemptsText: undefined,
      upcommingActivityText: undefined,
      maxAttempts: translate("scorm.summary.attempt.unlimited"),
    };
    expect(getDataForScormSummary(true, scormBundle)).toEqual(
      expectResultScormBundleOnline
    );

    const expectResultScormBundleOffline = {
      description: scormBundle.scorm.description,
      totalAttempt: scormBundle.scorm.attemptsCurrent,
      attemptGrade: translate(
        `scorm.grading_method.${scormBundle.scorm.whatgrade}`
      ),
      calculatedGrade: scormBundle.scorm.calculatedGrade,
      actionPrimary: undefined,
      actionSecondary: undefined,
      shouldShowAction: false,
      lastsyncText: `${translate("scorm.last_synced")}: ${moment
        .unix(scormBundle.lastsynced)
        .toNow(true)} ${translate("scorm.ago")} (${moment
        .unix(scormBundle.lastsynced)
        .format(DATE_FORMAT)})`,
      completedAttemptsText: undefined,
      upcommingActivityText: undefined,
      maxAttempts: translate("scorm.summary.attempt.unlimited"),
    };
    expect(getDataForScormSummary(false, scormBundle)).toEqual(
      expectResultScormBundleOffline
    );
  });
});

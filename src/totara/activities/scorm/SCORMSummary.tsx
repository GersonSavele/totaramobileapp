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

import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import * as RNFS from "react-native-fs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Activity } from "@totara/types";
import { AuthContext } from "@totara/core";
import { ScormBundle } from "@totara/types/Scorm";
import {
  MoreText,
  PrimaryButton,
  SecondaryButton,
  NotificationView,
} from "@totara/components";
import { gutter, ThemeContext } from "@totara/theme";
import {
  OfflineScormServerRoot,
  getOfflineScormBundle,
  syncOfflineScormBundle,
  getOfflineScormPackageName,
  removeScormPackageData,
} from "./offline";
import { Log } from "@totara/lib";
import ResourceManager, {
  ResourceObserver,
} from "@totara/core/ResourceManager/ResourceManager";
import {
  IResource,
  ResourceState,
} from "@totara/core/ResourceManager/Resource";
import { translate } from "@totara/locale";
import { SCORMActivityType } from "./SCORMActivity";
import SCORMAttempts from "./SCORMAttempts";
import { AppliedTheme } from "@totara/theme/Theme";
import { ActivitySheetContext } from "../ActivitySheet";
import { getDataForScormSummary, onTapDownloadResource } from "@totara/lib/scorm";
import { scormSummaryStyles } from "@totara/theme/scorm";

type SummaryProps = {
  activity: Activity;
  data?: ScormBundle;
  isUserOnline: boolean;
  setActionWithData: (
    action: SCORMActivityType,
    bundle: ScormBundle,
    data: any
  ) => void;
};

enum Section {
  None,
  Attempts,
}

const gridStyle = (theme: AppliedTheme) => [
  theme.textB1,
  { color: theme.textColorSubdued },
];

type GridLabelProps = {
  theme: AppliedTheme;
  textId: string;
  value: string;
  children?: Element;
};

const GridLabelValue = ({ theme, textId, value, children }: GridLabelProps) => (
  <View style={scormSummaryStyles.sectionField}>
    <Text style={theme.textB1}>{translate(textId)}</Text>
    <View style={{ flexDirection: "row" }}>
      <Text style={gridStyle(theme)}>{value}</Text>
      {children}
    </View>
  </View>
);

type GridTitleProps = {
  theme: AppliedTheme;
  textId: string;
  style?: TextStyle;
};
const GridTitle = ({ theme, textId, style }: GridTitleProps) => (
  <Text style={[theme.textH2, scormSummaryStyles.sectionBreak, style]}>
    {translate(textId)}
  </Text>
);

const SCORMSummary = ({
  activity,
  data,
  isUserOnline,
  setActionWithData,
}: SummaryProps) => {
  const [scormBundle, setScormBundle] = useState<ScormBundle | undefined>(data);
  const {
    authContextState: { appState },
  } = useContext(AuthContext);
  const activitySheet = useContext(ActivitySheetContext);
  const [section, setSection] = useState(Section.None);
  const [theme] = useContext(ThemeContext);
  const [downloadManager] = useState<ResourceManager>(
    ResourceManager.getInstance()
  );

  const {
    description,
    totalAttempt,
    attemptGrade,
    calculatedGrade,
    actionPrimary,
    actionSecondary,
    shouldShowAction,
    lastsyncText,
    completedAttemptsText,
    upcommingActivityText,
    maxAttempts,
  } = getDataForScormSummary(isUserOnline, scormBundle);

  const onTapDeleteResource = () => {
    const _scormId = scormBundle!.scorm.id;
    downloadManager.delete(_scormId.toString());
  };

  const setResource = (resource?: IResource) => {
    let onResourceTap: (() => void) | undefined = 
      onTapDownloadResource({
        callback: syncOfflineScormBundle,
        downloadManager,
        scormBundle,
        apiKey: appState?.apiKey,
      });
    if (resource) {
      switch (resource.state) {
        case ResourceState.Downloading:
          onResourceTap = undefined;
          break;
        case ResourceState.Completed:
          onResourceTap = onTapDeleteResource;
          break;
      }
    }
    activitySheet.setActivityResource({
      data: resource,
      action: onResourceTap,
    });
  };

  const onDownloadFileUpdated: ResourceObserver = (resourceFile) => {
    const resoureId = resourceFile.id;
    if (
      scormBundle &&
      scormBundle.scorm &&
      scormBundle.scorm.id === resoureId
    ) {
      switch (resourceFile.state) {
        case ResourceState.Completed: {
          const offlineSCORMPackageName = getOfflineScormPackageName(resoureId);
          const _unzipPath = `${OfflineScormServerRoot}/${offlineSCORMPackageName}`;
          if (resourceFile.unzipPath === _unzipPath) {
            const _offlineScormData = {
              scorm: scormBundle.scorm,
              scormPackage: {
                path: offlineSCORMPackageName,
              },
              lastsynced: scormBundle.lastsynced,
            } as ScormBundle;

            syncOfflineScormBundle(resoureId, _offlineScormData).then(() => {
              setResource(resourceFile);
            });
          }
          break;
        }
        case ResourceState.Deleted: {
          removeScormPackageData(resoureId).then(() => {
            setResource(undefined);
          });
          break;
        }
        case ResourceState.Downloading: {
          setResource(resourceFile);
          break;
        }
      }
    }
  };

  const onTapNewAttempt = () => {
    if (scormBundle && scormBundle.scorm) {
      if (!isUserOnline) {
        let newAttempt =
          scormBundle.scorm && scormBundle.scorm.attemptsCurrent
            ? scormBundle.scorm.attemptsCurrent
            : 0;
        if (
          scormBundle.offlineActivity &&
          scormBundle.offlineActivity.attempts
        ) {
          newAttempt = newAttempt + scormBundle.offlineActivity.attempts.length;
        }
        newAttempt = newAttempt + 1;
        setActionWithData(SCORMActivityType.Offline, scormBundle, {
          attempt: newAttempt,
        });
      } else {
        if (scormBundle.scorm && scormBundle.scorm.launchUrl) {
          setActionWithData(SCORMActivityType.Online, scormBundle, {
            url: scormBundle.scorm.launchUrl,
          });
        } else {
          Log.debug("Launch url cannot find. ", scormBundle.scorm.launchUrl);
        }
      }
    } else {
      Log.debug("Scorm data could not found", scormBundle);
    }
  };

  const onTapViewAllAttempts = () => {
    if (
      scormBundle &&
      scormBundle.scorm &&
      (scormBundle.scorm.attempts ||
        (scormBundle.offlineActivity && scormBundle.offlineActivity.attempts))
    ) {
      setSection(Section.Attempts);
    } else {
      Log.debug("Scorm data could not found", scormBundle);
    }
  };

  const onTapContinueLastAttempt = () => {
    if (isUserOnline) {
      if (scormBundle) {
        if (scormBundle.scorm && scormBundle.scorm.repeatUrl) {
          setActionWithData(SCORMActivityType.Online, scormBundle, {
            url: scormBundle.scorm.repeatUrl,
          });
        } else {
          Log.debug("Repeat url cannot find. ", scormBundle.scorm.repeatUrl);
        }
      } else {
        Log.debug("Scorm data could not found", scormBundle);
      }
    }
  };

  useEffect(() => {
    if (!isUserOnline) {
      getOfflineScormBundle(activity.instanceid).then((result) => {
        if (result) {
          const storedBundle = result! as ScormBundle;
          let newBundle: ScormBundle = storedBundle;
          if (
            scormBundle &&
            scormBundle.lastsynced &&
            scormBundle.lastsynced >= storedBundle.lastsynced
          ) {
            newBundle.scorm = scormBundle.scorm;
            newBundle.lastsynced = scormBundle.lastsynced;
            syncOfflineScormBundle(activity.instanceid, {
              scorm: newBundle.scorm,
              lastsynced: newBundle.lastsynced,
            }).then(() => {
              setScormBundle(newBundle);
            });
          } else {
            setScormBundle(newBundle);
          }
        }
      });
    } else {
      setScormBundle(data);
      if (data && data.scorm && data.lastsynced) {
        syncOfflineScormBundle(activity.instanceid, {
          scorm: data.scorm,
          lastsynced: data.lastsynced,
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (
      !scormBundle ||
      !scormBundle.scorm ||
      !isUserOnline ||
      !shouldShowAction
    ) {
      return;
    }

    downloadManager.attach(onDownloadFileUpdated);

    const filter = downloadManager.snapshot.filter(
      (x) => x.id === scormBundle.scorm.id.toString()
    );
    if (filter.length > 0) {
      const existingResource = filter[0];
      setResource(existingResource);
    } else {
      setResource(undefined);
    }

    return () => {
      downloadManager.detach(onDownloadFileUpdated);
    };
  }, [scormBundle && scormBundle.scorm, downloadManager]);

  return (
    <>
      <View style={scormSummaryStyles.expanded}>
        {shouldShowAction && lastsyncText && (
          <NotificationView mode={"info"} text={lastsyncText} icon={"bolt"} />
        )}
        {completedAttemptsText && (
          <NotificationView
            mode={"alert"}
            text={completedAttemptsText}
            icon={"exclamation-circle"}
          />
        )}
        {upcommingActivityText && (
          <NotificationView
            mode={"alert"}
            text={upcommingActivityText}
            icon={"exclamation-circle"}
          />
        )}
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ padding: gutter }}>
              {description && (
                <>
                  <GridTitle
                    textId={"scorm.summary.summary"}
                    theme={theme}
                    style={{ paddingTop: 0 }}
                  />
                  <MoreText longText={description} />
                </>
              )}
              <GridTitle textId={"scorm.summary.grade.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.grade.method"}
                value={attemptGrade}
              />
              <TouchableOpacity onPress={onTapViewAllAttempts}>
                <GridLabelValue
                  theme={theme}
                  textId={"scorm.summary.grade.reported"}
                  value={calculatedGrade}
                >
                  <FontAwesomeIcon
                    icon="chevron-right"
                    size={theme.textB1.fontSize}
                    style={{ alignSelf: "center", marginLeft: 8 }}
                    color={theme.textColorSubdued}
                  />
                </GridLabelValue>
              </TouchableOpacity>
              <GridTitle textId={"scorm.summary.attempt.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.attempt.total_attempts"}
                value={maxAttempts}
              />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.attempt.completed_attempts"}
                value={totalAttempt}
              />
            </View>
          </ScrollView>
        </View>
        {shouldShowAction && (
          <AttemptController
            primary={
              actionPrimary && {
                ...actionPrimary,
                ...{ action: onTapNewAttempt },
              }
            }
            secondary={
              actionSecondary && {
                ...actionSecondary,
                ...{ action: onTapContinueLastAttempt },
              }
            }
          />
        )}
        <SafeAreaView />
      </View>
      {scormBundle && (
        <Modal visible={section === Section.Attempts}>
          <SCORMAttempts
            scormBundle={scormBundle}
            onExit={() => setSection(Section.None)}
          />
        </Modal>
      )}
    </>
  );
};

type PropsAttempt = {
  primary: PropsInfo | undefined;
  secondary: PropsInfo | undefined;
};

type PropsInfo = {
  title: string;
  action: () => void;
};

const AttemptController = ({ primary, secondary }: PropsAttempt) => {
  return (
    <View style={scormSummaryStyles.attemptContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {secondary && (
          <SecondaryButton
            text={secondary.title}
            onPress={secondary.action}
            style={{ flex: 1, marginRight: primary ? 16 : 0 }}
          />
        )}
        {primary && (
          <PrimaryButton
            text={primary.title}
            onPress={primary.action}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
};

export default SCORMSummary;

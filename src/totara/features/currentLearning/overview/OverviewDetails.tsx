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

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Text, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import { isEmpty } from "lodash";
import { courseSelfComplete } from "../course/api";
import { AddBadge, Loading, GeneralErrorModal, CircleIcon } from "@totara/components";
import { translate } from "@totara/locale";
import { DescriptionFormat } from "@totara/types/LearningItem";
import CourseCompletionModal from "../CourseCompletionModal";
import { Criteria } from "@totara/types";
import SelfCompletion from "./SelfCompletion";
import { courseCriteria } from "@totara/features/constants";
import { overviewStyles } from "./overviewStyles";
import { iconSizes } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import listViewStyles from "@totara/theme/listView";
import { activeOpacity } from "@totara/lib/styles/base";
import { CL_TEST_IDS } from "@totara/lib/testIds";
import { DescriptionContent } from "@totara/components/DescriptionContent";

type OverviewProps = {
  id: number;
  criteria?: [Criteria];
  summary?: string;
  summaryFormat?: DescriptionFormat;
  gradeFinal?: number;
  progress?: number;
  isCourseSet: boolean;
  showGrades?: boolean;
  completionEnabled?: boolean;
  summaryTypeTitle?: string;
  onclickContinueLearning?: () => void;
  courseRefreshCallback?: () => {};
  showCriteriaList: (any) => void;
};

const OverviewDetails = ({
  id,
  criteria,
  summary,
  summaryFormat,
  gradeFinal = 0,
  progress = 0,
  summaryTypeTitle,
  onclickContinueLearning,
  courseRefreshCallback,
  isCourseSet,
  showGrades,
  completionEnabled = true,
  showCriteriaList
}: OverviewProps) => {
  const isSelfCompletion =
    completionEnabled &&
    criteria &&
    criteria?.some(value => {
      return value["type"] === courseCriteria.selfComplete;
    });

  const showTabs = isSelfCompletion || completionEnabled || showGrades;
  return (
    <View>
      {showTabs && (
        <View>
          <ScrollView
            style={{ flexGrow: 1 }}
            horizontal={true}
            contentContainerStyle={overviewStyles.scrollViewContainer}
            showsHorizontalScrollIndicator={false}>
            {completionEnabled && (
              <Progress
                progress={progress}
                isCourseSet={isCourseSet}
                showCriteriaList={() => {
                  //show progress details only if there's a criteria
                  if (criteria && criteria !== null && criteria.length > 0) {
                    showCriteriaList(criteria);
                  } else {
                    showCriteriaList([]);
                  }
                }}
              />
            )}
            {showGrades && <Grade gradeFinal={gradeFinal} />}
            {isSelfCompletion && (
              <Complete
                id={id}
                criteria={criteria!}
                onclickContinueLearning={onclickContinueLearning}
                courseRefreshCallback={courseRefreshCallback}
              />
            )}
          </ScrollView>
          <View style={listViewStyles.thinSeparator} />
        </View>
      )}
      <View style={{ flex: 4 }}>
        <Summary summary={summary} summaryTypeTitle={summaryTypeTitle} summaryFormat={summaryFormat} />
      </View>
    </View>
  );
};

const Grade = ({ gradeFinal }: { gradeFinal: number }) => {
  return (
    <TouchableOpacity style={overviewStyles.container} activeOpacity={1.0} onPress={() => {}}>
      <View style={overviewStyles.contentWrap}>
        <View style={overviewStyles.innerViewWrap}>
          <View style={{ flexDirection: "row" }}>
            <Text style={overviewStyles.gradePrefixText}>{`${gradeFinal}`.length > 0 ? gradeFinal : 0}</Text>
          </View>
        </View>
        <View style={overviewStyles.horizontalSeparator} />
        <View style={overviewStyles.carouselTextContainer}>
          <Text numberOfLines={1} style={overviewStyles.labelWrap}>
            {translate("course.grade.title")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type ProgressProps = {
  progress: number;
  isCourseSet: boolean;
  showCriteriaList: () => void;
};

const Progress = ({ progress, isCourseSet, showCriteriaList = () => null }: ProgressProps) => {
  return (
    <TouchableOpacity
      style={overviewStyles.container}
      activeOpacity={activeOpacity}
      disabled={isCourseSet}
      testID={CL_TEST_IDS.PROGRESS}
      onPress={showCriteriaList}>
      <View style={overviewStyles.contentWrap}>
        <View style={overviewStyles.innerViewWrap}>
          <ProgressCircle value={progress} />
        </View>
        <View style={overviewStyles.horizontalSeparator} />
        <View style={overviewStyles.carouselTextContainer}>
          <Text numberOfLines={1} style={overviewStyles.labelWrap}>
            {translate("course.progress.title")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type CompletionProps = {
  id: number;
  criteria: [Criteria];
  onclickContinueLearning?: () => void;
  courseRefreshCallback?: () => {};
};

const Complete = ({ id, criteria, onclickContinueLearning = () => {}, courseRefreshCallback }: CompletionProps) => {
  const isSelfCompleted = criteria?.some(value => {
    if (value["type"] === courseCriteria.selfComplete) {
      return value["complete"] === true;
    }
  });

  const isCourseCompleted = criteria?.every(value => {
    return value["complete"] === true;
  });

  const refetchCourseQueries = () => {
    courseRefreshCallback!();
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  let [selfComplete, { data, loading, error }] = useMutation(courseSelfComplete);

  const onClose = () => {
    setShowConfirmModal(!showConfirmModal);
  };

  const onTapSelfCompleteTab = () => {
    data = undefined;
    loading = false;
    error = undefined;
    !isSelfCompleted && setShowConfirmModal(true);
  };

  const onClickSelfComplete = () => {
    if (!isSelfCompleted) {
      selfComplete({ variables: { courseid: id } });
    } else {
      setShowConfirmModal(false);
    }
  };

  return (
    <TouchableOpacity style={overviewStyles.container} activeOpacity={1.0} onPress={onTapSelfCompleteTab}>
      <View style={overviewStyles.contentWrap}>
        <View style={overviewStyles.innerViewWrap}>
          {isSelfCompleted ? (
            <CircleIcon
              icon="check"
              backgroundColor={TotaraTheme.colorSuccess}
              iconColor={TotaraTheme.colorAccent}
              borderColor={TotaraTheme.colorSuccess}
            />
          ) : (
            <CircleIcon
              backgroundColor={TotaraTheme.colorAccent}
              iconColor={TotaraTheme.colorNeutral6}
              borderColor={TotaraTheme.colorNeutral6}
            />
          )}
        </View>
        <View style={overviewStyles.horizontalSeparator} />
        <View style={overviewStyles.carouselTextContainer}>
          <Text numberOfLines={1} style={overviewStyles.labelWrap}>
            {translate("course.mark_as_complete.title")}
          </Text>
        </View>
      </View>
      {showConfirmModal && data == undefined && error == undefined && (
        <SelfCompletion onClickAsComplete={onClickSelfComplete} onClose={onClose}>
          {loading && (
            <Modal transparent={true} visible={loading}>
              <View style={overviewStyles.modalBackground}>
                <Loading />
              </View>
            </Modal>
          )}
        </SelfCompletion>
      )}

      {error && <GeneralErrorModal />}
      {data && refetchCourseQueries()}
      {isCourseCompleted && <CourseCompletionModal onClose={onclickContinueLearning} />}
    </TouchableOpacity>
  );
};

type SummaryProps = {
  summary?: string;
  summaryTypeTitle?: string;
  summaryFormat?: DescriptionFormat;
};

const Summary = ({ summary = "", summaryTypeTitle = "", summaryFormat }: SummaryProps) => {
  return (
    <View style={overviewStyles.summaryContainer}>
      <Text numberOfLines={1} style={TotaraTheme.textHeadline}>
        {summaryTypeTitle}
      </Text>
      {!isEmpty(summary) && <DescriptionContent contentType={summaryFormat as DescriptionFormat} content={summary} />}
    </View>
  );
};

const ProgressCircle = ({ value }: { value: number }) => {
  return (
    <View style={overviewStyles.badgeContainer}>
      <AddBadge status={value} size={iconSizes.sizeM} />
    </View>
  );
};

export default OverviewDetails;

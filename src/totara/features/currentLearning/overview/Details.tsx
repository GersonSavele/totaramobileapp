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
 */

import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Text, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import { courseSelfComplete } from "../course/api";
import {
  AddBadge,
  Loading,
  GeneralErrorModal,
  CircleIcon,
  Separator
} from "@totara/components";
import { translate } from "@totara/locale";
import CriteriaSheet from "./CriteriaSheet";
import CourseCompletionModal from "../CourseCompletionModal";
import { Criteria } from "@totara/types";
import SelfCompletion from "./SelfCompletion";
import { courseCriteria } from "../constants";
import { overviewStyles } from "./overviewStyles";
import { iconSizes } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

type OverviewProps = {
  id: number;
  criteria?: [Criteria];
  summary?: string;
  gradeFinal?: number;
  progress: number;
  summaryTypeTitle?: string;
  onclickContinueLearning?: () => void;
  courseRefreshCallback?: () => {};
};

const Details = ({
  id,
  criteria,
  summary,
  gradeFinal,
  progress,
  summaryTypeTitle,
  onclickContinueLearning,
  courseRefreshCallback
}: OverviewProps) => {
  const isSelfCompletion = criteria?.some((value) => {
    return value["type"] === courseCriteria.selfComplete;
  });
  return (
    <View>
      <View>
        <ScrollView
          style={{ flexGrow: 1 }}
          horizontal={true}
          contentContainerStyle={overviewStyles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}>
          <Progress progress={progress} criteria={criteria} />
          {gradeFinal !== undefined && <Grade gradeFinal={gradeFinal} />}
          {isSelfCompletion && criteria && (
            <Complete
              id={id}
              criteria={criteria}
              onclickContinueLearning={onclickContinueLearning}
              courseRefreshCallback={courseRefreshCallback}
            />
          )}
        </ScrollView>
      </View>
      <Separator />
      <View style={{ flex: 4 }}>
        <Summary summary={summary} summaryTypeTitle={summaryTypeTitle} />
      </View>
    </View>
  );
};

const Grade = ({ gradeFinal }: { gradeFinal: number }) => {
  return (
    <TouchableOpacity
      style={overviewStyles.container}
      activeOpacity={1.0}
      onPress={() => {}}>
      <View style={overviewStyles.contentWrap}>
        <View style={overviewStyles.innerViewWrap}>
          <View style={{ flexDirection: "row" }}>
            <Text style={overviewStyles.gradePrefixText}>
              {gradeFinal.length > 0 ? gradeFinal : 0}
            </Text>
          </View>
        </View>
        <View style={overviewStyles.horizontalSeparator} />
        <View style={overviewStyles.carouselTextContainer}>
          <Text numberOfLines={1} style={overviewStyles.labelWrap}>
            {translate("course.course_overview_grade.title")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Progress = ({
  progress,
  criteria
}: {
  progress: number;
  criteria?: [Criteria];
}) => {
  const [showCriteria, setShowCriteria] = useState(false);
  const onClose = () => {
    setShowCriteria(!showCriteria);
  };
  return (
    <TouchableOpacity
      style={overviewStyles.container}
      activeOpacity={1.0}
      onPress={() => setShowCriteria(true)}>
      <View style={overviewStyles.contentWrap}>
        <View style={overviewStyles.innerViewWrap}>
          <ProgressCircle value={progress}></ProgressCircle>
        </View>
        <View style={overviewStyles.horizontalSeparator} />
        <View style={overviewStyles.carouselTextContainer}>
          <Text numberOfLines={1} style={overviewStyles.labelWrap}>
            {translate("course.course_overview_progress.title")}
          </Text>
        </View>
      </View>
      {showCriteria && criteria !== null && (
        <CriteriaSheet
          criteriaList={criteria}
          onClose={onClose}></CriteriaSheet>
      )}
    </TouchableOpacity>
  );
};

type CompletionProps = {
  id: number;
  criteria: [Criteria];
  onclickContinueLearning?: () => void;
  courseRefreshCallback?: () => {};
};

const Complete = ({
  id,
  criteria,
  onclickContinueLearning = () => {},
  courseRefreshCallback
}: CompletionProps) => {
  const isSelfCompleted = criteria?.some((value) => {
    if (value["type"] === courseCriteria.selfComplete) {
      return value["complete"] === true;
    }
  });

  const isCourseCompleted = criteria?.every((value) => {
    return value["complete"] === true;
  });

  const refetchCourseQueries = () => {
    courseRefreshCallback!();
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  let [selfComplete, { data, loading, error }] = useMutation(
    courseSelfComplete
  );

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
    <TouchableOpacity
      style={overviewStyles.container}
      activeOpacity={1.0}
      onPress={onTapSelfCompleteTab}>
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
            {translate("course.course_overview_mark_as_complete.title")}
          </Text>
        </View>
      </View>
      {showConfirmModal && data == undefined && error == undefined && (
        <SelfCompletion
          onClickAsComplete={onClickSelfComplete}
          onClose={onClose}>
          {loading && (
            <Modal transparent={true} visible={loading}>
              <View style={overviewStyles.modalBackground}>
                <Loading />
              </View>
            </Modal>
          )}
        </SelfCompletion>
      )}

      {error && <GeneralErrorModal siteUrl="" />}
      {data && refetchCourseQueries()}
      {isCourseCompleted && (
        <CourseCompletionModal onClose={onclickContinueLearning} />
      )}
    </TouchableOpacity>
  );
};

type SummaryProps = {
  summary?: string;
  summaryTypeTitle?: string;
};

const Summary = ({ summary = "", summaryTypeTitle = "" }: SummaryProps) => {
  return (
    <View style={overviewStyles.summaryContainer}>
      <Text numberOfLines={1} style={TotaraTheme.textHeadline}>
        {summaryTypeTitle}
      </Text>
      <View style={overviewStyles.summaryViewWrap}>
        <Text
          style={[
            TotaraTheme.textXSmall,
            { color: TotaraTheme.colorNeutral6 }
          ]}>
          {summary}
        </Text>
      </View>
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

export default Details;

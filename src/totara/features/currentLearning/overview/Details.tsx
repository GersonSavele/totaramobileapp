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

import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Text, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import { courseSelfComplete } from "../course/api";
import { ThemeContext } from "@totara/theme";
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
import { CourseContentDetails } from "@totara/types";
import { CourseGroupContentDetails } from "@totara/types/CourseGroup";
import SelfCompletion from "./SelfCompletion";
import { courseCriteria } from "@totara/lib/constants";
import { styles, gradePrefixText, labelWrap } from "../overviewStyles";
import { iconSizes } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

type OverviewProps = {
  contentDetails: CourseContentDetails | CourseGroupContentDetails;
  summaryTypeTitle?: string;
  onclickContinueLearning?: () => void;
};

type SummaryProps = {
  summary?: string;
  summaryTypeTitle?: string;
};

const Details = ({
  contentDetails,
  summaryTypeTitle,
  onclickContinueLearning
}: OverviewProps) => {
  const isShowSelfCompletion = contentDetails?.course.criteria?.some(
    (value) => {
      if (value["type"] === courseCriteria.selfComplete) {
        return true;
      }
    }
  );
  return (
    <View>
      <View>
        <ScrollView
          style={{ flexGrow: 1 }}
          horizontal={true}
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}>
          <Progress contentDetails={contentDetails} />
          <Grade contentDetails={contentDetails} />
          {isShowSelfCompletion && (
            <Complete
              contentDetails={contentDetails}
              onclickContinueLearning={onclickContinueLearning}
            />
          )}
        </ScrollView>
      </View>
      <Separator />
      <View style={{ flex: 4 }}>
        <Summary
          summary={contentDetails?.course?.summary}
          summaryTypeTitle={summaryTypeTitle}
        />
      </View>
    </View>
  );
};

const Grade = ({ contentDetails }: OverviewProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1.0}
      onPress={() => {}}>
      <View style={styles.contentWrap}>
        <View style={styles.innerViewWrap}>
          <View style={{ flexDirection: "row" }}>
            <Text style={gradePrefixText(theme)}>
              {contentDetails.gradeFinal.length > 0
                ? contentDetails?.gradeFinal
                : 0}
            </Text>
          </View>
        </View>
        <View style={styles.horizontalSeparator} />
        <View style={styles.carouselTextContainer}>
          <Text numberOfLines={1} style={labelWrap(theme)}>
            {translate("course.course_overview_grade.title")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Progress = ({ contentDetails }: OverviewProps) => {
  const [theme] = useContext(ThemeContext);
  const [showCriteria, setShowCriteria] = useState(false);
  const onClose = () => {
    setShowCriteria(!showCriteria);
  };
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1.0}
      onPress={() => setShowCriteria(true)}>
      <View style={styles.contentWrap}>
        <View style={styles.innerViewWrap}>
          <ProgressCircle
            value={
              contentDetails.course.completion?.progress !== undefined
                ? contentDetails.course.completion?.progress
                : 0
            }></ProgressCircle>
        </View>
        <View style={styles.horizontalSeparator} />
        <View style={styles.carouselTextContainer}>
          <Text numberOfLines={1} style={labelWrap(theme)}>
            {translate("course.course_overview_progress.title")}
          </Text>
        </View>
      </View>
      {showCriteria && contentDetails.course?.criteria !== null && (
        <CriteriaSheet
          criteriaList={contentDetails.course!.criteria}
          onClose={onClose}
        />
      )}
    </TouchableOpacity>
  );
};

const Complete = ({
  contentDetails,
  onclickContinueLearning = () => {}
}: OverviewProps) => {
  const isSelfCompleted = contentDetails.course?.criteria?.some((value) => {
    if (value["type"] === courseCriteria.selfComplete) {
      if (value["complete"] === true) return true;
    } else {
      return false;
    }
  });

  const [theme] = useContext(ThemeContext);
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
      selfComplete({ variables: { courseid: contentDetails.course?.id } });
    } else {
      setShowConfirmModal(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1.0}
      onPress={onTapSelfCompleteTab}>
      <View style={styles.contentWrap}>
        <View style={styles.innerViewWrap}>
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
        <View style={styles.horizontalSeparator} />
        <View style={styles.carouselTextContainer}>
          <Text numberOfLines={1} style={labelWrap(theme)}>
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
              <View style={styles.modalBackground}>
                <Loading />
              </View>
            </Modal>
          )}
        </SelfCompletion>
      )}

      {error && <GeneralErrorModal siteUrl="" />}
      {data && <CourseCompletionModal onClose={onclickContinueLearning} />}
    </TouchableOpacity>
  );
};

const Summary = ({ summary = "", summaryTypeTitle = "" }: SummaryProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={styles.summaryContainer}>
      <Text numberOfLines={1} style={theme.textHeadline}>
        {summaryTypeTitle}
      </Text>
      <View style={styles.summaryViewWrap}>
        <Text style={[theme.textXSmall, { color: theme.colorNeutral6 }]}>
          {summary}
        </Text>
      </View>
    </View>
  );
};

const ProgressCircle = ({ value }: { value: number }) => {
  return (
    <View style={styles.badgeContainer}>
      <AddBadge status={value} size={iconSizes.sizeM} />
    </View>
  );
};

export default Details;

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
import { courseSelfComplete } from "../courseDetails/api";
import { normalize, ThemeContext } from "@totara/theme";
import {
  AddBadge,
  Loading,
  GeneralErrorModal,
  ContentIcon,
  Separator
} from "@totara/components";
import { translate } from "@totara/locale";
import {
  CriteriaSheet,
  CourseCompletionModal
} from "@totara/components/currentLearning";
import { Course, CourseGroup } from "@totara/types";
import SelfCompletion from "./SelfCompletion";
import { courseCriteria } from "@totara/lib/constants";
import {
  styles,
  gradePrefixText,
  gradeSuffixText,
  labelWrap
} from "@totara/lib/styles/overview";

type OverviewProps = {
  learningItem?: Course | CourseGroup;
  summaryTypeTitle?: string;
  onclickContinueLearning?: () => void;
};

type SummaryProps = {
  summary?: string;
  summaryTypeTitle?: string;
};

const Details = ({
  learningItem,
  summaryTypeTitle,
  onclickContinueLearning
}: OverviewProps) => {
  const isSelfCompletion = learningItem?.criteria?.some((value) => {
    if (value["criteria"] === courseCriteria.selfComplete) {
      return true;
    }
  });
  return (
    <View>
      <View>
        <ScrollView
          style={{ flexGrow: 1 }}
          horizontal={true}
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}>
          <Progress learningItem={learningItem} />
          <Grade learningItem={learningItem} />
          {isSelfCompletion && (
            <Complete
              learningItem={learningItem}
              onclickContinueLearning={onclickContinueLearning}
            />
          )}
        </ScrollView>
      </View>
      <Separator />
      <View style={{ flex: 4 }}>
        <Summary
          summary={learningItem?.summary}
          summaryTypeTitle={summaryTypeTitle}
        />
      </View>
    </View>
  );
};

const Grade = ({ learningItem }: OverviewProps) => {
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
              {learningItem?.completion?.gradefinal !== undefined
                ? learningItem?.completion?.gradefinal
                : 0}
            </Text>
            <Text style={gradeSuffixText(theme)}>
              {"/" + learningItem?.completion?.grademax}
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

const Progress = ({ learningItem }: OverviewProps) => {
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
              learningItem?.completion?.progress !== undefined
                ? learningItem?.completion?.progress
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
      {showCriteria && learningItem?.criteria !== null && (
        <CriteriaSheet
          criteriaList={learningItem!.criteria}
          onClose={onClose}></CriteriaSheet>
      )}
    </TouchableOpacity>
  );
};

const Complete = ({
  learningItem,
  onclickContinueLearning = () => {}
}: OverviewProps) => {
  const userCriteriaComplete = learningItem?.criteria?.some((value) => {
    if (
      value["complete"] === false &&
      value["criteria"] === courseCriteria.selfComplete
    ) {
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
    setShowConfirmModal(true);
  };

  const onClickSelfComplete = () => {
    if (!userCriteriaComplete) {
      selfComplete({ variables: { courseid: learningItem?.id } });
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
          <ContentIcon
            iconSize={15}
            size={30}
            backgroundColor={theme.colorAccent}
            iconColor={theme.colorNeutral6}
            borderColor={theme.colorNeutral6}
          />
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
      <View style={styles.summaryTitleWrap}>
        <Text numberOfLines={1} style={theme.textH3}>
          {/* {translate("course_overview.course_summery")} */}
          {summaryTypeTitle}
        </Text>
      </View>
      <View style={styles.summaryViewWrap}>
        <Text style={[theme.textB3, { color: theme.colorNeutral6 }]}>
          {summary}
        </Text>
      </View>
    </View>
  );
};

const ProgressCircle = ({ value }: { value: number }) => {
  return (
    <View style={styles.badgeContainer}>
      <AddBadge status={value} size={normalize(24)}></AddBadge>
    </View>
  );
};

export default Details;

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
import React from "react";
import { withNavigation } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import ScormFeedbackModal from "./components/ScormFeedbackModal";
import { Grade } from "@totara/types/Scorm";
import { NAVIGATION } from "@totara/lib/constants";

const { NAVIGATION_SCORM_ROOT } = NAVIGATION;
type FeedbackParams = {
  id: string;
  attempt: number;
  isOnline: boolean;
  gradeMethod: Grade;
  completionScoreRequired?: number;
  score: string;
};

type FeedbackProps = {
  navigation: NavigationStackProp<FeedbackParams>;
};

const ScormFeedback = ({ navigation }: FeedbackProps) => {
  // NOTE -  all the commented code is related to online, which will be added in next sprint
  const {
    // id,
    // attempt,
    gradeMethod,
    completionScoreRequired,
    score
  } = navigation.state.params as FeedbackParams;
  // const apolloClient = useApolloClient();

  // TODO - need to remove after complete Online feedback
  // if (isOnline) {
  // const { loading, error, data, refetch } = useQuery(scormFeedbackQuery, {
  //   variables: { scormid: activity.instanceid }
  // });
  // if (loading) {
  //   return (
  //     <View style={{ position: "absolute", flex: 1 }}>
  //       <Loading />
  //     </View>
  //   );
  // }
  // if (error) {
  //   return <LoadingError onRefreshTap={refetch} />;
  // }
  // console.log("(data && data.scorm)", data && data.scorm);
  // if (data && data.scorm) {
  //   return (
  //     <ScormFeedbackModal
  //       grade={"0"}
  //       score={"10%"}
  //       method={"0"}
  //       onClose={onClose}
  //     />
  //   );
  // } else {
  //   return <LoadingError onRefreshTap={refetch} />;
  // }
  // return null;
  // // } else {
  // const lastActivityResult = getOfflineLastActivityResult(id, apolloClient);
  const goToSummary = () =>
    navigation.navigate({ routeName: NAVIGATION_SCORM_ROOT });

  // if (lastActivityResult && parseInt(lastActivityResult.attempt) === attempt) {
  return (
    <ScormFeedbackModal
      gradeMethod={gradeMethod}
      score={score}
      completionScoreRequired={completionScoreRequired}
      onClose={goToSummary}
    />
  );
  // } else {
  //   return (
  //     <ScormFeedbackModal
  //       gradeMethod={0}
  //       score={10}
  //       onClose={goToSummary}
  //     />
  //   );
  // }

  // }
};

export default withNavigation(ScormFeedback);

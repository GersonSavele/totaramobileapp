import { includes } from "lodash";
import { sortBy } from "lodash";
import { completionStates } from "./course/courseDetailsStyle";
import { completionTrack, completionStatus, completionIconStateKey, learningItemEnum } from "./constants";
import { translate } from "@totara/locale";

const extractTargetId = (id) => {
  return includes(id, "_") ? id.split("_")[1] : id;
};

const sortByDueDateThenTypeThenFullName = (toBeSorted) => {
  const typesForSorting = {
    [learningItemEnum.Certification]: 1,
    [learningItemEnum.Program]: 2,
    [learningItemEnum.Course]: 3
  };

  const withItemTypeMapped = toBeSorted.map((x) => {
    return {
      ...x,
      itemTypeMapped: typesForSorting[x.itemtype]
    };
  });

  return sortBy(withItemTypeMapped, ["duedate", "itemTypeMapped", "fullname"]);
};

const completionAccessibility = {
  notAvailable: {
    label: translate("course.course_details.accessibility_activity_unavailable"),
    role: "none",
    state: { disabled: true }
  },
  manualCompletion: {
    label: translate("course.course_details.accessibility_manual_completion"),
    state: { checked: false },
    role: "checkbox"
  },
  autoCompletion: {
    role: "checkbox",
    label: translate("course.course_details.accessibility_auto_completion"),
    state: { checked: false, disabled: true }
  },
  completeFail: {
    label: translate("course.course_details.accessibility_failed"),
    role: "none"
  }
};

type GetCompletionStatusProp = {
  completion?: string;
  status?: string;
  available: boolean;
};
const getCompletionStatus = ({ available, completion, status }: GetCompletionStatusProp) => {
  if (!available) {
    return {
      stateObj: completionStates[completionIconStateKey.notAvailable],
      accessibility: completionAccessibility.notAvailable
    };
  }
  if (completion !== completionTrack.trackingNone) {
    if (status === completionStatus.completePass || status === completionStatus.complete) {
      let accessibilityCompletion =
        completion === completionTrack.trackingAutomatic
          ? completionAccessibility.autoCompletion
          : completionAccessibility.manualCompletion;

      accessibilityCompletion.state = { ...accessibilityCompletion.state, checked: true };
      return {
        stateObj: completionStates[completionIconStateKey.completed],
        accessibility: accessibilityCompletion
      };
    }
    if (status === completionStatus.incomplete) {
      if (completion === completionTrack.trackingAutomatic) {
        let accessibilityIncomplete = completionAccessibility.autoCompletion;
        accessibilityIncomplete.state = { ...accessibilityIncomplete.state, checked: false };
        return {
          stateObj: completionStates[completionIconStateKey.autoIncomplete],
          accessibility: accessibilityIncomplete
        };
      }

      let accessibilityIncomplete = completionAccessibility.manualCompletion;
      accessibilityIncomplete.state = { ...accessibilityIncomplete.state, checked: false };
      return {
        stateObj: completionStates[completionIconStateKey.manualIncomplete],
        accessibility: accessibilityIncomplete
      };
    }
    if (status === completionStatus.completeFail) {
      return {
        stateObj: completionStates[completionIconStateKey.completeFail],
        accessibility: completionAccessibility.completeFail
      };
    }
  }
};
export { extractTargetId, sortByDueDateThenTypeThenFullName, getCompletionStatus, completionAccessibility };

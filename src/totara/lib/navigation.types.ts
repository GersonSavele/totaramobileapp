import type { StackScreenProps } from '@react-navigation/stack';

import type { learningItemEnum } from '../features/constants';
import type { Activity, NotificationMessage } from '../types';
import type { CourseSets } from '../types/CourseGroup';
import type { CatalogItem } from '../types/FindLearning';
import type { Attempt, Grade, Scorm, ScormActivityParams } from '../types/Scorm';
import type { NAVIGATION } from './navigation';

type CurrentLearningTabParamList = {
  [NAVIGATION.CURRENT_LEARNING]: undefined;
  [NAVIGATION.COURSE_DETAILS]: {
    targetId: string;
    passwordRequired: boolean;
    guestPassword: string;
  };
  [NAVIGATION.COURSE_GROUP_DETAILS]: {
    targetId: string;
    courseGroupType: string;
  };
  [NAVIGATION.COURSE_LIST]: {
    coursesList: CourseSets[];
  };
  [NAVIGATION.ACTIVITY_LIST]: undefined;
  [NAVIGATION.NO_CURRENT_LEARNING]: undefined;
};

type FindLearningTabParamList = {
  [NAVIGATION.FIND_LEARNING_STACK]: undefined;
  [NAVIGATION.FIND_LEARNING_COURSE_DETAILS]: {
    targetId: string;
    passwordRequired?: boolean;
    guestPassword?: string;
    courseGroupType?: learningItemEnum;
  };
  [NAVIGATION.FIND_LEARNING]: undefined;
  [NAVIGATION.OVERVIEW_MODAL]: undefined;
};

type DownloadsTabParamList = {
  [NAVIGATION.DOWNLOADS]: undefined;
};

type ProfileTabParamList = {
  [NAVIGATION.PROFILE]: undefined;
};

type NotificationsTabParamList = {
  Notifications: undefined;
  NotificationDetails: Omit<NotificationMessage, 'id'>;
};

type ScormStackParamList = {
  [NAVIGATION.SCORM_ACTIVITY]: ScormActivityParams;
  [NAVIGATION.SCORM_ATTEMPTS]: {
    gradeMethod: Grade;
    attempts?: Attempt[];
  };
  [NAVIGATION.OFFLINE_SCORM_ACTIVITY]: {
    attempt: number;
    scorm?: Scorm;
    backAction: () => void;
  };
  [NAVIGATION.WEBVIEW_ACTIVITY]: {
    activity: Activity;
    uri: string;
    backAction: () => void;
    fileurl?: string;
    mimetype?: string;
    apiKey?: string;
  };
  [NAVIGATION.SCORM_FEEDBACK]: {
    score: string;
    gradeMethod: Grade;
    showGrades: boolean;
    completionScoreRequired?: number;
    onClose: () => void;
  };
  [NAVIGATION.SCORM_STACK_ROOT]: {
    id: string;
    title: string;
  };
};

type UncategorisedScreensParamList = {
  [NAVIGATION.ABOUT]: undefined;
  [NAVIGATION.FIND_LEARNING_OVERVIEW]: CatalogItem;
  [NAVIGATION.ENROLMENT_MODAL]: {
    targetId: string;
  };
  [NAVIGATION.FIND_LEARNING_WEBVIEW]: {
    viewUrl: string;
    title: string;
  };
};

type UnauthorisedStackParamList = {
  [NAVIGATION.SITE_URL]: undefined;
  [NAVIGATION.NATIVE_LOGIN]: undefined;
  [NAVIGATION.WEBVIEW_LOGIN]: undefined;
  [NAVIGATION.BROWSER_LOGIN]: {
    siteUrl: string;
  };
};

type TabbedScreenParamLists = CurrentLearningTabParamList &
  FindLearningTabParamList &
  DownloadsTabParamList &
  NotificationsTabParamList &
  ProfileTabParamList;

type NonTabbedScreenParamLists = ScormStackParamList & UncategorisedScreensParamList & UnauthorisedStackParamList;

export type AllScreens = TabbedScreenParamLists & NonTabbedScreenParamLists;

export type ScreenParams<T extends keyof AllScreens> = StackScreenProps<AllScreens, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AllScreens {}
  }
}

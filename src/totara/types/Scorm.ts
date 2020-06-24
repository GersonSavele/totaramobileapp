import { ResourceState } from "./Resource";

export enum Grade {
  objective = "0", //= "Learning objects",
  highest = "1", // = "Highest grade",
  average = "2", // = "Average grade",
  sum = "3" // = "Sum grade"
}

export enum AttemptGrade {
  highest = "0", // = "Highest attempt",
  average = "1", // = "Average attempts",
  first = "2", // = "First attempt",
  last = "3" // = "Last completed attempt"
}

export enum Completion {
  none = 0, //"Do not indicate activity completion"
  manual, //"Learners can manually mark the activity as completed"
  conditional //"Show activity as complete when conditions are met"
}

export type Scorm = {
  id: string;
  courseid: string;
  name: string;
  description: string;
  attemptsMax: number;
  attemptsCurrent: number;
  attemptsForceNew: boolean;
  attemptsLockFinal: boolean;
  launchUrl: string;
  repeatUrl: string;
  calculatedGrade: string;

  offlineAttemptsAllowed: boolean;
  packageUrl?: string;
  offlinePackageUrl?: string;
  offlinePackageContentHash?: string;

  attempts: [ScormActivityResult];
  timeopen: number;
  timeclose: number;

  grademethod: string;
  maxgrade: number;

  whatgrade: string;
  completion: number;
  completionview: boolean;
  completionusegrade: boolean;
  completionscorerequired: number;
  completionstatusrequired: [string];
  completionstatusallscos: boolean;
  completionexpected: number;
  defaultCMI: {
    defaults: any;
    objectives: any;
    interactions: any;
  };
};

export type ScormBundle = {
  scorm?: Scorm;
  scormPackage?: Package;
  offlineActivity?: {
    last: OfflineActivity;
    start: OfflineActivity;
    attempts?: [ScormActivityResult];
  };
  lastsynced: number;
};

export type Sco = {
  id: string | null;
  organizationId: string | null;
  launchSrc: string | null;
};

export type Package = {
  path: string;
  scos?: [Sco];
  defaultSco?: Sco;
};

export type OfflineActivity = {
  attempt: number;
  scoid: string;
};

export type ScormActivityResult = {
  attempt: number;
  gradereported: number;
  timestarted?: string;
};

export type ScormActivityParams = {
  id: string;
  title?: string;
  downloadProgress?: number;
  downloadState?: ResourceState;
  onDownloadPress?: Function;
  backIcon?: string;
  backAction?: () => void;
};

export type CacheProps = {
  client: any;
  scormBundles?: { [key: string]: ScormBundle };
};

export type GradeForAttemptProps = {
  attemptCmi: any;
  maxGrade: number;
  gradeMethod: Grade;
};

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
  offlinePackageScoIdentifiers: [string];
  packageUrl?: string;
  offlinePackageUrl?: string;
  offlinePackageContentHash?: string;

  attempts: [Attempt];
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
  offlineAttempts?: [Attempt];
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

export type Attempt = {
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

export type GradeForAttemptProps = {
  attemptCmi: any;
  maxGrade: number;
  gradeMethod: Grade;
};

export type ScormPlayerProps = {
  entrysrc: string;
  def: any;
  obj: any;
  int: any;
  scormdebugging: boolean;
  scormauto: number;
  scormid: string;
  scoid: string;
  attempt: number;
  autocommit: boolean;
  masteryoverride: boolean;
  hidetoc: number;
};

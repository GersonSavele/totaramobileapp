export enum Grade {
    objective = 0, //= "Learning objects",
    highest, // = "Highest grade",
    average, // = "Average grade",
    sum // = "Sum grade"
}

export enum AttemptGrade {
    highest = 0, // = "Highest attempt",
    average, // = "Average attempts",
    first, // = "First attempt",
    last // = "Last completed attempt"
}

export enum Completion {
    none = 0, //"Do not indicate activity completion"
    manual, //"Learners can manually mark the activity as completed"
    conditional //"Show activity as complete when conditions are met"
}

export type Scorm = {
    id: number,
    courseid: string,
    name: string,
    description: string,
    attemptsMax: number,
    attemptsCurrent: number,
    attemptsForceNew:  boolean,
    attemptsLockFinal: boolean,
    launchUrl: string,
    repeatUrl: string,
    calculatedGrade: string,

    offlineAttemptsAllowed: boolean,
    packageUrl?: string,
    offlinePackageUrl?: string,
    offlinePackageContentHash?: string,

    attempts: [ScormActivityResult],
    timeopen: number,
    timeclose: number,

    grademethod: number,
    maxgrade: number,
    
    whatgrade: number,
    completion: number,
    completionview: boolean,
    completionusegrade: boolean,
    completionscorerequired: number,
    completionstatusrequired: [string],
    completionstatusallscos: boolean,
    completionexpected: number,
    defaultCMI: {
        defaults: any,
        objectives: any,
        interactions: any
    }
};

export type ScormBundle  = {
    scorm: Scorm,
    scormPackage?: Package,
    offlineActivity?: {
        last: OfflineActivity,
        start: OfflineActivity,
        attempts?: [ScormActivityResult]
    }
    lastsynced: number
};

export type Sco = {
    id: string | null,
    organizationId: string | null,
    launchSrc: string | null
};

export type Package = {
    path: string,
    scos: [Sco],
    defaultSco: Sco
};

export type OfflineActivity = {
    attempt: number,
    scoid: string
};

export type ScormActivityResult = {
    attempt: number,
    gradereported: number,
    timestarted?: string
};
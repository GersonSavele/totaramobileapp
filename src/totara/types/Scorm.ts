export type Scorm = {
    id: number,
    courseid: string,
    attemptsMax: number,
    attemptsCurrent: number,
    attemptsForceNew:  boolean,
    attemptsLockFinal: boolean,
    description: string,
    launchUrl: string,
    calculatedGrade: string,

    offlineAttemptsAllowed: boolean,
    packageUrl?: string,
    offlinePackageUrl?: string,
    offlinePackageContentHash?: string
};

export type OfflineScormPackage  = {
    scorm: Scorm,
    package: ScormPackage | undefined,
    offlineActivity?: {
        last: ScormOfflineActivity,
        start: ScormOfflineActivity
    }
    lastsynced: number
};

export type Sco = {
    id: string | null,
    organizationId: string | null,
    launchSrc: string | null
};

export type ScormPackage = {
    path: string,
    scos: [Sco],
    defaultSco: Sco
};
export type ScormOfflineActivity = {
    attempt: number,
    scoid: string
};
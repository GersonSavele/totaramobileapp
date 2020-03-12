
export type Scorm = {
    id: string,
    courseid: string,
    attemptsMax: number,
    attemptsCurrent: number,
    attemptsForceNew:  boolean,
    attemptsLockFinal: boolean,
    description: string,
    launchUrl: string,

    offlineAttemptsAllowed: boolean,
    packageUrl?: string,
    offlinePackageUrl?: string,
}

export type OfflineScormPackage  = {
    scorm: Scorm,
    offlinePackageData: ScormPackageData
};

export type Sco = {
    id: string | null,
    organizationId: string | null,
    launchSrc: string | null
};

export type ScormPackageData  = {
    packageLocation: string,
    scos: [Sco],
    defaultSco: Sco
};
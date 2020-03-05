
export type Scorm = {
    id: string,
    courseid: string,
    attemptsMax: number,
    attemptsCurrent: number,
    attemptsForceNew:  boolean,
    attemptsLockFinal: boolean,

    launchUrl: string,

    offlineAttemptsAllowed: boolean,
    packageUrl?: string,
    offlinePackageUrl?: string,
}

export type OfflineScormPackage  = {
    scorm: Scorm,
    offlinePackageData: {
        packageLocation: string,
        scos: [Sco],
        defaultSco: Sco
    }
};

export type Sco = {
    id: string,
    organizationId: string,
    launchSrc: string
}
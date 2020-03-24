export enum ResourceState {
    Added,
    Errored,
    Waiting,
    Downloading,
    Completed,
    Deleted
}

export interface IResource {
    id: string,
    name: string,
    sizeInBytes: number,
    resourceUrl: string,
    fileNamePath: string,
    percentCompleted: number,
    state?: ResourceState
}

import { DownloadBeginCallbackResult, downloadFile, DownloadProgressCallbackResult, unlink } from "react-native-fs"

export enum ResourceState {
    Added,
    Errored,
    Waiting,
    Downloading,
    Completed
}

export interface Resource {
    id: string,
    resourceUrl: string,
    fileNamePath: string,
    percentCompleted: number,
    state?: ResourceState
}

export type DownloadManagerObserver = (resourceFile: Resource) => void;

class DownloadManager{
    private static instance: DownloadManager;
    private constructor(){}

    public static getInstance(): DownloadManager {
        if(!DownloadManager.instance){
            DownloadManager.instance = new DownloadManager();
        }
        return DownloadManager.instance;
    }

    private observers: DownloadManagerObserver[] = [];

    public attach(observer: DownloadManagerObserver) : void {
        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: DownloadManagerObserver) : void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    //FILES
    private files: Resource[] = [];

    get snapshot() : Resource[] {
        return this.files;
    }


    downloadBegin = (id: string, res: DownloadBeginCallbackResult) =>{
        console.log(`downloadBegin ${id} length: ${res.contentLength}`);
        this.update(id, 0, ResourceState.Downloading);
    }

    downloadProgress = (id: string, res: DownloadProgressCallbackResult) =>{
        console.log(`downloadProgress ${id} written: ${res.bytesWritten} length: ${res.contentLength}`);
        const _completed = (res.bytesWritten/res.contentLength)*100;
        this.update(id, _completed, ResourceState.Downloading);
    }

    public download(apiKey: string, id: string, resourceUrl: string, fileNamePath: string) : void{
        //CHECK IF FILE ALREADY EXISTS
        if(this.files.filter(x=>x.id === id).length>0)
            return;

        this.files.push({id: id, resourceUrl: resourceUrl, fileNamePath: fileNamePath, percentCompleted: 0, state : ResourceState.Added});

        const downloaderOptions = {
            fromUrl: resourceUrl,
            toFile: fileNamePath,
            background: true,
            begin: (res: DownloadBeginCallbackResult)=>{
                this.downloadBegin(id, res)
            },
            progress: (res: DownloadProgressCallbackResult)=>{
                this.downloadProgress(id, res)
            },
            progressDivider: 10,
            headers: { Authorization: `Bearer ${apiKey}`}
        };

        downloadFile(downloaderOptions).promise.then(response => {
            if (response.statusCode === 200) {
                this.update(id, 100, ResourceState.Completed)
            } else {
                this.update(id, 0, ResourceState.Errored);
            }
        });
    }

    // const deletePackage = (filePath: string) => {
    //     return unlink(filePath);
    // }

    public remove(id: string) : void {
        this.files = this.files.filter(x=>x.id !== id);
    }

    public update(id: string, percentage: number, state: ResourceState){
        this.files.filter(file=>file.id === id).map(file => {
            file.percentCompleted = percentage;
            file.state = state
            return file;
        });

        this.notify(this.files.filter(x=>x.id === id)[0]);
    }

    public notify(file: Resource){
        this.observers.forEach(observer => observer(file));
    }
}


export default DownloadManager;

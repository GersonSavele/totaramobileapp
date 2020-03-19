import { DownloadBeginCallbackResult, downloadFile, DownloadProgressCallbackResult, unlink } from "react-native-fs"

export enum DownloadableFileState {
    Added,
    Errored,
    Waiting,
    Downloading,
    Completed
}

export interface DownloadableFile {
    id: string,
    resourceUrl: string,
    fileNamePath: string,
    percentCompleted: number,
    state?: DownloadableFileState
}

export type DownloadManagerObserver = (downloadFile: DownloadableFile) => void;

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
    private files: DownloadableFile[] = [];

    get snapshot() : DownloadableFile[] {
        return this.files;
    }


    downloadBegin = (id: string, res: DownloadBeginCallbackResult) =>{
        console.log(`downloadBegin ${id} length: ${res.contentLength}`);
        this.update(id, 0, DownloadableFileState.Downloading);
    }

    downloadProgress = (id: string, res: DownloadProgressCallbackResult) =>{
        console.log(`downloadProgress ${id} length: ${res.contentLength}`);
        const _completed = (res.bytesWritten/res.bytesWritten)*100;
        this.update(id, _completed, DownloadableFileState.Downloading);
    }

    public download(apiKey: string, id: string, resourceUrl: string, fileNamePath: string) : void{
        //TODO: CHECK IF ALREADY EXISTS

        this.files.push({id: id, resourceUrl: resourceUrl, fileNamePath: fileNamePath, percentCompleted: 0, state : DownloadableFileState.Added});

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
                this.update(id, 100, DownloadableFileState.Completed)
            } else {
                this.update(id, 0, DownloadableFileState.Errored);
            }
        });
    }

    // const deletePackage = (filePath: string) => {
    //     return unlink(filePath);
    // }

    public remove(id: string) : void {
        this.files = this.files.filter(x=>x.id !== id);
    }

    public update(id: string, percentage: number, state: DownloadableFileState){
        this.files.filter(file=>file.id === id).map(file => {
            file.percentCompleted = percentage;
            file.state = state
            return file;
        });

        this.notify(this.files.filter(x=>x.id === id)[0]);
    }

    public notify(file: DownloadableFile){
        this.observers.forEach(observer => observer(file));
    }
}


export default DownloadManager;

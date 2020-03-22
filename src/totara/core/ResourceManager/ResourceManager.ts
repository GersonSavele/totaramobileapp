import { DownloadBeginCallbackResult, downloadFile, DownloadProgressCallbackResult, unlink } from "react-native-fs"
import { IResource, ResourceState } from "@totara/core/ResourceManager/Resource"

export type ResourceObserver = (resourceFile: IResource) => void;

class ResourceManager{
    private static instance: ResourceManager;
    private constructor(){}

    public static getInstance(): ResourceManager {
        if(!ResourceManager.instance){
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    private observers: ResourceObserver[] = [];

    public attach(observer: ResourceObserver) : void {
        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: ResourceObserver) : void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    //FILES
    private files: IResource[] = [];

    get snapshot() : IResource[] {
        return this.files;
    }


    downloadBegin = (id: string, res: DownloadBeginCallbackResult) =>{
        console.log(`downloadBegin ${id} length: ${res.contentLength}`);
        this.update(id, 0, ResourceState.Downloading, res.contentLength);
    }

    downloadProgress = (id: string, res: DownloadProgressCallbackResult) =>{
        console.log(`downloadProgress ${id} written: ${res.bytesWritten} length: ${res.contentLength}`);
        const _completed = (res.bytesWritten/res.contentLength)*100;
        this.update(id, _completed, ResourceState.Downloading);
    }

    public download(apiKey: string, id: string, name: string, resourceUrl: string, fileNamePath: string) : void{
        //CHECK IF FILE ALREADY EXISTS
        if(this.files.filter(x=>x.id === id).length>0)
            return;

        const newFile = {
            id: id,
            name: name,
            resourceUrl: resourceUrl,
            fileNamePath: fileNamePath,
            percentCompleted: 0,
            state : ResourceState.Added} as IResource;
        this.files.push(newFile);
        this.notify(newFile);

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

    public delete = (filePath: string) => {
        return unlink(filePath);
    }

    public remove(id: string) : void {
        this.files = this.files.filter(x=>x.id !== id);
    }

    public update(id: string, percentage: number, state: ResourceState, sizeInBytes?: number){
        this.files.filter(file=>file.id === id).map(file => {
            file.percentCompleted = percentage;
            file.state = state;

            if(sizeInBytes) //ONLY FOR DOWNLOAD BEGIN
                file.sizeInBytes = sizeInBytes!;

            return file;
        });

        this.notify(this.files.filter(x=>x.id === id)[0]);
    }

    public notify(file: IResource){
        this.observers.forEach(observer => observer(file));
    }
}


export default ResourceManager;

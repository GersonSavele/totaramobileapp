import {DownloadBeginCallbackResult, downloadFile, DownloadProgressCallbackResult, unlink} from "react-native-fs"
import {IResource, ResourceState} from "@totara/core/ResourceManager/Resource";
import {unzip} from "react-native-zip-archive";
import {DeleteStorage, RetrieveStorage, SaveStorage} from "@totara/core/ResourceManager/StorageManager";
import {Log} from "@totara/lib";

export type ResourceObserver = (resourceFile: IResource) => void;

class ResourceManager{
    private static instance: ResourceManager;
    private constructor(){}

    public static getInstance(): ResourceManager {
        return ResourceManager.instance;
    }

    public init = () =>{
        if(!ResourceManager.instance){
            ResourceManager.instance = new ResourceManager();
            RetrieveStorage().then(saved =>{
                if(!saved){
                    ResourceManager.instance.files = [];
                    return;
                }
                const parsed = JSON.parse(saved!);
                ResourceManager.instance.files = Object.values(parsed);
            });
        }
    }

    private observers: ResourceObserver[] = [];

    public attach(observer: ResourceObserver) : void {
        this.observers.push(observer);
    }

    public detach(observer: ResourceObserver) : void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
    }

    //FILES
    private files: IResource[] = [];

    get snapshot() : IResource[] {
        return [...this.files];
    }

    private downloadBegin = (id: string, res: DownloadBeginCallbackResult) =>{
        this.update(id, 0, ResourceState.Downloading, res.contentLength);
    };

    private downloadProgress = (id: string, res: DownloadProgressCallbackResult) =>{
        const _completed = (res.bytesWritten/res.contentLength)*100;
        this.update(id, _completed, ResourceState.Downloading);
    };

    public download(apiKey: string, id: string, name: string, resourceUrl: string, targetFile: string, targetUnzipPath: string) : void{
        if(this.files.filter(x=>x.id === id).length>0)
            return;

        const newFile = {
            id: id,
            name: name,
            resourceUrl: resourceUrl,
            unzipPath: targetUnzipPath,
            percentCompleted: 0,
            state : ResourceState.Added} as IResource;
        this.files.push(newFile);
        this.notify(newFile);

        const downloaderOptions = {
            fromUrl: resourceUrl,
            toFile: targetFile,
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
                return unzip(targetFile, targetUnzipPath);
            } else {
                this.update(id, 0, ResourceState.Errored);
            }
        }).then(()=>{
            //console.log(targetFile);
            return unlink(targetFile);
        }).then(()=>{
            const strObj = this.files.find(f=>f.id === id);
            SaveStorage(id, strObj!);
            this.update(id, 100, ResourceState.Completed);
        })
    }

    public delete = async(id: string) => {
        const idx = this.files.findIndex(f=>f.id === id);
        if(idx<0)
            return;

        DeleteStorage(id);

        const toBeUpdated =  Object.assign({}, this.files[idx]);
        const files = [...this.files];
        files.splice(idx, 1);

        this.files = files;

        toBeUpdated.state = ResourceState.Deleted;

        try {
            await unlink(toBeUpdated.unzipPath);
        }
        catch(error){
            Log.error(error.toString(),error);
        }

        this.notify(toBeUpdated);
    };

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

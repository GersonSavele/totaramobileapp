import {DownloadBeginCallbackResult, downloadFile, DownloadProgressCallbackResult} from "react-native-fs"
import {IResource, ResourceState} from "@totara/core/ResourceManager/Resource"
import AsyncStorage from '@react-native-community/async-storage';


export type ResourceObserver = (resourceFile: IResource) => void;

const TOTARA_RESOURCES = '@TOTARA_RESOURCES';

class ResourceManager{
    private static instance: ResourceManager;
    private constructor(){}

    public static getInstance(): ResourceManager {
        return ResourceManager.instance;
    }

    public init = () =>{
        if(!ResourceManager.instance){
            ResourceManager.instance = new ResourceManager();
            this._retrieveStorage().then(saved =>{
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
    }

    private downloadProgress = (id: string, res: DownloadProgressCallbackResult) =>{
        const _completed = (res.bytesWritten/res.contentLength)*100;
        this.update(id, _completed, ResourceState.Downloading);
    }

    public download(apiKey: string, id: string, name: string, resourceUrl: string, fileNamePath: string) : void{
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
                //TODO: VERIFY HASH CODE
                this._saveStorage(id);
                this.update(id, 100, ResourceState.Completed)
            } else {
                this.update(id, 0, ResourceState.Errored);
            }
        });
    }

    private _retrieveStorage = () =>{
        return AsyncStorage.getItem(TOTARA_RESOURCES);
    };

    private _saveStorage = (id: string) =>{
        const strObj = this.files.find(f=>f.id === id);
        this._retrieveStorage().then(storedData => {
            let newData = {[id]: strObj}
            if (storedData && JSON.parse(storedData)) {
                newData = {...JSON.parse(storedData), ...newData};
                return AsyncStorage.setItem(TOTARA_RESOURCES, JSON.stringify(newData));
            }
        });
    };

    private _deleteStorage = (id: string) =>{
        this._retrieveStorage().then(storedData => {
            if (storedData && JSON.parse(storedData)) {
                const files = JSON.parse(storedData);
                delete files[id];
                return AsyncStorage.setItem(TOTARA_RESOURCES, JSON.stringify(files));
            }
        });
    };

    public delete = (id: string) => {
        const idx = this.files.findIndex(f=>f.id === id);
        if(idx<0)
            return;


        this._deleteStorage(id);

        const toBeUpdated =  Object.assign({}, this.files[idx]);
        const files = [...this.files];
        files.splice(idx, 1);

        this.files = files;

        toBeUpdated.state = ResourceState.Deleted;
        this.notify(toBeUpdated);

        //return unlink(filePath);
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

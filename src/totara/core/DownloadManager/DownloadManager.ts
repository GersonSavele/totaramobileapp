enum DownloadableFileState {
    Added,
    Errored,
    Downloading,
    Completed
}

export interface DownloadableFile {
    id: string,
    url: string,
    hash: string,
    state: DownloadableFileState
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

    public download(id: string, url: string, hash: string) : void{
        //TODO: check if not exists first

        this.files.push({id: id, url: url, hash: hash, state : DownloadableFileState.Added})
    }

    public remove(id: string) : void {
        this.files = this.files.filter(x=>x.id !== id);
    }

    public update(id: string, state: DownloadableFileState){
        this.files.filter(x=>x.id === id).map(x=>x.state = state);
        this.notify(this.files.filter(x=>x.id === id)[0]);
    }

    public notify(file: DownloadableFile){
        this.observers.forEach(observer => observer(file));
    }
}

export default DownloadManager;

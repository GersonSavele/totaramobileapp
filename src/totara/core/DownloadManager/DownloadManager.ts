// @ts-ignore
// import RNBackgroundDownloader from 'react-native-background-downloader';

export enum DownloadableFileState {
    Added,
    Errored,
    Waiting,
    Downloading,
    Completed
}

export interface DownloadableFile {
    id: string,
    url: string,
    hash?: string,
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

    public download(id: string, url: string, hash?: string) : void{
        this.files.push({id: id, url: url, hash: hash, percentCompleted: 0, state : DownloadableFileState.Added});

        // const task = RNBackgroundDownloader.download({
        //     id: id,
        //     url: url,
        //     destination: `${(new Date().toISOString())}.zip`
        // }).begin((expectedBytes: number) => {
        //     console.log(`Going to download ${expectedBytes} bytes!`);
        //     this.update(id, 0, DownloadableFileState.Waiting);
        // }).progress((percent: number) => {
        //     const perc = percent * 100;
        //     console.log(`Downloaded: ${perc.toFixed(2)}%`);
        //     this.update(id, Math.round(perc), DownloadableFileState.Downloading);
        // }).done(() => {
        //     console.log('Download is done!');
        //     this.update(id, 100, DownloadableFileState.Completed);
        // }).error((error: any) => {
        //     console.log('Download canceled due to error: ', error);
        //     this.update(id, -1, DownloadableFileState.Errored);
        // });
    }

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

export interface DownloadableFile {
    name: string,
}

export type DownloadManagerObserver = (downloadFile: DownloadableFile) => void;

class DownloadManagerController{
    private static instance: DownloadManagerController;
    private constructor(){}

    public static getInstance(): DownloadManagerController {
        if(!DownloadManagerController.instance){
            DownloadManagerController.instance = new DownloadManagerController();
        }
        return DownloadManagerController.instance;
    }

    private observers: DownloadManagerObserver[] = [];


    public attach(observer: DownloadManagerObserver): void {
        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: DownloadManagerObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    public updateFile(file: DownloadableFile){
        this.notify(file);
    }

    public notify(file: DownloadableFile){
        this.observers.forEach(observer => observer(file));
    }
}
export default DownloadManagerController;

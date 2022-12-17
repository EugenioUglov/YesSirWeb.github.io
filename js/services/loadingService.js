class LoadingService {
    constructor() {
        this.model = new LoadingModel();
        this.view = new LoadingView();
    }

    startLoading() {
        this.view.startLoading();
    }

        
    stopLoading() {
        this.view.stopLoading();
    }
}
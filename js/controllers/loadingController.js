class LoadingController {
    constructor(observable) {
        this.observable = observable;

        this.model = new LoadingModel();
        this.view = new LoadingView();

        this.#setEventListeners();
    }

    
    startLoading() {
        this.view.startLoading();
    }

        
    stopLoading() {
        this.view.stopLoading();
    }
    
    #setEventListeners() {
        const that = this;

        const events_to_start_loading = ['actionBlocksStartShow', 'dataFromDatabaseLoading', 'btnCreateActionBlockClicked'];
        const events_to_stop_loading = ['actionBlocksShowed', 'new_settings_for_actionBlocks_applied'];

        for (const event of events_to_start_loading) {
            this.observable.listen(event, function(observable, eventType, data) {
                console.log('start loading ' + event);
                that.view.startLoading();
            });
        }

        for (const event of events_to_stop_loading) {
            this.observable.listen(event, function(observable, eventType, data) {
                console.log('finish loading ' + event);
                that.view.stopLoading();
            });
        }
    }
}
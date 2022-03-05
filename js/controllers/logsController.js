class LogsController {
    constructor(fileManager, observable) {
        this.fileManager = fileManager;
        this.model = new LogsModel();
        this.view = new LogsView();
        this.observable = observable;
    }

    addLog(log) {
        this.model.addLog(log);
    }

    getLogs() {
        return this.model.getLogs();
    }

    downloadLogs() {
        const data_for_file = this.model.getDataForFile();
        this.fileManager.downloadFile(data_for_file.content, data_for_file.name, data_for_file.extension);
    }

    showContainerWithLogs() {
        this.view.showContainerWithLogs();
    }

    showLog(log) {
        this.view.setLogForLabelHelp(log);
    }
}
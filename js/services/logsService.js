class LogsService {
    constructor(fileManager, dateManager) {
        this.fileManager = fileManager;

        this.model = new LogsModel(dateManager);
        this.view = new LogsView();
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

    showContainerWithLogs() {
        this.view.showContainerWithLogs();
    }
}
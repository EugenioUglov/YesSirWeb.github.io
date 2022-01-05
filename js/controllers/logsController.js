class LogsController {
    constructor() {
        this.model = new LogsModel();
        this.view = new LogsView();
    }

    addLog(log) {
        this.model.addLog(log);
        this.view.show(log);
    }

    getLogs() {
        return this.model.getLogs();
    }

    downloadLogs() {
        this.model.downloadFile();
    }
        
}
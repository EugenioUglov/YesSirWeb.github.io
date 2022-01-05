class LogsModel {
    constructor() {
        this.logs = [];
    }

    addLog(log) {
        this.logs.push(log);
    }

    getLogs() {
        return this.logs;
    }
    
    downloadFile() {
        const logs = logsController.getLogs();

        const date_obj = new Date();
        const date_text = date_obj.today() + '  ' + date_obj.timeNow();
    
        // Set variable for name of the saving file with date and time. 
        const file_name = 'Logs_Action-Blocks ' + date_text;
        const extension = '.txt';

        let content = '';

        for (const i in logs) {
            const log = logs[i];
            const number_log = parseInt(i) + 1;

            if (i > 0) content += '\n';

            content += number_log + '. ' + log;
        }

        fileManager.saveFile(content, file_name, extension);
    }
}
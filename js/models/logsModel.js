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
    
    getDataForFile() {
        const logs = this.getLogs();

        const date = new Date();
        const date_text = date.today() + '  ' + date.timeNow();
    
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

        const data_for_file = {
            content: content,
            name: file_name,
            extension: extension
        };

        return data_for_file;
    }
}
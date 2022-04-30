class LogsModel {
    #dateManager;

    constructor(dateManager) {
        this.#dateManager = dateManager;
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

        const date_text = this.#dateManager.getDateNow() + '-' + this.#dateManager.getTimeNow();
    
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
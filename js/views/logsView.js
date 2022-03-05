class LogsView {
    constructor(controller) {
        this.controller = controller;
        this.setListener();

        this.logs_container = $('.logs_text')[0];
    }

    setLogForLabelHelp(log) {
        label_help.innerText = log;
    }

    showContainerWithLogs() {
        $('#elements_for_logs').show();
    }

    setListener() {
        const that = this;

        $('#btn_download_logs').on('click', () => this.controller.downloadLogs());
    }
    
    // Show log with red text.
    showErrorLog() {
        this.logs_container.innerHTML += '<div style="color:#e85894;">' + '* ERROR! ' + text + '</div><br><br>';
    }

    // Show log with grey text.
    addWarningLog() {
        this.logs_container.innerHTML += '<div style="color:#A36A00;">' + '* Warning! ' + text + '</div><br><br>';
    }

    clear() {
        this.logs_container.innerHTML = '';
    }
}
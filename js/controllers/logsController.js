class LogsController {
  #fileManager;
  #textManager;

  constructor() {
    this.model = new LogsModel();
    this.view = new LogsView();
    this.#fileManager;
    this.#textManager;
  }

  addLog(log) {
    this.model.addLog(log);
  }

  getLogs() {
    return this.model.getLogs();
  }

  downloadLogs() {
    if (this.#fileManager === undefined) {
      this.#textManager = new TextManager();
      this.#fileManager = new FileManager(this.#textManager);
    }

    const data_for_file = this.model.getDataForFile();
    this.#fileManager.downloadFile(
      data_for_file.content,
      data_for_file.name,
      data_for_file.extension
    );
  }

  showContainerWithLogs() {
    this.view.showContainerWithLogs();
  }

  showLog(log) {
    this.view.setLogForLabelHelp(log);
  }
}

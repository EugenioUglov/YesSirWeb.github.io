class VersionController {
    constructor() {
        this.view = new VersionView();
        this.model = new VersionModel();
    }

    applyUpdates() {
        if (this.model.getUserSiteVersion() != this.model.last_site_version) {
            logsController.addLog('Apply updates');

            this.view.updateDefaultInfoBlocks();
            this.model.setNewSiteVersion(model.last_site_version);
        }
    }

}
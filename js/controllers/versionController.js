class VersionController {
    constructor() {
        this.view = new VersionView();
        this.model = new VersionModel();
    }

    applyUpdates() {
        if (this.model.getUserSiteVersion() != this.model.last_site_version) {
            this.model.setNewSiteVersion(this.model.last_site_version);

            const event_updates_applied = {
                name: 'updatesApplied',
                data: {
                    log: 'Updates applied'
                }
            };
            
            observable.dispatchEvent(event_updates_applied.name, event_updates_applied.data);
        }
    }

}
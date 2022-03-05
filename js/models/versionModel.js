class VersionModel {
    constructor() {
        this.last_site_version = 4;
    }

    getUserSiteVersion() {
        return localStorage['siteVersion'];
    }

    setNewSiteVersion(last_site_version) {
        localStorage['siteVersion'] = last_site_version;
        this.last_site_version = last_site_version;

        return this.last_site_version;
    }

    isNewUpdates() {
        const user_version = localStorage['siteVersion'];
        
        return (this.last_site_version - user_version) > 0 ? true : false; 
    }
}
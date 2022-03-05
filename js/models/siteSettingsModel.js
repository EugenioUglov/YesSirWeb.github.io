
const siteSettingsModel = {};

// Return object with saved settings for site. Example: {'storage' : 'localhost', 'language' : 'EN'}
siteSettingsModel.get = function() {
    let site_settings = {};
    let key = 'siteSettings';
    // IF site settings exist in localStorage THEN get object with settings.
    if (localStorage.getItem(key)) site_settings = JSON.parse(localStorage[key])
    return site_settings;
}

siteSettingsModel.set = function(storage_setting_to_add) {
    let site_settings = {};

    if (localStorage['siteSettings']) site_settings = JSON.parse(localStorage['siteSettings']);

    // Make value for storage setting.
    site_settings['storage'] = storage_setting_to_add;

    // Save data.
    localStorage['siteSettings'] = JSON.stringify(site_settings);
    
    return true;
}
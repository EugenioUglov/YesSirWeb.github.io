class DataStorageService {
    constructor(dialogWindow) {
        this.view = new DataStorageView(dialogWindow);
    }

    #user_storage = localStorage['storage'];

    showDataStorageSettings() {
        this.view.showDataStorageSettings();
    }

    getStorageNameEnum() {
        const STORAGE_NAME_ENUM = {
            localStorage : 'localStorage',
            database : 'database'
        };

        return STORAGE_NAME_ENUM;
    }

    getUserStorage() {
        if (this.#user_storage === undefined) {
            this.#user_storage = this.getStorageNameEnum().localStorage;
        }
        
        return this.#user_storage;
    }

    setUserStorage(storage) {
        this.#user_storage = storage;
        localStorage['storage'] = storage;

        if (storage === this.getStorageNameEnum().database) {
            $('#rb_storage_database')[0].checked = true;
            $('#authorization_form').show();
        }
    }
}
class NoteSpeakerModel {
    constructor() {
        
    }

    #language = 'en-US';

    getLanguage() {
        return this.#language;
    }

    setLanguage(new_language) {
        this.#language = new_language;
    }
}
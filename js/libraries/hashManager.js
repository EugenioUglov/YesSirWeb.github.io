class HashManager {
    #hash_previous;

    constructor() {
        this.#hash_previous;
    }

    setValueForPreviousHash(new_hash_previous) {
        this.#hash_previous = new_hash_previous != undefined ? new_hash_previous : window.location.hash;
    }


    setPreviousHash() {
        if (this.#hash_previous) {
            window.location.hash = this.#hash_previous;
        }
    }

    getNormalizedCurrentHash() {
        return window.location.hash.toLowerCase();
    }

    getConvertedHashToObject() {
        const hash2Obj = window.location.hash
            .split("&")
            .map(v => v.split("="))
            .reduce( (pre, [key, value]) => ({ ...pre, [key]: value }), {} );

        return hash2Obj;
    }
}
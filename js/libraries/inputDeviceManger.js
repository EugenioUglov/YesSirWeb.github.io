class InputDeviceManager {
    constructor() {

    }


    getKeyCodeByKeyName() {
        const keycode_by_keyname = {
            arrowDown: 40,
            arrowUp: 38,
            enter: 13,
            space: 32
        };

        return keycode_by_keyname;
    }
}
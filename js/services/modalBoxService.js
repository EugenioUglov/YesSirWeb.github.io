class ModalBoxService {
    #view = new ModalBoxView();

    constructor() {
        
    }

    show(setting = {body_text: '', header_text: '', footer_text: '', is_possible_close: true}) {
        this.#view.show(setting);
    }

    hide() {
        this.#view.hide();
    }
}
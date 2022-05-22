class ModalLoadingService {
    #modalBoxService;

    constructor(modalBoxService) {
        this.#modalBoxService = modalBoxService;
    }

    show() {
        this.#modalBoxService.show({
            header_text: "Loading..",
            is_possible_close: false
        });
    }

    hide() {
        this.#modalBoxService.hide();
    }
}
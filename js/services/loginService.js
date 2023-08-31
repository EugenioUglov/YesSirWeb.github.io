class LoginService {
    #controller;

    constructor() {
        this.#controller = new LoginController();
    }

    showPanel() {
        yesSir.domElementManager.showElement('.login-panel');
    }
}
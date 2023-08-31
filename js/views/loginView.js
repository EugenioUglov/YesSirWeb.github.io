class LoginView {
    constructor() {

    }

    bindClickBtnSubmit(handler) {
        document.getElementsByClassName("login-panel")[0].addEventListener("submit", () => { 
            const login = $('.input-username').val();
            const password = $('.input-password').val();
            handler(login, password); 
        });
    }

    show() {
        $('.login-panel').show();
    }

    hide() {
        $('.login-panel').hide();
    }
}
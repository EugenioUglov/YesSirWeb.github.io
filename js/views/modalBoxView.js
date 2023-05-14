class ModalBoxView {
    constructor() {
        this.bindClickBtnClose(()=>this.hide());
    }

    // Get the modal
    #modal = document.getElementById("modalBox");

    // Get the modal-content
    #modalContent = document.getElementsByClassName("modal-content")[0];

    // Get the <span> element that closes the modal
    $btn_close = document.getElementsByClassName("close")[0];


    show(parameter = {body_text: '', header_text: '', footer_text: '', is_possible_close: true}) {
        const default_parameter = {
            body_text: '',
            header_text: '',
            footer_text: '',
            is_possible_close: true
        };

        let body_text = parameter.body_text != undefined ? parameter.body_text : default_parameter.body_text;
        let header_text = parameter.header_text != undefined ? parameter.header_text : default_parameter.header_text;
        let footer_text = parameter.footer_text != undefined ? parameter.footer_text : default_parameter.footer_text;
        let is_possible_close = parameter.is_possible_close != undefined ? parameter.is_possible_close : default_parameter.is_possible_close;

        if (is_possible_close) {
            $('.modal-close').show();
            this.bindClickOutsideModal(()=>this.hide());
        } else {
            $('.modal-close').hide();
            this.bindClickOutsideModal();
        }
        if (header_text) { 
            $('.modal-header-text').html(header_text);
            $('.modal-header-text').show();
        } else { 
            $('.modal-header-text').html('<h2></h2>');
        }
        if (body_text) {
            $('.modal-body').html(body_text);
            $('.modal-body').show();
        } else {
            $('.modal-body').hide();
        }
        if (footer_text) {
            $('.modal-footer-text').html(footer_text);
            $('.modal-footer').show();
        } else {
             $('.modal-footer').hide();
        }

        this.#modal.classList.remove('hide');
        this.#modalContent.classList.remove('hide');
        this.#modal.style.display = 'block';
    }

    hide() {
        this.#modalContent.classList.add('hide');
        this.#modal.classList.add('hide');    
        
        setTimeout(()=>{this.#modal.style.display = 'none';}, 450);
    }



    bindClickBtnClose(handler) {
        // When the user clicks on <span> (x), close the modal
        this.$btn_close.onclick = function() {
            handler();
        }
    }

    bindClickOutsideModal(handler) {
        const that = this;

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == that.#modal) {
                if (handler) handler();
            }
        }
    }
}
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


    show(setting = {body_text: '', header_text: '', footer_text: '', is_possible_close: true}) {
        const DEFAULT_SETTING = {
            body_text: '',
            header_text: '',
            footer_text: '',
            is_possible_close: true
        };

        let body_text = setting.body_text != undefined ? setting.body_text : DEFAULT_SETTING.body_text;
        let header_text = setting.header_text != undefined ? setting.header_text : DEFAULT_SETTING.header_text;
        let footer_text = setting.footer_text != undefined ? setting.footer_text : DEFAULT_SETTING.footer_text;
        let is_possible_close = setting.is_possible_close != undefined ? setting.is_possible_close : DEFAULT_SETTING.is_possible_close;
        console.log('is_possible_close', is_possible_close);

        if (is_possible_close) {
            $('.modal-close').show();
            this.bindClickOutsideModal(()=>this.hide());
        } else {
            $('.modal-close').hide();
            this.bindClickOutsideModal(()=>{});
        }
        if (header_text) { 
            $('.modal-header-text').html(header_text);
            $('.modal-header-text').show();
        } else { 
            $('.modal-header-text').html('<h2></h2>');
        }
        if (footer_text) {
            $('.modal-footer-text').html(footer_text);
            $('.modal-footer').show();
        } else {
             $('.modal-footer').hide();
        }

        $('.modal-body').html(body_text);
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
                handler();
            }
        }

    }

}
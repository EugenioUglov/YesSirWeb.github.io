class ScrollService {
    constructor() {
        this.view = new ScrollView();


        this.#bindViewEvents();
    }

    
    scrollTo = (toObj, speed = 1000) =>  {
        if(toObj === undefined || toObj === null) {
            // IF scroll on the top THEN return. 
            if (window.pageYOffset == 0) return;
    
            $('html, body').animate({scrollTop: '0px'}, speed);
            $('#btn_scroll_up').hide();
            
            return;
        }
    
        $('html, body').animate({
            // Class of the object to which do scrolling.
            scrollTop: toObj.offset().top  
        }, speed); 
    }

    scrollTop = () => {
        this.scrollTo();
    }

    getScrollXY = function() {
        if (window.pageYOffset != undefined) {
            return [pageXOffset, pageYOffset];
        } else {
            var sx, sy, d = document,
                r = d.documentElement,
                b = d.body;
            sx = r.scrollLeft || b.scrollLeft || 0;
            sy = r.scrollTop || b.scrollTop || 0;
            return [sx, sy];
        }
    }

    setPosition = (pageX, pageY) => {
        window.scrollTo(pageX, pageY);
    }

    setPositionTop() {
        window.scrollTo(0, 0);
    }

    bindScroll(callbackScrollEndPage, callbackScrollUp, callbackScrollDown) {
        const that = this;

        window.addEventListener("scroll", throttle(checkScrollPosition));
        window.addEventListener("resize", throttle(checkScrollPosition));

        function checkScrollPosition() {
            // Нам потребуется знать высоту документа и высоту экрана.
            const height = document.body.offsetHeight;
            const screenHeight = window.innerHeight;
            
            // Они могут отличаться: если на странице много контента,
            // высота документа будет больше высоты экрана (отсюда и скролл).
            
            // Записываем, сколько пикселей пользователь уже проскроллил.
            const scrolled = window.scrollY;
            
            // Обозначим порог, по приближении к которому
            // будем вызывать какое-то действие.
            // В нашем случае — экран страницы / значение.
            const threshold = height - screenHeight / 2;
            
            // Отслеживаем, где находится низ экрана относительно страницы.
            const position = scrolled + screenHeight;
            
            if (position >= threshold) {
                // Если мы пересекли полосу-порог, вызываем нужное действие.
                callbackScrollEndPage();
            }

            checkScrollDirection();

            function checkScrollDirection() {
                let last_scroll_top = 0;
                let scroll_offset_to_show_btn_up = 3000;
                let current_scroll_offset_up = 0;
                let start_scroll_up_start_position = 0;

                // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426".
                var scroll_position_current = window.pageYOffset || document.documentElement.scrollTop;

                // If down direction scroll.
                if (window.pageYOffset === 0 || scroll_position_current > last_scroll_top) {
                    that.view.btnScrollUpHide();
                    current_scroll_offset_up = 0;
                    start_scroll_up_start_position = 0;
                    if (callbackScrollDown) callbackScrollDown();
                } 
                // If up direction scroll
                else if (scroll_position_current < last_scroll_top) {
                    if (start_scroll_up_start_position - scroll_position_current >= scroll_offset_to_show_btn_up) that.view.btnScrollUpShow();
                    
                    if (start_scroll_up_start_position === 0) start_scroll_up_start_position = scroll_position_current;
                    if (callbackScrollUp) callbackScrollUp();
                }

                // For Mobile or negative scrolling.
                last_scroll_top = scroll_position_current <= 0 ? 0 : scroll_position_current; 
            }
        }

        function throttle(callee, timeout) {
            let timer = null
        
            return function perform(...args) {
                if (timer) return
            
                timer = setTimeout(() => {
                    callee(...args)
            
                    clearTimeout(timer)
                    timer = null
                }, timeout);
            }
        }
    }

    #bindViewEvents() {
        this.view.bindClickBtnScrollUp(this.scrollTop);
    }
}
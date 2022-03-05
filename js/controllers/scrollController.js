class ScrollController {
    constructor(observable) {
        this.observable = observable;
        this.view = new ScrollView();
        this.#setListeners();
        this.#bindViewEvents();
    }

    scrollTo = (toObj, speed = 1000) =>  {
        if(toObj === undefined || toObj === null) {
            // IF scroll on the top THEN return. 
            if (window.pageYOffset == 0) return;
    
            $('html, body').animate({scrollTop: '0px'}, speed);
            
            return;
        }
    
        $('html, body').animate({
            // Class of the object to which do scrolling.
            scrollTop: toObj.offset().top  
        }, 
        // Speed of anim.
        speed); 
    }

    scrollTop = () => {
        this.scrollTo();
    }

    setPosition = (pageX, pageY) => {
        window.scrollTo(pageX, pageY);
    }


    #setListeners() {
        const that = this;
        let last_scroll_top = 0;
        let scroll_offset_to_show_btn_up = 3000;
        let current_scroll_offset_up = 0;
        let start_scroll_up_start_position = 0;

        setScrollListener();
        setObservableListeners();

        function setScrollListener() {
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
                    const event_scrolled_to_bottom = {
                        name: 'scrolledToBottom',
                        data: {
                            log: 'scrolledToBottom'
                        }
                    };

                    observable.dispatchEvent(event_scrolled_to_bottom.name, event_scrolled_to_bottom.data);
                }

                checkScrollDirection();

                function checkScrollDirection() {
                    // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426".
                    var scroll_position_current = window.pageYOffset || document.documentElement.scrollTop;


                    if (window.pageYOffset === 0 || scroll_position_current > last_scroll_top){
                        // downscroll code.

                        $('#btn_scroll_up').hide();
                        current_scroll_offset_up = 0;
                        start_scroll_up_start_position = 0;
                    } 
                    else if (scroll_position_current < last_scroll_top) {
                        // upscroll code.

                        if (start_scroll_up_start_position - scroll_position_current >= scroll_offset_to_show_btn_up) $('#btn_scroll_up').show();
                        
                        if (start_scroll_up_start_position === 0) start_scroll_up_start_position = scroll_position_current;
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

        function setObservableListeners() {
            that.observable.listen('actionBlocksUpdated', function(observable, eventType, data) {
                // Scroll top.
                that.scrollTo();
            });

            that.observable.listen('actionBlocksStartShow', function(observable, eventType, data) {
                // Scroll top.
                that.scrollTo();
                
                $('#btn_scroll_up').hide();
            });

            that.observable.listen('actionBlockContentExecuted', function(observable, eventType, data) {
                // Set position top.
                that.setPosition(0, 0);
            });
        }
    }

    #bindViewEvents() {
        this.view.bindClickBtnScrollUp(this.scrollTop);
    }
}

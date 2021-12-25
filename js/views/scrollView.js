const scrollView = {};

scrollView.scrollTo = function(toObj, speed = 1000)  {
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

scrollView.scrollToTop = function() {
    // Slider on top of the page.
    window.scrollTo(pageXOffset, 0);
}
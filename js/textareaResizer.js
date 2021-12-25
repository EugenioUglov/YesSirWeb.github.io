let textAreaResizer = {}

textAreaResizer.update = function() { 
    resizeTextAreaOnEvent();
}

function resizeTextAreaOnEvent() {
    // Each text area resize to text size.
    /*
    $(".resize_field").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("input", function () {
        let height = this.style.height.replace(/[^0-9\.]+/g,'')|0;
        console.log("height: " + height + " | this.scrollHeight: " + this.scrollHeight);
        if (height != this.scrollHeight) {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        }
    });
    


    $(".resize_field").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("click", function () {
        let height = this.style.height.replace(/[^0-9\.]+/g,'')|0;
        // console.log("height: " + height + " | this.scrollHeight: " + this.scrollHeight);
        if (height != this.scrollHeight) {
            // Set height of textarea as count of words in the field.

            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        }
    });
    */
}
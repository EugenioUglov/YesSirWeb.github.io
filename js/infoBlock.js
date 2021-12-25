function InfoBlock(id, infoObj, isEditable = true) {
    this.id = id;
    this.infoObj = infoObj;
    this.title = infoObj.title;
    this.is_folder = infoObj.action === ACTION_NAME.openFolder;
    this.imagePath = infoObj.imagePath;

    this.infoBlock_container;


    const comment_symbol = '\"';
    let title_html = "";

    if ( ! this.id) {
        console.log("ERROR! Id must be defined to create infoBlock"); 
        return;
    }

    if (this.title != undefined) {
        title_html = '<div class="title">' + this.title + '</div>';
    }

            
    let img_div_html = "";
    let folder_elem = "";
    let is_padding_top = false;
    const update_elem_HTML = '<div class="settings"><div class="icon"></div></div>';


    if (this.imagePath) {
        img_div_html = '<img class="img" src=' + comment_symbol + this.imagePath + comment_symbol + '">';
    }
    else {
        //logsManager.addWarningLog("Not exist image path in object: " + this.title);
        this.imagePath = comment_symbol + comment_symbol;
        img_div_html = '<img class="img">';
    }
    /*
    
    else {
        is_padding_top = true;
    }
    */

    if (this.is_folder)
    {
        folder_elem = '<div class="folder"></div>';
    }
    
    this.id_html = "infoBlock" + this.id; // this.title.replaceAll(' ', '_');

    let perspective_container_html = '<div id=' + comment_symbol + this.id_html + comment_symbol + 'class="perspective_img_effect_container">';
   
    let first_part_infoBlock_html = "";

    first_part_infoBlock_html = '<div id="' + this.id_html +  '" class="infoBlock">';

    // Set padding from settings button.
    /*
    if (is_padding_top) {
        first_part_infoBlock_html = '<div id="' + this.id_html +  '" class="infoBlock" style="padding-top:30px">';
    }
    else {
        first_part_infoBlock_html = '<div id="' + this.id_html +  '" class="infoBlock">';
    }
    */

    if (isEditable) {
        this.infoBlock_html = first_part_infoBlock_html + folder_elem + update_elem_HTML + img_div_html  + title_html +'</div>';
    }
    else {
        this.infoBlock_html = first_part_infoBlock_html + folder_elem + img_div_html  + title_html +'</div>';
    }
}

InfoBlock.prototype.create = function(
    parent_element = $('.infoBlocks_container').first()
) {
    // Add container to infoBlocks area.
    parent_element.append(this.infoBlock_html);

    const infoBlock_element = $("#" + this.id_html)[0];
    this.infoBlock_container = parent_element.find(infoBlock_element);

    return this.infoBlock_container;
}


InfoBlock.prototype.get = function() {
    return this.infoBlock_container;
}

InfoBlock.prototype.remove = function() {
    this.infoBlock_container.remove();
}
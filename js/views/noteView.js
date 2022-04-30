class NoteView {
    constructor() {

    }
    

    showInfo(content, title, isHTML) {
        // Title text.
        const titleHTML = '<div class="center" style="font-size: 30px"><b>' + title + '</div></b><br><br>';
        $('#content_executed_from_actionBlock').find('.title').val(title);
        // content text.
        const contentHTML = '<div class="text_info"></div>';
        // const contentHTML = '<div class="info">' + content + '</div>';
        
       // let content_to_show = '';
       // content_to_show = titleHTML + contentHTML;
        $('#content_executed_from_actionBlock').find('.title').html(title);
    
    
        this.#showContentOnPage(content, isHTML);
    }

    #showContentOnPage(content, isHTML = false) {
        $('#btn_close').show();
        $('#content_executed_from_actionBlock').show();
        
        // Hide search area with Action-Blocks.
        //document.getElementById('actionBlocks_page').style.display = "none";
        
    
        // Append title and html elements.
        //document.getElementById('content_executed_from_actionBlock').innerHTML = content_to_show;
        $('#content_executed_from_actionBlock').find('.content').show();
    
        if (isHTML) {
            $('#content_executed_from_actionBlock').find('.content').css('white-space', '')
            $('#content_executed_from_actionBlock').find('.content').html(content);
        }
        else {
            console.log('not html');
            $('#content_executed_from_actionBlock').find('.content').css('white-space', 'pre-wrap')
            // this.textManager.getConvertedTextToHTML(content);
            $('#content_executed_from_actionBlock').find('.content').text(content);
        }
    
        $('#content_executed_from_actionBlock').find('.content').show();
    }

    
    bindClickBtnClose(handler) {
        const buttons_close = ['#btn_close', '#btn_back'];

        for (const button_close of buttons_close) {
            $(button_close).on('click', () => { handler(); });
        }
    }

    close() {
        const elements_for_executed_actionBlock_array = document.getElementsByClassName('elements_for_executed_actionBlock');
    
        for (const elements_for_executed_actionBlock of elements_for_executed_actionBlock_array) {
            elements_for_executed_actionBlock.style.display = 'none';
        }
    
        // Clear executed content.
        $('#content_executed_from_actionBlock').hide();
        $('#content_executed_action-block_container').hide();
    
        // Also close modal box (by standart logic of API).

        $('#btn_close').hide();
        $('#btn_back').hide();
    }
}
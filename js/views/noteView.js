class NoteView {
    constructor() {

    }
    

    showInfo(content, title, isHTML) {
 
        // $('.btn_open_settings_actionBlock').show();

        // Title text.
        const titleHTML = '<div class="center" style="font-size: 30px"><b>' + title + '</div></b><br><br>';
        // $('#content_executed_from_actionBlock').find('.title').val(title);
        // content text.
        const contentHTML = '<div class="text_info"></div>';
        // const contentHTML = '<div class="info">' + content + '</div>';
        
       // let content_to_show = '';
       // content_to_show = titleHTML + contentHTML;
        $('#content_executed_from_actionBlock').find('.title').html(title);
    
        const showContentOnPage = function(content, isHTML = false) {
            $('#btn_close').show();
            $('#content_executed_from_actionBlock').show();
            
            // Hide search area with Action-Blocks.
            //document.getElementById('actionBlocks_page').style.display = "none";
            
        
            // Append title and html elements.
            //document.getElementById('content_executed_from_actionBlock').innerHTML = content_to_show;
            // $('#content_executed_from_actionBlock').find('.content').show();

            function getContentWithHighlightedURLs(text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function(url) {
                  return '<a href="' + url + '">' + url + '</a>';
                });
                // or alternatively
                // return text.replace(urlRegex, '<a href="$1">$1</a>')
            }

            // if (isHTML) {
                $('#content_executed_from_actionBlock').find('.content').css('white-space', 'pre-wrap');
                $('#content_executed_from_actionBlock').find('.content').html(getContentWithHighlightedURLs(content));
            // }
            // else {
            //     // console.log('not html');
            //     $('#content_executed_from_actionBlock').find('.content').css('white-space', 'pre-wrap');
            //     // this.textManager.getConvertedTextToHTML(content);
            //     $('#content_executed_from_actionBlock').find('.content').text(content);
            // }
        
            $('#content_executed_from_actionBlock').find('.content').show();
        }
    
        showContentOnPage(content, isHTML);

        $('.note_title').show();
        
        $('#showJustContentButton').on('click', () => {
            $('.note_title').hide();
            $("button").each(function (index) {
                $(this).hide();
            });
            $('#btn_close').show();
        });
        $('#showJustContentButton').show();


        return [$('.btn_open_settings_actionBlock'), $('#content_executed_from_actionBlock'),
            $('#content_executed_from_actionBlock').find('.content'), ];
    }

    
    bindClickBtnClose(handler) {
        const that = this;
        const buttons_close = ['#btn_close', '#btn_back'];

        for (const button_close of buttons_close) {
            $(button_close).on('click', () => {
                that.close();
                $('.btn_open_settings_actionBlock').hide();
                handler(); 
            });
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
        $('#btn_close').hide();
        $('#btn_back').hide();
    }
}
const infoBlockSearcher = {};

infoBlockSearcher.searchByCommand = function(command, isExecuteInfoBlockByTitle = true) {
    let infoObjects_to_show;
    if ( ! command) {
        // Show all infoBlocks.

        infoObjects_to_show = infoBlockModel.getAll();

        console.log("infoObjects_to_show", infoObjects_to_show);

    
        // Show data in images.
        infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_to_show);
        
        infoBlockModel.showed_infoObjects = infoObjects_to_show;
    }
    else {
        // Show infoBlocks by user phrase.

        // Get command text from input field and find possible search data.
        infoObjects_to_show = infoBlockModel.getByPhrase(command);
    
        console.log("infoObjects_to_show", infoObjects_to_show);

    
        if ( ! infoObjects_to_show) {
            infoObjects_to_show = [];
        }

        // Show infoBlocks separated by pages.
        infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_to_show);
        
        infoBlockModel.showed_infoObjects = infoObjects_to_show;
       
        if (isExecuteInfoBlockByTitle) {
            // IF infoObject has been found with the same title THEN execute action.
            for (infoObj of infoObjects_to_show) {
                if (textAlgorithms.isSame(infoObj.title, command)) {
                    infoBlockView.executeActionByObj(infoObj);
                    
                    break;
                }
            }
        }

        // IF has been found just one infoObject THEN execute action.
        /*
        if (infoObjects_to_show.length === 1) {
            let infoObj = infoObjects_to_show[0];
            infoBlockView.executeActionByObj(infoObj);
        }
        */
    }
}
class ScrollController {
    constructor(scrollService, actionBlockService) {
        this.actionBlockService = actionBlockService;
        this.scrollService = scrollService;

        this.view = new ScrollView();
        this.#bindViewEvents();
    }


    #bindViewEvents() {
        const that = this;

        that.scrollService.bindScroll(onScrollEndPage);
            
        function onScrollEndPage() {
            if (that.actionBlockService.view.isActionBlocksPageActive()) {
                that.actionBlockService.addOnPageNextActionBlocks();
            }
        }

    }
}

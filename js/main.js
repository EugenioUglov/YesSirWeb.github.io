class YesSir {
    #dialogWindow;

    constructor() {
        this.#dialogWindow = new DialogWindow();

        this.textManager = new TextManager();
        this.fileManager = new FileManager(this.textManager);
        this.dateManager = new DateManager();
        this.inputDeviceManager = new InputDeviceManager();
        this.voiceRecognitionManager = new VoiceRecognitionManager();

        this.noteService = new NoteService();
        this.dataStorageService = new DataStorageService(this.#dialogWindow);
        this.searchService = new SearchSevice();
        this.scrollService = new ScrollService();
        this.logsService = new LogsService(this.fileManager, this.dateManager);
        this.autocompleteService = new AutocompleteService(this.textManager);
        this.voiceRecognitionService = new VoiceRecognitionService(this.voiceRecognitionManager);
        this.speakerService = new SpeakerService();
        this.pageService = new PageService(this.textManager);
    }
}

const yesSir = new YesSir();

let dropdownManager;
let mapDataStructure;
let dbManager;
let arrayManager;

let actionBlockController; 
let logsController; 
let speakerController;

let actionBlockService;


(function(){
    window.addEventListener('load', function () {
        onPageLoaded();
    });

    function onPageLoaded() {
        // Initialize Libraries.
        const observable = new Observable();
        const dateManager = yesSir.dateManager;
        const inputDeviceManager = yesSir.inputDeviceManager;
        const keyCodeByKeyName = inputDeviceManager.getKeyCodeByKeyName();
        const textManager = yesSir.textManager;
        const dialogWindow = new DialogWindow();
        const fileManager = yesSir.fileManager;
        dropdownManager = new DropdownManager();
        mapDataStructure = new MapDataStructure();
        dbManager = new DBManager();
        arrayManager = new ArrayManager();

        // Initialize Services.
        const voiceRecognitionService = yesSir.voiceRecognitionService;
        //console.log('Initialize Services', voiceRecognitionService.isRecognizing());
        const speakerService = yesSir.speakerService;
        const autocompleteService = yesSir.autocompleteService;
        const scrollService = yesSir.scrollService;
        const searchService = yesSir.searchService;
        const logsService = yesSir.logsService;
        const loadingService = new LoadingService();
        const noteService = yesSir.noteService;
        const dataStorageService = yesSir.dataStorageService;
        const pageService = yesSir.pageService;
        actionBlockService = new ActionBlockService(dbManager, observable, fileManager, textManager, 
            dropdownManager, dataStorageService, mapDataStructure, logsService, dialogWindow, 
            keyCodeByKeyName, scrollService, searchService, loadingService, pageService, noteService, dateManager);

        // Initialize Controller.
        logsController = new LogsController(fileManager);
        speakerController = new SpeakerController(speakerService);
        const loadingController = new LoadingController(observable);
        actionBlockController = new ActionBlockController(actionBlockService, dbManager,
            dropdownManager, mapDataStructure, loadingService, dialogWindow, 
            scrollService, searchService, pageService, noteService);
        const autocompleteController = new AutocompleteController(pageService, actionBlockService, autocompleteService);
        const voiceRecognitionController = new VoiceRecognitionController(voiceRecognitionService, observable);
        const scrollController = new ScrollController(scrollService, actionBlockService);
        const pageController = new PageController(pageService);
        const searchController = new SearchController(searchService, actionBlockService, pageService, textManager, keyCodeByKeyName);
        const noteController = new NoteController(actionBlockService, noteService, pageService);
        const dataStorageController = new DataStorageController(actionBlockService, dataStorageService, pageService);

        
        //autocompleteController.bindApplyTags(onAutocompleteItemSelected);
        actionBlockService.showActionBlocksFromStorage();


        // resizeContentDialogInfo();
        // window.addEventListener('resize', onWindowResize);
    }


    function onWindowResize() {
        resizeContentDialogInfo();
    }

    // Resize content in dialog info.
    function resizeContentDialogInfo() {
        let width_dialog_info = $(".content").css("width");
        
        $(".dialog_content").css({
            "width": "250px"
        });
    }
})();
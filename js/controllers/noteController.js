class NoteController {
    constructor(observable) {
        this.observable = observable;

        this.model = new NoteModel();
        this.view = new NoteView();

        this.is_note_opened = false;

        this.bindViewEvents();
        this.setListeners();
    }

    close = () => {
        console.log('noteClosed');
        this.is_note_opened = false;
        this.view.close(); 

        const event = {
            name: 'noteClosed',
            data: 'Note closed'
        };
        
        this.observable.dispatchEvent(event.name, event.data);
    }

    setListeners() {
        const that = this;

        that.observable.listen('hashChanged', function(observable, eventType, data) {
            if (window.location.hash.includes('#indexActionBlock') === false && that.is_note_opened) {
                //that.close();
            } 
        });

        that.observable.listen('actionBlockContentExecuted', function(observable, eventType, data) {
            console.log('Open note');
            that.is_note_opened = true;
        });   
    }

    bindViewEvents() {
        this.view.bindClickBtnClose(this.close);
    }
}

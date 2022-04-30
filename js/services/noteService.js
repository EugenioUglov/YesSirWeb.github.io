class NoteService {
    constructor() {
        this.model = new NoteModel();
        this.view = new NoteView();

        this.is_note_opened = false;
    }

    openNote(content, title, isHTML) {
        this.view.showInfo(content, title, isHTML);
    }

    close = () => {
        this.is_note_opened = false;
        this.view.close(); 
    }
}
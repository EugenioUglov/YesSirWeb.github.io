const speakerView = new SpeakerView();
const speakerModel = new SpeakerModel();
const speakerController = new SpeakerController(speakerView, speakerModel);
speakerController.init();
class VoiceRecognitionModel {
    constructor() {

    }

    #event = {
        start: 'startVoiceRecognition',
        continuos: 'continuosVoiceRecognition',
        //result: 'resultVoiceRecognition',
        speech_denied: 'speechDeniedVoiceRecognition',
        error: {
            no_speech: 'noSpeechVoiceRecognition',
            audio_capture: 'noMicrophoneVoiceRecognition',
            not_allowed: 'notAllowedVoiceRecognition'
        }
    };

    #languages =
        [
            ['English',         ['en-US', 'United States'],
                                ['en-AU', 'Australia'],
                                ['en-CA', 'Canada'],
                                ['en-IN', 'India'],
                                ['en-NZ', 'New Zealand'],
                                ['en-ZA', 'South Africa'],
                                ['en-GB', 'United Kingdom']],
            ['Italiano',        ['it-IT', 'Italia'],
                                ['it-CH', 'Svizzera']],
            ['Español',         ['es-AR', 'Argentina'],
                                ['es-BO', 'Bolivia'],
                                ['es-CL', 'Chile'],
                                ['es-CO', 'Colombia'],
                                ['es-CR', 'Costa Rica'],
                                ['es-EC', 'Ecuador'],
                                ['es-SV', 'El Salvador'],
                                ['es-ES', 'España'],
                                ['es-US', 'Estados Unidos'],
                                ['es-GT', 'Guatemala'],
                                ['es-HN', 'Honduras'],
                                ['es-MX', 'México'],
                                ['es-NI', 'Nicaragua'],
                                ['es-PA', 'Panamá'],
                                ['es-PY', 'Paraguay'],
                                ['es-PE', 'Perú'],
                                ['es-PR', 'Puerto Rico'],
                                ['es-DO', 'República Dominicana'],
                                ['es-UY', 'Uruguay'],
                                ['es-VE', 'Venezuela']],
            ['Pусский',         ['ru-RU']],
        ];

    getLanguages() {
        return this.#languages;
    }

    getEvent() {
        return this.#event;
    }
}
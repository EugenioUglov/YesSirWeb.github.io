const fileManager = {};
console.log("fileManager uploaded");
fileManager.saveFile = function(text, file_name) {
    // Encode spec symbols.
    let encoded_text = encodeURIComponent(text);


    // IF filename is undefined THEN filename is a current date.
    if (file_name === undefined) {
        let date_obj = new Date();
        let date_text = date_obj.today() + "  " + date_obj.timeNow();
    
        // Set variable for name of the saving file with date and time. 
        file_name = 'info_blocks ' + date_text + '.json';
    }
    // IF filename doesn't have type of file .json on the end THEN add it.
    else if ( ! file_name.includes(".")) {
        file_name += ".json";
    }
    
    const element = document.createElement('a');
  
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encoded_text);
    element.setAttribute('download', file_name);
  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


// Get text from file.
fileManager.loadFile = function(onFileLoadedCallback) {
    //let decoded_text_from_file = "";

    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);

    // on file loaded
    function handleFileLoad(event) {
        const text_from_file = event.target.result;
        let fromSymbol = "%";
        let toSymbol = "<percentage>";
        const text_from_file_with_encoded_percentage = textAlgorithms.replaceSymbols(text_from_file, fromSymbol, toSymbol)
        let decoded_text_from_file = decodeURIComponent(text_from_file_with_encoded_percentage);
        
        fromSymbol = "<percentage>";
        toSymbol = "%";
        decoded_text_from_file = textAlgorithms.replaceSymbols(decoded_text_from_file, fromSymbol, toSymbol)
        console.log("decoded_text_from_file", decoded_text_from_file);

        onFileLoadedCallback(decoded_text_from_file)
    }
}
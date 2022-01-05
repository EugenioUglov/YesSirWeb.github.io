const fileManager = {};

fileManager.saveFile = function(content, file_name, extension = '.txt') {
    console.log(content);
    // Encode spec symbols.
    const encoded_content = encodeURIComponent(content);

    const element = document.createElement('a');
  
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encoded_content);
    element.setAttribute('download', file_name + extension);
  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


// Get text from file.
fileManager.uploadFile = function(onFileLoadedCallback) {
    //let decoded_text_from_file = "";

    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);

    // on file loaded
    function handleFileLoad(event) {
        const text_from_file = event.target.result;
        let fromSymbol = '%';
        let toSymbol = '<percentage>';
        const text_from_file_with_encoded_percentage = textAlgorithm.replaceSymbols(text_from_file, fromSymbol, toSymbol);
        let decoded_text_from_file = decodeURIComponent(text_from_file_with_encoded_percentage);
        
        fromSymbol = '<percentage>';
        toSymbol = '%';
        decoded_text_from_file = textAlgorithm.replaceSymbols(decoded_text_from_file, fromSymbol, toSymbol);
        console.log('decoded_text_from_file', decoded_text_from_file);

        onFileLoadedCallback(decoded_text_from_file);
    }
}
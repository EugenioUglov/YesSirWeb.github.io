const textAlgorithm = {};


// Get array of splited string.
textAlgorithm.splitText = function(string_to_split, separator = ' ') {
    let array = [];
    let splited_text = string_to_split.split(separator);
    
    for(word of splited_text) {
        // if tag not empty.
        if(!!word) {
            array.push(word);
        }
    }
    return array;
}

// Compare text without Case-insensitive (small or large).
// Return value of bool type depends values are same.
// Example: someText === sometext | return true.
textAlgorithm.isSame = function(text1, text2) {
    if (text1.toLowerCase() === text2.toLowerCase()) {
        return true;
    }

    return false;
}

textAlgorithm.getArrayByText = function(text, symbol_split = ',') {
    return text.split(symbol_split);
}

textAlgorithm.getTextInOneLine = function(text) {
    // Delete all lines break in text
    let text_of_textarea = text.replace(/(\r\n|\n|\r)/gm, " ");
    return text_of_textarea;
}

textAlgorithm.getConvertedTextToHTML = function(text) {
    let find = '\n';
    let replace = '<br>';
    return this.replaceSymbols(text, find, replace);
}

textAlgorithm.replaceSymbols = function(text, find, replace) {
    let escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return text.replace(new RegExp(escapedFind, 'g'), replace);
}

textAlgorithm.getLastWord = function(text, symol_before_word = ' ') {
    // Delete spaces from the sides of text.
    text = text.trim();
    var separated_words = text.split(symol_before_word);
    return separated_words[separated_words.length - 1];
}
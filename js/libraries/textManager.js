class TextManager {
    constructor() {

    }

    /** 
     * Get array of splited string.
     * */ 
    splitText = function(string_to_split, separator = ' ') {
        let array = [];
        let splited_text = string_to_split.split(separator);
        
        for(const word of splited_text) {
            // if tag not empty.
            if(!!word) {
                array.push(word);
            }
        }
        return array;
    }

    getCuttedText = function(string, start_symbol, end_symbol) {
        let from;
        let to;
    
        if (start_symbol) from = string.indexOf(start_symbol) + 1;
        else from = 0;
    
        if (end_symbol) to = string.indexOf(end_symbol);
        else to = string.length;
    
        return string.slice(from, to);
    }
    
    // Compare text without Case-insensitive (small or large).
    // Return value of bool type depends values are same.
    // Example: someText === sometext | return true.
    isSame = function(text1, text2) {
        if (text1.toLowerCase() === text2.toLowerCase()) {
            return true;
        }
    
        return false;
    }
    
    getArrayByText = function(text, symbol_split = ',') {
        return text.split(symbol_split);
    }
    
    getTextInOneLine = function(text) {
        // Delete all lines break in text
        let text_of_textarea = text.replace(/(\r\n|\n|\r)/gm, " ");
        return text_of_textarea;
    }
    
    getConvertedTextToHTML = function(text) {
        let find = '\n';
        let replace = '<br>';
        return this.replaceSymbols(text, find, replace);
    }
    
    replaceSymbols = function(text, find, replace) {
        let escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return text.replace(new RegExp(escapedFind, 'g'), replace);
    }

    getTextWithoutLastSymbol(text_to_edit) {
        return text_to_edit.substr(0, text_to_edit.length - 1);
    }
    
    getLastWord = function(text, symol_before_word = ' ') {
        // Delete spaces from the sides of text.
        text = text.trim();
        var separated_words = text.split(symol_before_word);
        return separated_words[separated_words.length - 1];
    }
}
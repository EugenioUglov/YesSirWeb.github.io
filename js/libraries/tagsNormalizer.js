class TagsNormalizer {
    #textManager;


    constructor() {
        this.#textManager = new TextManager();
    }

    getHandledTags(initialTags) {
        let handledTags = [];

        handledTags = this.#getNormalizedTags(initialTags);
       
        handledTags = this.#getNormalizedTags([...handledTags, ...this.#getAdditionalTags(handledTags)]);

        return handledTags;
    }


    #getNormalizedTags(tags) {
        console.log(' tags before normal', tags);
        if (Array.isArray(tags)) {
            tags = tags.toString();
        }

        let normalizedTags;
    
        // Change all new lines to symbol ',".
        const tags_without_new_line = tags.replaceAll('\n', ',');
        //tags_lower_case = tags_without_new_line.toLowerCase();
    
        let tags_array = this.#textManager.getArrayByText(tags_without_new_line);
        
        // Delete empty symbols from sides in text.
        for (const i_tag in tags_array) {
            tags_array[i_tag] = tags_array[i_tag].trim();
        }
    
        // Delete same tags.
        const tags_set = new Set(tags_array);
    
        // Convertation from Set to Array.
        normalizedTags = Array.from(tags_set);

        console.log('tags normal', normalizedTags);
    
        return normalizedTags;
    }

    #getAdditionalTags(tags) {
        console.log('tags', tags);
         if (Array.isArray(tags) === false) {
            tags = this.#textManager.getArrayByText(tags);
        }

        const additionalTags = [];

        for (const tag of tags) {
            let additionalTag = '';

            const tagWithoutSpecialCharacters = this.#textManager.getTextWithoutSpecialCharactes(tag);

            if (tag != tagWithoutSpecialCharacters) {
                additionalTag = tagWithoutSpecialCharacters;
            }

            if (tagWithoutSpecialCharacters === tagWithoutSpecialCharacters.toUpperCase() == false && tagWithoutSpecialCharacters === tagWithoutSpecialCharacters.toLowerCase() === false) {
                const tagWithSeparatedWords = this.#textManager.getSeparatedWordsByCamelCaseString(tagWithoutSpecialCharacters);

                additionalTag = tagWithSeparatedWords;
            }

            if (additionalTag) {
                additionalTags.push(additionalTag);
            }
        }

        console.log('additionalTags', additionalTags);

        return additionalTags;
    }
}
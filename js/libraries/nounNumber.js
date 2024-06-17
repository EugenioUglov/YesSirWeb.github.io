class NounNumber {
  constructor() {}

  async getSingularizedWord(word_to_singularize, onDone, onCatch) {
    console.log("word_to_singularize", word_to_singularize);
    fetch(
      `https://yessirapi.onrender.com/singular?request=` + word_to_singularize
    )
      .then((response) => response.json())
      .then((data) => {
        if (onDone != undefined) onDone(data.response);
      })
      .catch((error) => {
        if (onCatch != undefined) onCatch(error);
      });
  }

  async getSingularizedWords(words_to_singularize, onDone, onCatch) {
    let count_singularized_words = 0;
    const singularized_words = [];

    const getSingularizeWordsPromise = new Promise((resolve, reject) => {
      words_to_singularize.map((word_to_singularize) => {
        this.getSingularizedWord(
          word_to_singularize,
          (singularized_word) => {
            singularized_words.push(singularized_word);
            count_singularized_words++;
            if (count_singularized_words >= words_to_singularize.length) {
              resolve(singularized_words);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });

    getSingularizeWordsPromise.then(
      (singularized_words) => {
        if (onDone != undefined) onDone(singularized_words);
      },
      (error) => {
        if (onCatch != undefined) onCatch(error);
      }
    );
  }
}
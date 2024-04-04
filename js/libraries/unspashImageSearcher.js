/*
    Unsplash API.
    Application ID
    552353

    Access Key
    maGp0hm4AbnLkzSEqQgBVleTNduYW5QDDYZBD4nH9bw

    Secret key
    vCvZsmfavcbap2BqIYCsTfacnKEPrFEZVweVuwtScsQ
*/

class UnsplashImageSearcher {
  #ACCESS_KEY = "maGp0hm4AbnLkzSEqQgBVleTNduYW5QDDYZBD4nH9bw";

  /*
  Returns an image by keyword.
  Prameter "page" is optional.
  Call function example: await getImageFromUnsplashByKeyword("Deep forest");
  */
  async getImageByKeyword(keyword, page, onDone) {
    if (page === undefined) page = 1;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${
      this.#ACCESS_KEY
    }`;

    let first_image = "";

    try {
      const response = await fetch(url);
      const data = await response.json();
      const results = data.results;

      // Returns irst image.
      if (results[0] != undefined) {
        first_image = results[0].urls.small;
      }
    } catch (error) {
      console.log(error);
    }

    if (onDone != undefined) onDone(first_image);

    return first_image;

    // Loop for 10 images.
    // results.map((result) => {
    //   console.log(result.urls.small);
    // });
  }
}

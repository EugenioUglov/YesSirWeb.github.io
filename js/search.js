const search = {};

/// Get index of array to found objects.
search.binarySearchInArrayOfObjectsByTitle = function(arr, title) {
    let left = 0;  // inclusive
    let right = arr.length;  // exclusive
    let found;
    while (left < right) {
        let middle = (left + right) >> 1;
        //console.log(arr[middle]['title']);

        let compareResult = title.toLowerCase() > arr[middle]['title'].toLowerCase() ? 1 : title.toLowerCase() < arr[middle]['title'].toLowerCase() ? -1 : 0;

        //console.log(compareResult);
        if (compareResult > 0) {
            left = middle + 1;
        } else {
            right = middle;
            // We are looking for the lowest index so we can't return immediately.
            found = !compareResult;
        }
    }
    // left is the index if found, or the insertion point otherwise.
    // ~left is a shorthand for -left - 1.
    return found ? left : ~left;
}

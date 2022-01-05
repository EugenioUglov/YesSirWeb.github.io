let search = {};

/// Get index of array to found objects
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

/// Bubble search infoObj.
search.getIndexInfoObjByTitle = function(arr, title) {
    for (const i in arr) {
        let elem_curr = arr[i];
        let title_elem_curr = elem_curr.title;
        if (title_elem_curr.toLowerCase() === title.toLowerCase()) {
            return i;
        }
    }

    return -1;
}



/*
function binaryInsert(array, value) {
let index = binarySearch(array, value);
if (index < 0) {
    array.splice(-(index + 1), 0, value);
    return true;
}
return false;
};

function binarySearch(arr, value) {
let left = 0;  // inclusive
let right = arr.length;  // exclusive
let found;
while (left < right) {
    let middle = (left + right) >> 1;

    let compareResult = value > arr[middle] ? 1 : value < arr[middle] ? -1 : 0;
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
};
*/
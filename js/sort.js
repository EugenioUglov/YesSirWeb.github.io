let sort = {};


// Quick sort O(log n).
// Get sorted array of objects by property.
sort.getSortedArrayOfObjectsByProperty = function(arr_origin, property, is_sort_from_A_to_Z = true) {
    if (arr_origin.length <= 1) {
        return arr_origin;
    }
    else {
        let left = [];
        let right = [];
        let arr_new = [];
        let pivot = arr_origin.pop();
        let length = arr_origin.length;

        for (let i = 0; i < length; i ++) {
            console.log("arr_origin[i]:", arr_origin[i]);
            console.log("pivot:", pivot);
            console.log(arr_origin[i][property] + " <= " + pivot[property]);
            let is_push_to_left_array = false;
            if (is_sort_from_A_to_Z) { 
                is_push_to_left_array = arr_origin[i][property] <= pivot[property]; 
            }
            else { 
                is_push_to_left_array = arr_origin[i][property] > pivot[property]; 
            }

            if (is_push_to_left_array) { 
                left.push(arr_origin[i]);
            }
            else {
                right.push(arr_origin[i]);
            }
        }

        arr_new = arr_new.concat(sort.getSortedArrayOfObjectsByProperty(left), pivot, sort.getSortedArrayOfObjectsByProperty(right));

        console.log("sorted arr", arr_new);
        return arr_new;
    }
}



// Bubble sort O(n^2).
// Get sorted infoObjects by property.
sort.getSortedInfoObjectsByProperty = function(infoObjects, property = "priority") {
    let is_sorting = true;
    while (is_sorting) {
        is_sorting = false;
        for (let i = 0; i < infoObjects.length - 1; i++) {
            let infoObj_curr = infoObjects[i];
            let infoObj_next = infoObjects[i + 1];
            if (infoObj_curr[property] < infoObj_next[property]) {
                infoObjects[i] = infoObj_next;
                infoObjects[i + 1] = infoObj_curr;
                is_sorting = true;
            }
        }
    }
    //console.log("sorted infoObjects:.");
    //console.log(infoObjects);
    return infoObjects;
}



/* 
// .Start (Quick sort recursive)
function partition(arr, start, end) {
    // Taking the last elem as a pivot.
    const pivotValue = arr[end];
    let i_pivot = start;

    for (let i = start; i < end; i++) {
        if (arr[i] < i_pivot) {
            // Swapping elements.
            [arr[i], arr[i_pivot]] = [arr[i_pivot], arr[i]];
            // Moving to next element
            i_pivot++;
        }
    }

    // Putting the pivot value in the middle.
    [arr[i_pivot], arr[end]] = [arr[end], arr[i_pivot]];

    return i_pivot;
}

function quickSortRecursive(arr, start, end) {
    // Base case or terminating case.
    if (start >= end) {
        return;
    }

    // Returns i_pivot
    let index = partition(arr, start, end);

    // Recursively apply the same logic to the left and right subarrays.
    quickSortRecursive(arr, start, index - 1);
    quickSortRecursive(arr, index + 1, end);
}
// .END (Quick sort recursive)
*/


sortObjectsAlphabetic = function(a, b) {
    return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1;
}
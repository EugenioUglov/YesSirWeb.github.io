const arrayAlgorithm = {};

arrayAlgorithm.getSameElementsFromArrays = function(array1, array2) {
    return array1.filter(element => array2.includes(element));
}

arrayAlgorithm.isValueExistsInArray = function(arr, value) {
    for (i_value in arr) {
        let value_curr_arr = arr[i_value];
        
        if (value === value_curr_arr) {
            return true;
        }
    }

    return false;
}
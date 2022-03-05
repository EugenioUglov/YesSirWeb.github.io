const arrayManager = {};

arrayManager.getSameElementsFromArrays = function(array1, array2) {
    return array1.filter(element => array2.includes(element));
}

arrayManager.isValueExistsInArray = function(arr, value) {
    for (const i_value in arr) {
        let value_curr_arr = arr[i_value];
        
        if (value === value_curr_arr) {
            return true;
        }
    }

    return false;
}
class ArrayManager {
    constructor() {

    }

    getSameItemsFromArrays = function(array1, array2) {
        return array1.filter(element => array2.includes(element));
    }

    isValueExistsInArray = function(arr, value_to_search) {
        for (const i_value in arr) {
            let current_value_from_array = arr[i_value];
            
            if (value_to_search === current_value_from_array) {
                return true;
            }
        }

        return false;
    }
}
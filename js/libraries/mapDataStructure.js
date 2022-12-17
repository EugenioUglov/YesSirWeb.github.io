class MapDataStructure {
    constructor() {

    }

    isMap(data_to_check) {
        const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);
        const isDataHasTypeMap = obj => getType(obj) === 'Map';

        const is_map = isDataHasTypeMap(data_to_check);

        return is_map;
    }

    getStringified(map) {
        return JSON.stringify(map, this.#replacer);
    }

    getParsed(map_str) {
        let parsed = {};
        // try {
            parsed = JSON.parse(map_str, this.#reviver);
        // }
        // catch {
        //     map_str = replaceSymbols(map_str, '\n', '\\n');
        //     parsed = JSON.parse(map_str, this.#reviver);
        // }
        
        return JSON.parse(map_str, this.#reviver);

        // function replaceSymbols(text, find, replace) {
        //     let escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        //     return text.replace(new RegExp(escapedFind, 'g'), replace);
        // }
    }

    
    #replacer(key, value) {
        if (value instanceof Map) {
            return {
                _type: "map",
                map: [...value],
            }
        } else return value;
    }
    
    #reviver(key, value) {
        if (value._type == "map") return new Map(value.map);
        else return value;
    }
}
// Map functions: https://stackoverflow.com/questions/63334426/can-i-create-linkedhashmap-in-javascript


class MapDataStructure {
    constructor() {

    }

    getStringified(map) {
        return JSON.stringify(map, this.#replacer);
    }

    getParsed(map_str) {
        return JSON.parse(map_str, this.#reviver);
    }

    
    #replacer (key, value) {
        if (value instanceof Map) {
            return {
                _type: "map",
                map: [...value],
            }
        } else return value;
    }
    
    #reviver (key, value) {
        if (value._type == "map") return new Map(value.map);
        else return value;
    }
}
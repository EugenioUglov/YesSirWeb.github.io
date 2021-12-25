const authorizationDataModel = {};

authorizationDataModel.get = function() {
    let authorizationData;

    try {
        authorizationData = JSON.parse(localStorage["authorization"]);
    }
    catch {
        authorizationData = localStorage["authorization"];
    }

    return authorizationData;
}
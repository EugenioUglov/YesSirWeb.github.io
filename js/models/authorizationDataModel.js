const authorizationDataModel = {};

authorizationDataModel.get = function() {
    let authorizationData;

    try {
        let authorizationData;
        if (localStorage['authorization']) authorizationData = JSON.parse(localStorage['authorization']);
    }
    catch {
        authorizationData = localStorage['authorization'];
    }

    return authorizationData;
}
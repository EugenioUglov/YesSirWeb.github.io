let userId = -1;
const phpAuthorizationPath = "./php/authorization.php";
const phpSetUserDataPath = "./php/setUserData.php";
const phpGetUserDataPath = "./php/getUserData.php";

let dbManager = {};


/*
function onStart() {
    let nickname = "jack5";
    let password = "pass";

    let userObj = JSON.parse(localStorage["user"]);

    //authorization(nickname, password);
    //setUserData(userObj.id, "");
    getUserData(userObj.id);
}
*/

let dbRequestPost = function(path, dataToSend, callBackSuccess, callBackFail) {
    let request = new XMLHttpRequest();
    request.open("POST", path, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function () {
        // IF connection to DB has been completed successfully.
        if (request.status >= 200 && request.status < 400) {
            if (callBackSuccess) callBackSuccess(request);
        }
        else {
            if (callBackFail) { callBackFail(request); }
            else {
                alert("ERROR!!! Data from DB hasn't been loaded");
            }
        }
    }
    
    // Send data to PHP.
    request.send(dataToSend);
}

let dbRequestGet = function(path, callBackSuccess, callBackFail) {
    let requestGET = new XMLHttpRequest();

    // Read file with config
    requestGET.open('GET', path, true);

    requestGET.onload = function() {
        if (requestGET.status >= 200 && requestGET.status < 400) {
            if (callBackSuccess) callBackSuccess(requestGET);
        }
        else {
            if (callBackFail) callBackFail();
            else {
                alert("ERROR! Cannot read data from: " + path);
            }	
        }
    }

    requestGET.onloadend = function() {
        //console.log("request XML end");
    }

    requestGET.send(null);
}



// Login an user. Otherwise register if user doens't exist in DB. 
dbManager.authorization = function(nickname, password, onAuthorization) {
    let messageForPHP = "request=" + "login" + "&nickname=" + nickname + "&password=" + password;

    dbRequestPost(phpAuthorizationPath, messageForPHP, onLogin);

    function onLogin(request) {
        console.log("request.responseText", request.responseText);
        // Inforamtion about connection to DB. message(logabout db status), access(login success), id
        let data_from_DB;
        try { 
            data_from_DB = JSON.parse(request.responseText);
        }
        catch {
            alert("ERROR! Connection with Database has been canceled");
            onAuthorization(null);
            return;
        }

        console.log(request.responseText);
        console.log(data_from_DB);

        // IF user exists in DB THEN login ELSE propose to register.
        if (data_from_DB.id > 0) {
            // Login

            console.log(data_from_DB.message);
            
            // IF user loggined successfully THEN save data in localstorage ELSE show error.
            if (data_from_DB.access) {
                //model.localStorage.authorization.set(nickname, password, data_from_DB.id);
                console.log("Login complete");
            }
            else {
                console.log(data_from_DB.message);
                alert(data_from_DB.message);
            }
            onAuthorization(data_from_DB);
        }
        else {
            // Registration

            let isUserChooseRegister = confirm("User with this nickaname: " + nickname + " doesn't exist in DB.\nDo you want to register with current data?");
            
            if (isUserChooseRegister) {
                let messageForPHP = "request=" + "registration" + "&nickname=" + nickname + "&password=" + password;
                dbRequestPost(phpAuthorizationPath, messageForPHP, onRegistration);

                function onRegistration(request) {
                    data_from_DB = JSON.parse(request.responseText);

                    // IF user logged successfully THEN save data in localstorage ELSE show error.
                    if (data_from_DB.access) {
                        //model.localStorage.authorization.set(nickname, password, data_from_DB.id);
                       // infoBlockModel.saveToDatabase(onSetInfoObjectsToDB);
                    }

                    alert(data_from_DB.message);
                    
                    onAuthorization(data_from_DB);
                }
            }
            // Cancel registration
            else {
                onAuthorization(null);
            }
        }
   
    }
}

dbManager.setUserData = function(userId, dataToPost, onUpdatedUserData) {
    if ( ! userId || userId < 0) {
        alert("ERROR!!! Not possible upload user data to DB user id is undefined");
        
        return false;
    }
    
    
    let messageForPHP = "request=" + "setUserData" + "&userId=" + userId + "&userDataToPost=" + encodeURIComponent(dataToPost);//data;

    dbRequestPost(phpSetUserDataPath, messageForPHP, onUpdatedUserData);

    logsManager.addHTML("Post to db: " + messageForPHP); 

    /*
    function onUpdatedUserData(data_from_DB) {
        //console.log(data_from_DB.responseText);
    }
    */

    return true;
}

dbManager.getUserData = function(userId, onGetUserData) {
    if ( ! userId || userId < 0) {
        alert("ERROR!!! Not possible upload user data to DB. User id is undefined");
        return false;
    }


    let path = phpGetUserDataPath;
    let requestsForPHP = "request=" + "getUserData" + "&userId=" + userId;
    
    if (requestsForPHP) { 
        path += "?" + requestsForPHP;
        console.log(path); 
    }

    logsManager.addHTML("Get from db: " + requestsForPHP); 

    dbRequestGet(path, onGetMessageFromPHP);
    function onGetMessageFromPHP(data_from_DB) {
        console.log("data_from_DB", data_from_DB);
        let dbData;
        try {
            dbData = JSON.parse(data_from_DB.responseText);
        }
        catch (exception) {
            alert("Error! Unable to retrieve data from the server");
            console.log(exception);
            return;
        }

        console.log(dbData);
        logsManager.addHTML("Data from db: " + data_from_DB.responseText); 
        onGetUserData(dbData);
    }

    return true;
}

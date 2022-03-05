class DBManager {
    constructor() {

    }

    #phpAuthorizationPath = './php/authorization.php';
    #phpSetUserDataPath =   './php/setUserData.php';
    #phpGetUserDataPath =   './php/getUserData.php';


    // Login an user. Otherwise register if user doens't exist in DB.
    authorization(nickname, password, onAuthorization, onFailAuthorization) {
        const that = this;

        const messageForPHP = "request=" + "login" + "&nickname=" + nickname + "&password=" + password;

        console.log('auth');
    
        this.#dbRequestPost(this.#phpAuthorizationPath, messageForPHP, onLogin, onFail);
    
        function onLogin(request) {
            // Inforamtion about connection to DB. message(logabout db status), access(login success), id.
            let data_from_DB;

            try { 
                data_from_DB = JSON.parse(request.responseText);
            }
            catch {
                alert("ERROR! Connection with Database has been canceled");
                onAuthorization(null);
                return;
            }

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
                // Registration.
    
                let isUserChooseRegister = confirm("User with nickaname: " + nickname + " doesn't exist in DB.\nDo you want to register with current data?");
                
                if (isUserChooseRegister) {
                    let messageForPHP = "request=" + "registration" + "&nickname=" + nickname + "&password=" + password;
                    that.#dbRequestPost(that.#phpAuthorizationPath, messageForPHP, onRegistration);
    
                    function onRegistration(request) {
                        data_from_DB = JSON.parse(request.responseText);
                        
                        alert(data_from_DB.message);
                        
                        onAuthorization(data_from_DB);
                    }
                }
                // Cancel registration.
                else {
                    onAuthorization(null);
                }
            }
       
        }

        function onFail() {
            onFailAuthorization();
        }
    }

    getUserData(userId, onGetUserData) {
        if ( ! userId || userId < 0) {
            alert('ERROR! Not possible get user data from database. User id is undefined');
            return false;
        }
    
    
        let path = this.#phpGetUserDataPath;
        const requestsForPHP = 'request=' + 'getUserData' + '&userId=' + userId;
        
        if (requestsForPHP) { 
            path += '?' + requestsForPHP;
        }
    
    
        this.#dbRequestGet(path, onGetMessageFromPHP);

        function onGetMessageFromPHP(data_from_DB) {
            let dbData;

            try {
                dbData = JSON.parse(data_from_DB.responseText);
            }
            catch (exception) {
                alert('Error! Unable to retrieve data from the server');
                console.log(exception);
                return;
            }
    
            onGetUserData(dbData);
        }
    
        return true;
    }

    setUserData(userId, dataToPost, onUpdatedUserData, callBackFail) {
        if ( ! userId || userId < 0) {
            alert('ERROR! Not possible sent user data to database. User id is undefined');
            
            return false;
        }
        
        
        const request = 'request=' + 'setUserData' + '&userId=' + userId + '&userDataToPost=' + encodeURIComponent(dataToPost);
    
        console.log('setUserData');
        this.#dbRequestPost(this.#phpSetUserDataPath, request, onUpdatedUserData, callBackFail);
    
        return true;
    }


    #dbRequestPost(path, dataToSend, callBackSuccess, callBackFail) {
        const request = new XMLHttpRequest();
        console.log('post request')

        request.open('POST', path, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
        request.onload = function () {
            // IF connection to DB has been completed successfully.
            if (request.status >= 200 && request.status < 400) {
                if (callBackSuccess) callBackSuccess(request);
            }
            else {
                if (callBackFail) callBackFail(request); 
                else {
                    alert('Responce from server: ERROR! Data hasn\'t been sent to database');
                }
            }
        }

        request.onerror = function() {
            if (callBackFail) callBackFail(request); 
            else {
                alert('ERROR! Data hasn\'t been sent to database');
            }
        }
        
        // Send data to PHP.
        request.send(dataToSend);
    }

    #dbRequestGet(path, callBackSuccess, callBackFail) {
        const requestGET = new XMLHttpRequest();
    
        // Read file with config.
        requestGET.open('GET', path, true);
    
        requestGET.onload = function() {
            if (requestGET.status >= 200 && requestGET.status < 400) {
                if (callBackSuccess) callBackSuccess(requestGET);
            }
            else {
                if (callBackFail) callBackFail();
                else {
                    alert('ERROR! Cannot read data from: ' + path);
                }	
            }
        }

        requestGET.onerror = function() {
            alert('Problem on get data from database');
        }
    
        requestGET.onloadend = function() {
            //console.log("request XML end");
        }
    
        requestGET.send(null);
    }
}
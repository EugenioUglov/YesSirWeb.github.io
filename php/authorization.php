<?php
    // Set type of sending data in JSON.
    header('Content-Type: application/json');


    // Adres of the server. 
    $host = 'localhost'; 
    // Name of database.
    $database = 'id14941625_fastsearch_basename';
    // Name of user.
    $user_DB = 'id14941625_eugenio_username'; 
    // Password.
    $password_DB = 'FCG+q9I8az{-Dgz#'; 

    $conn = mysqli_connect($host, $user_DB, $password_DB, $database);

    // Check connection.
    if ( ! $conn) {
        SendResponceToJs("Connection failed");
        die("Connection failed: " . mysqli_connect_error());
    }

    $connectInfo = "Connected to DB successfully";

    $dataFromJS = $_POST;

    // .START (Set default data for messageForJs)
    $messageForJs["message"] = "ERROR!";
    $messageForJs["access"] = false;
    $messageForJs["id"] = -1;
    // .END (Set default data for messageForJs))

    // Get nickname from JS.
    $nickname = $dataFromJS["nickname"];
    // Get password from JS.
    $password = $dataFromJS["password"];
    $table = 'users_info';

    // Request for authorization.
    if ($dataFromJS["request"] == "login") {
        $userExistsInDB = IsUserExistsInDBByNickname($nickname, $table, $conn);
        
        // IF user with nickname already exists THEN login.
        if ($userExistsInDB) {
            $messageForJs = LoginUser($nickname, $password, $conn);
        }
        else {
            $messageForJs["message"] = "User doesn't exist in DB";
        }
    }

    else if ($dataFromJS["request"] == "registration") {
        $messageForJs = RegisterUser($nickname, $password, $conn);
    }

    SendResponceToJs($messageForJs, $conn);

    function RegisterUser($nickname, $password, $conn) {
        // Insert user login data to DB.
        $query = "INSERT INTO users_info(nickname, password, user_data)
        VALUES('$nickname', '$password', '')";

        // Execute insert(registration user) query.
        $result = mysqli_query($conn, $query) or die("Error " . mysqli_error($conn)); 

        if ($result) {
            $messageForJs["message"] = "Registration has been finished successfully";
            $messageForJs["access"] = true;
            // Get id registered user.
            $messageForJs["id"] = mysqli_insert_id($conn);
        }
        else {
            $messageForJs["message"] = "ERROR! Connection failed";
        }

        return $messageForJs;
    }

    function LoginUser($nickname, $password, $conn) {
        $table = 'users_info';
        // .START (Set default settings for return)
        $messageForJs["message"] = "ERROR! Uncorrect data";
        $messageForJs["access"] = false;
        $messageForJs["id"] = -1;
        // .END (Set default settings for return)

        // IF data with nickname of user exists.
        if ($result = mysqli_query($conn, "SELECT * FROM `$table` WHERE `nickname` = '$nickname'")) {
            $rowDB = mysqli_fetch_array($result);
           
            $passDB = $rowDB["password"];
            $messageForJs["id"] = $rowDB["id"];

            // Count rows.
            $row_cnt = $result->num_rows;
           
            $result->close();
        }
        else {
        }

        // If rows with user nickanme > 0 THEN check password which user paste.
        if ($row_cnt > 0) {
            if ($passDB == $password) {
                $messageForJs["message"] = "Login has been finished successfully";
                $messageForJs["access"] = true;
            }
            else {
                $messageForJs["message"] = "Uncorrect password!";
            }
        }
        else {
            $messageForJs["message"] = "User doens't exist in DB!";
        }

        return $messageForJs;
    }

    // Send message to JS.
    function SendResponceToJs($messageForJs, $conn) {
        // Close connection.
        $conn->close();
        // Send data.
        echo json_encode($messageForJs);
    }

    function IsUserExistsInDBByNickname($nickname, $table, $conn) {
        if ($result = $conn->query("SELECT `nickname` FROM `$table` WHERE `nickname` = '$nickname'")) {
            // Number of rows.
            $row_cnt = $result->num_rows;
            $result->close();
            
            if ($row_cnt > 0) return true;
        }

        return false;
    }
?>


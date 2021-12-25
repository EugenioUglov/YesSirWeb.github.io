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

    $dataFromJS = $_GET;
    $userId = $dataFromJS['userId'];
        
    if ($dataFromJS['request'] == "getUserData")
    {
        $query = "SELECT user_data FROM users_info WHERE id=".$userId;

        // Execute insert(registration user) query
        $result = mysqli_query($conn, $query) or die("Ошибка " . mysqli_error($conn)); 


        if ($result->num_rows > 0) {
            // Output data from each row from SELECT request. 

            while ($row = $result->fetch_assoc()) {
                $dataFromDB['user_data'] = $row['user_data'];
                echo json_encode($dataFromDB);
            }
        } else {
            echo "null";
        }
        
    }

    
    $conn->close();

    function MakeValue($oldValue) {
        $newValue = "'".$oldValue."'";
        return $newValue;
    }
?>
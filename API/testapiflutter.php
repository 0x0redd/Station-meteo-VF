<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
// Create connection
$con = mysqli_connect('localhost', 'root', '', 'moisture_base');

// Check connection
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

// Check the request method
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Fetch data from the table
    $sql = "SELECT * FROM soil_humitemp_table";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        // Store the data in an array
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Return the JSON response
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo "No data found";
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $moisture = $_POST["moisture"];
    $temperature = $_POST["temperature"];

    // Escape the values to prevent SQL injection
    $moisture = mysqli_real_escape_string($con, $moisture);
    $temperature = mysqli_real_escape_string($con, $temperature);

    $sql = "INSERT INTO soil_humitemp_table (val_humi, val_temp) VALUES ('$moisture', '$temperature')";

    if ($con->query($sql) === TRUE) {
        echo "Data stored successfully";
    } else {
        echo "Error storing data: " . $con->error;
    }
}

$con->close();
?>

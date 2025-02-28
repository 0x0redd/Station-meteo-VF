<?php

$con = mysqli_connect('localhost', 'root', '', 'ht_data_test');

$filename = "C:\\Users\\smart asus\\OneDrive\\Documents\\GitHub\\Weather_Station\\HumiTemp\\htdata.json";

$data = file_get_contents($filename);

$array = json_decode($data, true);
// echo "<pre>";
// print_r($array);
// echo "</pre>";


foreach ($array as $value) {

    $query = "INSERT INTO `ht_table_test` (`id`, `Humidity`, `Temperature`) VALUES ('" . $value['id'] . "', '" . $value['Humidity'] . "', '" . $value['Temperature'] . "')";

    mysqli_query($con, $query);
}

echo "Data Inserted Successfully";

?>

<?php
//
// echo($_SESSION['name']);
// echo "<br>" . $contains . "<br>";
// echo $column_name . "<br>";


if(!isset($_SESSION['name'])) {
  header('Location: login.php');
  exit();
}

// //create connection
// echo $db_servername . '<br>';
// echo $db_username . '<br>';
// echo $db_password . '<br>';
// echo $db_name . '<br>';
// echo $db_port . '<br>';

$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// echo '<br> connected' . '<br>';

if(!empty($contains)){
  // echo "not empty <br>";
  $sql = "SELECT * FROM tbl_events WHERE `$column_name` LIKE '%$contains%'";
}else{
  // echo "empty <br>";
  $sql = "SELECT * FROM tbl_events";
}
// echo $sql . '<br>';

$result = $conn->query($sql);

if ($result->num_rows > 0) {
// print_r($result);
    while($row = $result->fetch_assoc()){
      echo "<tr>";
        echo "<th scope='col'>" . $row['event_name'] . "</th>";
        echo "<th scope='col'>" . $row['event_location'] . "</th>";
        echo "<th scope='col'>" . $row['event_day'] . "</th>";
        echo "<th scope='col'>" . $row['event_start_time'] . "</th>";
        echo "<th scope='col'>" . $row['event_end_time'] . "</th>";
      echo "<tr>";
    }
  }
  $result->close();
  $conn->close();
?>

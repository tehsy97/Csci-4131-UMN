<?php
//get data from the form
$username = $_POST['uname'];
$password = base64_encode(hash("sha256", $_POST['psw'], True));
$error = False;

include_once 'database.php';

if(isset($username)){
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
//
// echo 'connected' . '<br>';
// echo $username . '<br>';
// echo gettype($username);
$sql = "SELECT * FROM tbl_accounts WHERE acc_login= '$username'";

$result = $conn->query($sql);
// echo 'hi' . "<br>";
// printf("%s <br>", $password);
// $row_cnt = $result->num_rows;
// printf("row number: %d \n", $row_cnt);

if ($result->num_rows > 0) {
// echo 'row' . '<br>';
// print_r($result);
    $row = $result->fetch_assoc();
    //
    // print_r($row);
    // print_r($row["acc_password"]);
    // echo "<br>";
    // print_r($row["acc_name"]);
    // echo "<br>";

    if(($row["acc_password"]) === $password){

        $_SESSION['name'] = $row["acc_name"];
        // echo $_SESSION['name'];
        $result->close();
        $conn->close();
        header('Location: events.php');
        exit();
    }
}
$error = True;
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
    <!-- http://www-users.cselabs.umn.edu/~teh00001/login.php -->
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

        <link rel="stylesheet" type="text/css" href="style.css">
        <title>Login Page</title>

        <style>
            body {font-family: Arial, Helvetica, sans-serif;}
            form {margin-top: 5%;}

            input[type=text], input[type=password] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border-style: solid #ccc;
            box-sizing: border-box;
            }

            .container {
            padding: 16px;
            }
            </style>
    </head>
    <body>
        <div class="jumbotron" style="background: DarkSeaGreen !important">
            <h2 style="text-align: center">Login Page</h2>
            <p style="font-size:11pt"> Please enter your user name and password. Both are case sensitive.</p>
        </div>

        <div id="showerror" style="color: red; text-align: center"><?php if($error) echo "Invalid username or password" ?></div>
        <form action="login.php" method="post" name="login">
        <div class="container">
            <label for="uname"><b>User:</b></label>
            <input type="text" placeholder="Enter Username" name="uname" required>

            <label for="psw"><b>Password:</b></label>
            <input type="password" placeholder="Enter Password" name="psw" required>

            <button type="submit" class="btn btn-primary btn-block">Login</button>
        </div>
        </form>
    </body>
</html>

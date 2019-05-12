<?php
session_start();

//display all php errors and warning
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$xml=simplexml_load_file("dbconfig.xml") or die ("Error: cannot create object");
$db_servername = $xml->host;
$db_username = $xml->user;
$db_password = $xml->password;
$db_name = $xml->database;
$db_port = $xml->port;
?>

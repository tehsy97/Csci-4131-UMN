<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    />
    <link rel="stylesheet" href="style.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>


  </head>
  <body>
    <nav class="navbar nav-default">
      <div class="container-fluid">
        <ul class="nav navbar-nav">
          <li>
            <a href="events.php"><b>Events Page</b></a>
          </li>
          <li>
            <a href="logout.php" >
              <span class="glyphicon glyphicon-log-out"></span>
            </a>
          </li>
        </ul>
        <p id="displayName">
          <?php

            //get data from the forms
            $column_name = $_GET['column_name'];
            $contains = $_GET['contains'];
            $contains = trim($contains);
            include_once 'database.php';
            echo "Welcome " . $_SESSION['name'];
          ?>
        </p>
      </div>
    </nav>
    <br /><br />
    <div class="container">
      <table class="table" id="scheduleTable">
        <thead>
          <tr>
            <th scope="col">Event Name</th>
            <th scope="col">Location</th>
            <th scope="col">Day of Week</th>
            <th scope="col">Start-Time</th>
            <th scope="col">End-Time</th>
          </tr>

          <?php include 'loadevents.php'?>

        </thead>
        <tbody></tbody>
      </table>
    </div>
    <br>
    <form action="events.php" method="get" name="filter">
    <div class="container">
      <p style="float:left">Column Name:</p>
        <select name="column_name">
          <option value="event_name">Event</option>
          <option value="event_location">Location</option>
          <option value="event_day">Day</option>
          <option value="event_start_time">Start-Time</option>
          <option value="event_end_time">End-Time</option>
        </select>
        <br>
        <br>
        <label for="contains"><b>Contains:</b></label>
        <input type="text" placeholder="Enter keyword" name="contains">
        <button type="submit" class="btn btn-primary btn-block">Filter</button>
    </div>
    </form>

    <script text="text/javescript" src="/client/js/getListOfEvents.js">
      // //TODO : Fetch schedule.json data from the server and display it in the scheduleTable
    </script>
    <script text="text/javescript" src="/client/js/displayUser.js"> </script>
  </body>
</html>

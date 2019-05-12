var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", "/getListOfEvents", true);
      xmlhttp.send();
      xmlhttp.onreadystatechange = function() {
        var state = xmlhttp.readyState;
        var status = xmlhttp.status;
        if (state == 4 && status == 200) {
          var myscheduleObj = JSON.parse(xmlhttp.responseText);
          var tablestr = "";
          tablestr = document.getElementById("scheduleTable").innerHTML;
          var i;
          for (i = 0; i < myscheduleObj.length; i++) {
            tablestr +=
              "<tr><td>" +
              myscheduleObj[i].event_name +
              "</td><td>" +
              myscheduleObj[i].event_location +
              "</td><td>" +
              myscheduleObj[i].event_day +
              "</td><td>" +
              myscheduleObj[i].event_start_time +
              "</td><td>" +
              myscheduleObj[i].event_end_time +
              "</td></tr>";
          }
          document.getElementById("scheduleTable").innerHTML = tablestr;
         }
      };
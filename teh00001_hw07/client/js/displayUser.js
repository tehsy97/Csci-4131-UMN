var xmlhr = new XMLHttpRequest();
      xmlhr.open("GET", "displayUsername", true);
      xmlhr.send();
      xmlhr.onreadystatechange = function() {
        var state = xmlhr.readyState;
        var status = xmlhr.status;
        if (state == 4 && status == 200) {
          document.getElementById("displayName").innerHTML = "Welcome, " + this.responseText;
        }
      };

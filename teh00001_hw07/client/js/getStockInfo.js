function showStock() {
    var stockName = document.getElementById("Company").value;
    console.log(stockName);
    var xmlhttp = new XMLHttpRequest();
    var url =
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
      stockName +
      "&apikey=SDJ07B5NUY4TN429";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
      var state = xmlhttp.readyState;
      var status = xmlhttp.status;

      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var stockObj = JSON.parse(xmlhttp.responseText);
        document.getElementById("stockMetaData").innerHTML =
          "<pre>" +
          JSON.stringify(stockObj["Meta Data"], null, 2) +
          "</pre>";
        document.getElementById("stockData").innerHTML =
          "<pre>" +
          JSON.stringify(stockObj["Time Series (Daily)"], null, 2) +
          "</pre>";
      }
    }
  }
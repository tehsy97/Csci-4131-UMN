var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "/getListOfUsers", true);
xmlhttp.send();
xmlhttp.onreadystatechange = function () {
    var state = xmlhttp.readyState;
    var status = xmlhttp.status;
    if (state == 4 && status == 200) {
        var myuserObj = JSON.parse(xmlhttp.responseText);
        var tablestr = "";
        tablestr = document.getElementById("adminTable").innerHTML;
        var i;
        for (i = 0; i < myuserObj.length; i++) {
            tablestr +=
                `<tr id="row-${myuserObj[i].acc_login}">
                    <td>${myuserObj[i].acc_id}</td>
                    <td>${myuserObj[i].acc_name}</td>
                    <td>${myuserObj[i].acc_login}</td>
                    <td></td>
                    <td>
                        <a href = "#" onclick="editUser('${myuserObj[i].acc_login}')">
                        <span class="glyphicon glyphicon-pencil"></span>
                        </a> 
                        <a href="#" onclick="deleteUser('${myuserObj[i].acc_login}')">
                            <span class="glyphicon glyphicon-trash"></span>
                        </a>
                    </td>
                </tr>`;
        }
        document.getElementById("adminTable").innerHTML = tablestr;
    }
};

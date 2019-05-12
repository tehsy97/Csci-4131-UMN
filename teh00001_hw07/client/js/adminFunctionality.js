function clearError() {
    $("#error").text("");
}

function newUser() {
    console.log("newuser");
    clearError();
    if (!document.getElementById('newUserRow')) {
        $("#adminTable").append(
            `<tr id="newUserRow"><td></td>
              <td><input type='text' id='newUsername'/></td>
              <td><input type='text' id='newLogin'/></td>
              <td><input type='text' id='newPassword'/></td>
              <td>
              <a href ="#" onclick="addNewUser()">
                <span class="glyphicon glyphicon-floppy-save"></span>
              </a> 
              <a href="#" onclick="cancelAddNew()">
              <span class="glyphicon glyphicon-remove"></span>
              </a>
              </td>
              </tr>`
        );
    }
}

function cancelAddNew() {
    console.log("cancel");
    clearError();
    $('#newUserRow').detach();
}

function addNewUser() {
    clearError();
    console.log("addnew");
    $.ajax({
        url: '/addUser',
        type: 'post',
        data: { uname: $('#newUsername').val(), login: $('#newLogin').val(), psw: $('#newPassword').val() },
        statusCode: {
            200: function (data, textStatus, jqXHR) {
                window.location.reload();
            },
            500: function (jqXHR, textStatus, errorThrow) {
                $('#error').html("<span style='color: red;'>User already exist</span>");
            },
            401: function () {
                $('#error').html("<span style='color: red;'>User login info is empty</span>");
            }
        }
    });
}

function deleteUser(login) {
    clearError();
    console.log("deleteUser");
    $.ajax({
        url: '/deleteUser',
        type: 'delete',
        data: { login: login },
        statusCode: {
            200: function (data, textStatus, jqXHR) {
                window.location.reload();
            },
            401: function (jqXHR, textStatus, errorThrow) {
                $('#error').html("<span style='color: red;'></span>");
            }
        }
    });
}

function editUser(login){
    clearError();
    console.log("edituser");
    var userRow = document.getElementById(`row-${login}`)
    console.log(userRow);
    var userID = userRow.firstElementChild.innerHTML;
    var userName_old = userRow.firstElementChild.nextElementSibling.innerHTML;
    var userLogin_old= userRow.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
    console.log(userLogin_old);
    console.log(userName_old);

    userRow.innerHTML=
        `<td id='userID'>${userID}</td>
              <td><input type='text' id='newUsername' value='${userName_old}'/></td>
              <td><input type='text' id='newLogin' value='${userLogin_old}'/></td>
              <td><input type='text' id='newPassword'/></td>
              <td>
              <a href ="#" onclick="updateUser('${userID}')">
                <span class="glyphicon glyphicon-floppy-save"></span>
              </a> 
              <a href="#" onclick="location.href ='/admin'">
              <span class="glyphicon glyphicon-remove"></span>
              </a>
              </td>`;
}

function updateUser(userID){
    $.ajax({
        url: '/editUser',
        type: 'post',
        data: {userID: userID, uname: $('#newUsername').val(), login: $('#newLogin').val(), psw: $('#newPassword').val()},
        statusCode: {
            200: function (data, textStatus, jqXHR) {
                window.location.reload();
            },
            500: function (jqXHR, textStatus, errorThrow) {
                $('#error').html("<span style='color: red;'>This login is used by another user</span>");
            }
        }
    });
}

// $("form").submit(function(e){
//     e.preventDefault();
//     $.ajax({
//       url: '/sendLoginDetails',
//       type: 'post',
//       data: $('form').serialize(),
//       statusCode:{
//         200: function(){
//           window.location.href = '/schedule';
//         },
//         401: function(){
//           $('#showerror').html("<span style='color: red;'>Invalid username or password</span>");
//         }
//       }
//     });
//   })

// var xmlhttp = new XMLHttpRequest();
// xmlhttp.open("GET", "/getListOfUsers", true);
// xmlhttp.send();
// xmlhttp.onreadystatechange = function() {
//   var state = xmlhttp.readyState;
//   var status = xmlhttp.status;
//   if (state == 4 && status == 200) {
//     var myuserObj = JSON.parse(xmlhttp.responseText);
//     var tablestr = "";
//     tablestr = document.getElementById("adminTable").innerHTML;
//     var i;
//     for (i = 0; i < myuserObj.length; i++) {
//       tablestr +=
//       `<tr id="row-${myuserObj[i].acc_login}"><td>${myuserObj[i].acc_id}</td>
//       <td>${myuserObj[i].acc_name}</td>
//       <td>${myuserObj[i].acc_login}</td>
//       <td></td>
//       <td>
//       <a href = "#" onclick="editUser('${myuserObj[i].acc_login}')">
//         <span class="glyphicon glyphicon-pencil"></span>
//       </a>
//       <a href="#" onclick="deleteUser('${myuserObj[i].acc_login}')">
//       <span class="glyphicon glyphicon-trash"></span>
//       </a>
//       </td>
//       </tr>`
//     }
//     document.getElementById("adminTable").innerHTML = tablestr;
//    }
// };
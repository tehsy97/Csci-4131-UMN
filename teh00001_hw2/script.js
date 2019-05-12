function showBigPic(srcs, alts) {
  bigpic = document.getElementById("big");
  bigpic.src = srcs;
  bigpic.alt = alts;
}

function textValidator() {
  var letters = /^[0-9a-zA-Z ]+$/;
  var ename = document.forms["myForm"]["eventname"].value;
  var elocation = document.forms["myForm"]["eventlocation"].value;
  if (!ename.match(letters) && !elocation.match(letters)) {
    alert("Event Name and Location must be alphanumeric");
    return false;
  } else if (!elocation.match(letters)) {
    alert("Event Location must be alphanumeric");
    return false;
  } else if (!ename.match(letters)) {
    alert("Event Name must be alphanumeric");
    return false;
  }
}

function checkstrength() {
  var pwd = document.getElementById("password").value;
  var bar = document.getElementById("strength");
  var r = document.getElementById("result");
  var strength = 0;

  if (pwd.length <= 6 && pwd.length > 0) {
    bar.value = 1;
    r.className = '';
    r.classList.add('short');
    r.innerHTML = 'Short';
  } else if (pwd.length >= 7) {
    strength += 1;
    // If password contains both lower and uppercase characters, increase strength value.
    if (pwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 1;
    }
    // If it has numbers and characters, increase strength value.
    if (pwd.match(/([a-zA-Z])/) && pwd.match(/([0-9])/)) strength += 1
    // If it has one special character, increase strength value.
    if (pwd.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    // If it has two special characters, increase strength value.
    if (pwd.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength < 2) {
      bar.value = 2;
      r.className = '';
      r.classList.add('weak');
      r.innerHTML = 'Weak';
    } else if (strength == 2) {
      bar.value = 3;
      r.className = '';
      r.classList.add('good');
      r.innerHTML = 'Good';
    } else {
      bar.value = 5;
      r.className = '';
      r.classList.add('strong');
      r.innerHTML = 'Strong';
    }
  } else {
    bar.value = 0;
    r.innerHTML = '&nbsp';
  }


}

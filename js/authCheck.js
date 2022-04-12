var ajax = new XMLHttpRequest();
ajax.onreadystatechange = function() {
    if (ajax.readyState == 4) {
        if (ajax.status == 200 || ajax.status == 304) { 
        	if(ajax.response == 0) {
	          document.getElementById('userMenu').classList.add("hide");
	          document.getElementById('noLogin').classList.remove("hide"); 
	          document.getElementById('noLoginM').classList.remove("hide");        		
        	} else {
	          var obj = JSON.parse(ajax.response); 
	          document.getElementById('userName').innerHTML=obj.userName;
	          if(obj.userPhoto == false) { 
	          	document.getElementById('userMenu').getElementsByClassName('s-header-user-logo')[0].className = "s-header-user-logo noIcon"; 
	          	// document.getElementById('userAvatar').src='/img/icon-user.svg';
	          } else { document.getElementById('userAvatar').src=obj.userPhoto; }
	          document.getElementById('userMenu').classList.remove("hide");
	          document.getElementById('noLogin').classList.add("hide");
	          document.getElementById('noLoginM').classList.add("hide");
	        }
        } else {
          document.getElementById('userMenu').classList.add("hide");
          document.getElementById('noLogin').classList.remove("hide");
          document.getElementById('noLoginM').classList.remove("hide"); 
        }

    }
}

ajax.open('POST', '/ajax.php', true);
ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
ajax.send('action=authCheck');

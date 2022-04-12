function getParams() {
	try {
		var json={action:"write-utm",'raw':location.search};
		if(json.raw == undefined || json.raw == '') { return; } 
		if(document.referrer) { json.referrer = document.referrer; }
		$.post("/ajax.php",json,function(data){ console.log(data); });
		return;
	} catch(e) { console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack); }
}

$(document).ready(function(){ getParams(); });
$(document).ready(function(){ 
	$('.s-pay-all a').click(function(e){ e.preventDefault();
		createPayment();
	});

	$('.s-pay .s-pay-more-item').click(function(e){ e.preventDefault();
		var paymentMethod = $(this).attr('data-type');
		if(paymentMethod == "" || paymentMethod == undefined) { return false; }
		createPayment(paymentMethod);
	});

});

function createPayment(paymentMethod){ 
	var json = {'action':'createPayment','type':'redirect','id':$('#payment-form').attr('data-id'),'return_url':window.location.href};
	if(paymentMethod !== undefined) { json.paymentMethod = paymentMethod; }
	console.log(json);
	$.post('/include/yandex-kassa/ya-ajax.php',json,function(data){ console.log(data);
	    if(isJson(data)===false) { return false; }
	    data = JSON.parse(data);
	    console.log(data);
	    if(data.status == 'pending') { window.location.href = data.confirmation_url; }
	});
}

function renderForm(id,save) {
	$.post('/ajax.php',{'action':'checkIp'},function (data){
		console.log(data);
	});
	let rf = $('#payment-form'), ssb = $('#serviceSubscriptionButton'), pt = $('#paymentTarif');
	if(rf.hasClass('loading')) { setTimeout(function(){ renderForm(id,save); },200); return; }
	ssb.attr('disabled','disabled');
	pt.attr('disabled','disabled');
	rf.removeClass('loading').addClass('loading');//.html('<img src="/images/loader-big.gif" class="loader">');


	if(rf.attr('data-id')) { id1 = Number(rf.attr('data-id')); if(id1 !== NaN && id1 > 1) { id = id1; } }
	updateServiceSubscriptionButton(save);
	$.post('/include/yandex-kassa/ya-ajax.php',
		{'action':'createPayment','id':id,'save':save,'return_url':window.location.href},
		function (data) {
			// console.log(data);
			if (isJson(data) === false) {return false;}
			data = JSON.parse(data);
			// console.log(data);
			const checkout = new window.YandexCheckout({
				confirmation_token: data.confirmation_token, //Токен, который перед проведением оплаты нужно получить от Яндекс.Кассы
				return_url: window.location.origin + window.location.pathname, //Ссылка на страницу завершения оплаты
				error_callback: function error_callback(error) {
					//Обработка ошибок инициализации
					console.log(error);
				}
			});
	    rf.html('');
	    checkout.render('payment-form');
	    $('#payment-form iframe').css('width',0);
	    $('#payment-form iframe').load(function(){
	    	// $('#payment-form .loader').css('display','none');
	    	$('#payment-form iframe').css('width','100%');
	    	rf.removeClass('loading');
	    	ssb.removeAttr('disabled');
	    	pt.removeAttr('disabled');
	    });
	});
}

function updateServiceSubscriptionButton(save) {
	if(save == 1) { $('#serviceSubscriptionButton').prop('checked',true); } else { $('#serviceSubscriptionButton').prop('checked',false); }
	
}

function isJson(str) { try { JSON.parse(str); } catch (e) { return false; } return true; }
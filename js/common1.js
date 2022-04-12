"use strict";
$(document).ready(function(){ 

	$('#serviceSubscriptionButton').click(function(){
		let save = 0; if($(this).prop('checked') === true) { save = 1; }
		renderForm(1,save);
	});

	$('.modalLink[data-modal="#paymentWindow"]').click(function(e){
		e.preventDefault();
		goal('checkout init buy');
		selectStep(2);
	});

	$('.s-plan-top-list.mobile .icon').click(function(){
		var nextStep = $('.s-plan-top-list.mobile .text span').html() - 1;
		if(nextStep < 2) { closeModal(); return false; }
		selectStep(nextStep);
	});

	$('ul.s-plan-top-list').not('.mobile').find('li').click(function(){
		var step = $(this).attr('data-step');
		//console.log(step);
		if(step >= 3) { return;} 
		if(step <= 1) { closeModal();} 
		selectStep(step);
		// if(step==2) { 
		// 	$('.s-plan-content').removeClass('hidden');
		// 	$('.s-pay').removeClass('hidden').addClass('hidden');
		// }
		if(step==2) { 
			$('.s-plan-content').removeClass('hidden').addClass('hidden');
			$('.s-pay').removeClass('hidden');
		}
	});

	if($('.p-article-contents-list li a').next('ul').length){
		$('.p-article-contents-list li a').next('ul').closest('li').addClass('current');
	}
	$(".p-article-contents-title").click(function() {
		if ($(window).width() < 992) {
			if($(this).next("ul").is(":visible")){
				$(this).next("ul").slideUp("slow");
				$(this).closest('.p-article-contents').removeClass('active');

			} else {
				$(".p-article-contents-list").slideUp("slow");
				$(this).next("ul").slideToggle("slow");

				$(this).closest('.p-article-contents').addClass('active');


			}
			return false;
		}
	});
	$(".s-footer-list li:nth-child(1)").click(function() {
		if($(this).closest(".s-footer-list").hasClass("active")){
			$(".s-footer-list").removeClass('active');
			
		} else {
			$(this).closest(".s-footer-list").addClass('active');
			$(".s-footer-list li:not(:first-child)").slideUp();
			$(this).closest(".s-footer-list").children('li').slideDown();


		}
		return false;
	});
	owlInit();
	$(".s-quest-list .s-quest-title").click(function() {
		if($(this).next("div").is(":visible")){
			$(this).next("div").slideUp("slow");
			$('.s-quest-item').removeClass('active');
			$('.s-quest-title').removeClass('active');

		} else {
			$('.s-quest-item').removeClass('active');
			$('.s-quest-title').removeClass('active');
			$(".s-quest-answer").slideUp("slow");
			$(this).next("div").slideToggle("slow");

			$(this).addClass('active');
			$(this).closest('.s-quest-item').addClass('active');


		}
		return false;
	});
	$(".s-pay-list a").click(function(event) {
		event.preventDefault();
		$(this).parent().addClass("active");
		$(this).parent().siblings().removeClass("active");
		var tab = $(this).attr("href"); 
		$(".s-pay-contant").not(tab).css("display", "none");
		$(tab).fadeIn();
	});
	$(".p-article-contents-list li a").click(function() {
		if($(this).next("ul").length){
			if($(this).next("ul").is(":visible")){
				$(this).next("ul").slideUp("slow");
				$('.p-article-contents-list li').removeClass('active');

			} else {
				$('.p-article-contents-list li').removeClass('active');
				$(".p-article-contents-list li > ul").slideUp("slow");
				$(this).next("ul").slideToggle("slow");

				$(this).closest('li').addClass('active');


			}
		}
		return false;
	});
	initBuyButton();

});	//ready
$(window).resize(function () {
	owlInit();
});

function owlInit(){
	$('.s-clients-slider').owlCarousel({
		loop:true,
		margin:30,
		nav:false,
		items: 3,
		dots:false,
		autoWidth:true,
		responsive:{
			0:{
				items:1,
				dots:true,
				margin:15,
			},
			750:{
				items:2,
				dots:true,
				margin:25,
			},
			992:{
				items:3,
				dots:false,
				margin:30,
			}
		}
	});
	$('.s-company-slider').owlCarousel({
		loop:true,
		margin:22,
		nav:false,
		items: 5,
		dots:false,
		autoWidth:true,
		responsive:{
			0:{
				items:1,
				margin:15,
			},
			750:{
				items:2,
				margin:25,

			},
			992:{
				items:5,
				margin:22,
			}
		}
	});
	if ($(window).width() < 992) {
		$('.s-load-slider').addClass('owl-carousel');
		$('.s-load-slider').owlCarousel({
			onInitialized: function(){initBuyButton()},
			loop:true,
			margin:22,
			nav:false,
			items: 3,
			dots:false,
			autoWidth:true,
			responsive:{
				0:{
					items:1,
					dots:true,
					startPosition:1,
					margin:15,
				},
				750:{
					items:2,
					dots: true,
					margin:22,

				},
				992:{
					items:3,
					dots: true,
					margin:22,
				}
			}
		});

	} else {
		$('.s-load-slider').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
		
	}
}

function initBuyButton() {
	$('.buyButton').off('click').click(function(e){ e.preventDefault(); 
		var name = $(this).parents('.s-load-item').find('.s-load-item-days').html(),
		cost = $(this).parents('.s-load-item').find('.s-load-item-price span').html();
		$('.s-pay .s-header-btn2, .s-pay-all a').attr('data-id',$(this).attr('data-id'));
		if(name == undefined || cost == undefined) { 
			name = $('.s-load-slider .tp30').find('.s-load-item-days').html(); 
			cost = $('.s-load-slider .tp30').find('.s-load-item-price span').html();
		}
		$('.s-pay .s-pay-info span.days').html(name);
		$('.s-pay .s-pay-info span.cost, .s-pay .s-pay-price span').html(cost);
		$('#payment-form').attr('data-form',true);
		selectStep(3); 
		let save = 0; if($('#serviceSubscriptionButton').prop('checked') === true) { save = 1; }
		renderForm($(this).attr('data-id'),save);
	});
}

function selectStep(step){ 
	$('.s-plan-top-list.mobile .text span').html(step);
	$('ul.s-plan-top-list li.step').not(':first-child').addClass('disable');
	for (var i = 2; i <= step; i++) { var o = $('ul.s-plan-top-list li.step[data-step='+i+']');
		o.find('.icon').removeClass('check');
		if(i<step) { o.find('.icon').removeClass('check').addClass('check'); }
		o.removeClass('disable');
	}
	// if(step==2) {
	// 	$('.s-plan-content').removeClass('hidden');
	// 	$('.s-pay').removeClass('hidden').addClass('hidden');
	// } else 
	if(step==2) { 
		$('.s-plan-content').removeClass('hidden').addClass('hidden');
		$('.s-pay').removeClass('hidden');
		if($('#payment-form').attr('data-form')!='true') { 
			$('.s-pay .s-pay-info span.days').html('7 дней');
			let cost = $('#paymentTarif option:selected').attr('data-cost');
			$('.s-pay .s-pay-info span.cost, .s-pay .s-pay-price span').html(cost);
			let save = 0; if($('#serviceSubscriptionButton').prop('checked') === true) { save = 1; }
			if(!$('#payment-form iframe').size()) { renderForm(1,save); }
		}
	}
}

function cc_format(v) { //console.log(v);
	var input = v, res;
    v = v.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    //console.log(v);
    var s = v.split(''), parts = [];
    var change = false ;
    if(v.length == 0 && input.length) { change = true; }
    for (var i=0, len=v.length; i<len; i++) { 
    	parts.push(s[i]);
        if((i+1)/4==Math.floor((i+1)/4)&&(i+1)!=len) { parts.push(' '); }
    }
    if(parts.length) { res = parts.join(''); } else { res = v; }
    if(res!=input){ change = true; }
    //console.log(res);
    if( change == true ) { return parts.join(''); }
    else { return false; }
}

function getCaretPosition(ctrl) {
    if (document.selection) {
        ctrl.focus();
        var range = document.selection.createRange();
        var rangelen = range.text.length;
        range.moveStart('character', -ctrl.value.length);
        var start = range.text.length - rangelen;
        return {
            'start': start,
            'end': start + rangelen
        };
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        return {
            'start': ctrl.selectionStart,
            'end': ctrl.selectionEnd
        };
    } else {
        return {
            'start': 0,
            'end': 0
        };
    }
}
 
 
function setCaretPosition(ctrl, start, end) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(start, end);
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
};  
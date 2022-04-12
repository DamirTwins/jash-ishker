"use strict";
$(document).ready(function(){
	initModal();
});

function initModal(){ 
	$('.modalLink').off('click.open-modal').on('click.open-modal', function(e) { e.preventDefault();
		if($(this).attr('disabled')) { return; }
		var id = $(this).attr('id'), action = $(this).attr('data-action');
		openModal($(this).attr('data-modal'),$(this).attr('data-option'));
		if(!action) { return; }
		var title='Подтвердите действие', text='';
		$('.customModal .modalSection').attr('data-action',action);
		$('.customModal .modalSection .modal_title').html(title);
		$('.customModal .modalSection .subTitle').html(text);
		$('.customModal .modalSection .button.confirm').attr('data-id',id);
	})

	$(document).off('mouseup.close-modal-bg').on('mouseup.close-modal-bg',function (e){ if(!$('body').hasClass('openModal')) { return; }
		var div = $('.customModal.show').find(".modalSection"); 
		if(div.attr('data-close')=="false") { return; }
		if (!div.is(e.target) && div.has(e.target).length === 0) { 
			closeModal('#'+div.attr('id'));
		}
	});

	$('.button.cm-close,button.cm-close,a.cm-close').off('click.close-modal').on('click.close-modal',function(e){ 
		e.preventDefault(); closeModal('#'+$(this).parents('.customModal').find('.modalSection').attr('id')); 
	});
}

function openModal(id,option) {
	if(option=='danger') { var btn = $(id).find('button.confirm'); btn.attr('disabled','disabled').removeClass('stop'); timerConfirm(btn,5000);}
	$(id).find('.error').attr('class','error hide');
	$(id).parents('.cm-container').removeClass('hidden').addClass('show');
	$('body').css('height','auto');
	// console.log([$(window).height(),$('body').height()]);
	if($(window).height()>=$('body').height()||isTouchDevice()===true) {$('body').removeClass('noScroll').addClass('noScroll');}
	$('body').css('height','');
	$('body').removeClass('openModal').addClass('openModal');
	if(id == "#loginSection") { goal('checkout init reg'); }
}

function closeModal(selector) { var modal,timer; console.log('close'); 
	if(selector != undefined) { modal = $(selector).parents('.cm-container'); } else { modal = $('.cm-container'); }
	modal.find('button.confirm').removeClass('stop').addClass('stop');
	modal.addClass('hidden').removeClass('show').find('.modal');//.css('display','none'); 
	if(selector=='#previewBigModalSection') {timer=0;} else {timer=300;}
	if($('.cm-container.show').length==0) {setTimeout(function(){$('body').removeClass('openModal');},timer); }
}

function timerConfirm(btn,t) {
	if(t) { 
		btn.html('Продолжить ('+Math.ceil(t/1000)+')'); 
		if(!btn.hasClass('stop')) { setTimeout(function(){ timerConfirm(btn,t-100) },100); } 
	} else { 
		btn.removeAttr('disabled').html('Продолжить'); 
		$('#confirmModal button.confirm').off('click').on('click',function(e){ e.preventDefault();
			if(!$(this).attr('disabled')) {
				var func = $('#confirmModal').attr('data-func'); 
				if (typeof func !== 'undefined') {
					if(func === 'deleteAccount') { deleteAccount(); }
					if(func === 'serviceSubscriptionCancel') { serviceSubscriptionCancel(); }
				}
			}
		});
	}
}

function isTouchDevice() {return !!('ontouchstart' in window); }
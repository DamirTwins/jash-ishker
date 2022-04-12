$(document).ready(function(){
	initTooltip();
});

function initTooltip(){ 
	$(document).off('mouseup.close-tooltip-out').on('mouseup.close-tooltip-out',function (e){
		var div = $('.customTooltip.show');
		if(!div.length || div.attr('data-close')=="false") { return; }
		if (!div.is(e.target) && div.has(e.target).length === 0) {
			closeTooltip('#'+div.attr('id'));
		}
	});

	$('.customTooltip .ct-close').off('click.close-tooltip').on('click.close-tooltip',function(e){ 
		e.preventDefault(); closeTooltip('#'+$(this).parents('.customTooltip').attr('id'));
	});
}

function closeTooltip(selector) { var tooltip;  
	if(selector != undefined) { tooltip = $(selector); } else { tooltip = $('.customTooltip'); }
	tooltip.addClass('hidden').removeClass('show');
}

function openTooltip(id,option) { //console.log([id,option]);
	$(id).removeClass('hidden').addClass('show');
}
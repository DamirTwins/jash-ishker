$(document).ready(function(){   
	$('.s-footer-top .s-footer-list li:first-child a').click(function(e){
		e.preventDefault()
	});

	
	var twitterShare = document.querySelector('[data-js="twitter-share"]');
	if(twitterShare)
	{
		twitterShare.onclick = function(e) {
		  e.preventDefault();
		  var twitterWindow = window.open('https://twitter.com/share?url=' + document.URL, 'twitter-popup', 'height=350,width=600');
		  if(twitterWindow.focus) { twitterWindow.focus(); }
			return false;
		  }
	}

	var facebookShare = document.querySelector('[data-js="facebook-share"]');
	
	if(facebookShare)
	{
		facebookShare.onclick = function(e) {
		  e.preventDefault();
		  var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', 'height=350,width=600');
		  if(facebookWindow.focus) { facebookWindow.focus(); }
			return false;
		}
	}

	var twitterShare2 = document.querySelector('[data-js="twitter-share2"]');
	if(twitterShare2)
	{
		twitterShare2.onclick = function(e) {
		  e.preventDefault();
		  var twitterWindow = window.open('https://twitter.com/share?url=' + document.URL, 'twitter-popup', 'height=350,width=600');
		  if(twitterWindow.focus) { twitterWindow.focus(); }
			return false;
		  }
	}

	var facebookShare2 = document.querySelector('[data-js="facebook-share2"]');
	if(facebookShare2)
	{
		facebookShare2.onclick = function(e) {
		  e.preventDefault();
		  var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', 'height=350,width=600');
		  if(facebookWindow.focus) { facebookWindow.focus(); }
			return false;
		}
	}

	Share = {
		vkontakte: function(purl, ptitle, pimg, text) {
			url  = 'http://vkontakte.ru/share.php?';
			url += 'url='          + encodeURIComponent(purl);
			url += '&title='       + encodeURIComponent(ptitle);
			url += '&description=' + encodeURIComponent(text);
			url += '&image='       + encodeURIComponent(pimg);
			url += '&noparse=true';
			Share.popup(url);
		},
		popup: function(url) {
			window.open(url,'','toolbar=0,status=0,width=626,height=436');
		}
	};


	$('.s-header-toggle').click(function(e){
		e.preventDefault()
		if( $(this).hasClass('article') ){
			if( $(this).hasClass('active') ){
				$(this).removeClass('active');
				$('.s-header').removeClass('new_height');
				$('.s-header-mobile').slideUp(100);
				$('.s-header-mobile').removeClass("flex");
			} else {
				$(this).addClass('active');
				$('.s-header').addClass('new_height');
				$('.s-header-mobile').slideDown(200);
				$('.s-header-mobile').addClass("flex");

			}
			
		} else {
			
			if( $(this).hasClass('active') ){
				$(this).removeClass('active');
				$('.s-header-mobile').slideUp(300);
				if ($(window).scrollTop() <= 110) { $('.s-header').removeClass('active'); $('body').removeClass('style1'); }
				$('body').removeClass('style2');
			} else {
				$(this).addClass('active');
				$('.s-header-mobile').slideDown(200);
				$('.s-header').addClass('active');
				$('body').removeClass('style1').addClass('style1');
				$('body').addClass('style2');

			}
		}

	});
	$('.s-header-toggle1').click(function(e){
		e.preventDefault()
		if( $(this).hasClass('article') ){
			if( $(this).hasClass('active') ){
				$(this).removeClass('active');
				$('.s-header').removeClass('new_height');
				$('.s-header-mobile').slideUp(100);
			} else {
				$(this).addClass('active')
				$('.s-header').addClass('new_height');
				$('.s-header-mobile').slideDown(200);

			}

		} else {
			
			if( $(this).hasClass('active') ){
				$(this).removeClass('active');
				$('.s-header-mobile').slideUp(300);
				$('.s-header').removeClass('active');
				$('body').removeClass('style1');
				$('body').removeClass('style2');
			} else {
				$(this).addClass('active');
				$('.s-header-mobile').slideDown(200);
				$('.s-header').addClass('active');
				$('body').addClass('style1');
				$('body').addClass('style2');
			}
		}
	});

	$(".s-prof-list a").click(function(event) {
		event.preventDefault();
		$(this).parent().addClass("current");
		$(this).parent().siblings().removeClass("current");
		var tab = $(this).attr("href");
		$(".s-prof-block-cont").not(tab).css("display", "none");
		$(tab).fadeIn();


	});
	$(".s-skills-table-item .link, .s-skills-list .owl-next, .s-skills-list .owl-prev").click(function(event) {
		event.preventDefault();
		if( $(this).hasClass('active') ){
			$(this).removeClass('active')
			$(this).closest('.s-skills-table-item').find('.s-skills-list1 li:nth-child(n+6)').slideUp();
		} else {
			$(this).addClass('active')
			$(this).closest('.s-skills-table-item').find('.s-skills-list1 li:nth-child(n+6)').slideDown();
		}
		
		


	});
	var slider1=$('.s-skills-list');
	$(".owl-next1").click(function(event) {
		event.preventDefault();
		$('.s-skills-table-item .link').removeClass('active')
		$('.s-skills-table-item').find('.s-skills-list1 li:nth-child(n+6)').slideUp();
	});
	$(".owl-prev1").click(function(event) {
		event.preventDefault();
		$('.s-skills-table-item .link').removeClass('active')
		$('.s-skills-table-item').find('.s-skills-list1 li:nth-child(n+6)').slideUp();
	});
	$('.owl-next1').click(function() {
		slider1.trigger('next.owl.carousel');
	})
	$('.owl-prev1').click(function() {
		slider1.trigger('prev.owl.carousel', [300]);
	})
	$(".s-templates-btn div.s-header-btn2").click(function(event) {
		event.preventDefault(); 
		var next = $('.s-template-steps').find('.active');
		next.removeClass('active').next('li').addClass('active');
		$('.s-template-line').addClass('active');
		$('.s-templates-block1').slideUp(700);
		$('.s-templates-block2').slideDown(700);
		$('html, body').animate({scrollTop: 0},500);		
	});

	$(".s-template-steps li:first-child p strong").click(function(event) {
		event.preventDefault();
		var prev = $('.s-template-steps').find('.active');
		prev.removeClass('active').prev('li').addClass('active');
		$('.s-template-line').removeClass('active');
		$('.s-templates-block2').slideUp(700);
		$('.s-templates-block1').slideDown(700);
		$('html, body').animate({scrollTop: 0},500);	
	});



	$('.ae-select-content').html($('.dropdown-menu > li.selected > a').html());
	var newOptions = $('.dropdown-menu > li');
	newOptions.click(function() {
		$('.ae-select-content').html($(this).html());
		$('.dropdown-menu > li').removeClass('selected');
		$(this).addClass('selected');
	});

	var aeDropdown = $('.ae-dropdown');
	aeDropdown.click(function() {
		$('.dropdown-menu').toggleClass('ae-hide');
		$('.ae-select-content').toggleClass('active');
		return false;
	});

	if ($(window).width() < 992) {
		$('.s-blog-form').find("input").attr("placeholder", "Поиск...");
		$('.s-examples-list').addClass('owl-carousel');
		$('.s-examples-list').owlCarousel({
			loop:true,
			margin:15,
			nav:true,
			items: 3,
			startPosition:1,
			dots:false,
			responsive:{
				0:{
					items:1,
					center: false,
					startPosition:0,
					dots:true,
					margin:0,
				},
				750:{
					items:2,
					startPosition:1,

				},
				992:{
					items:2,
					startPosition:1,
				}
			}
		});
		$('.s-speak-list').addClass('owl-carousel');
		$('.s-speak-list').owlCarousel({
			loop:true,
			margin:15,
			nav:true,
			items: 3,
			startPosition:1,
			dots:false,
			responsive:{
				0:{
					items:1,
					center: false,
					startPosition:0,
					dots:true,
					margin:0,
				},
				750:{
					items:2,
					startPosition:1,

				},
				992:{
					items:2,
					startPosition:1,
				}
			}
		});
		$('.s-skills-list').addClass('owl-carousel');

		$('.s-skills-list').owlCarousel({
			loop:true,
			margin:15,
			nav:false,
			items: 3,
			startPosition:1,
			dots:false,
			responsive:{
				0:{
					items:1,
					center: false,
					startPosition:0,
					dots:true,
					margin:0,
				},
				750:{
					items:2,
					startPosition:1,

				},
				992:{
					items:2,
					startPosition:1,
				}
			}
		});
		$('.s-article-similar-list').addClass('owl-carousel');
		$('.s-article-similar-list').owlCarousel({
			loop:false,
			margin:15,
			nav:true,
			items: 3,
			startPosition:1,
			dots:false,
			responsive:{
				0:{
					items:1,
					center: false,
					startPosition:0,
					dots:true,
					margin:0,
				},
				750:{
					items:2,
					startPosition:1,

				},
				992:{
					items:2,
					startPosition:1,
				}
			}
		});
	} else {
		$('.s-blog-form').find("input").attr("placeholder", "Что необходимо Вам найти?");
		$('.s-examples-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
		$('.s-speak-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
		$('.s-skills-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
		$('.s-article-similar-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');

	}
	if ($(window).width() < 749) {
		$('.s-templates-list').addClass('owl-carousel');
		$('.s-templates-list').owlCarousel({
			loop:true,
			margin:15,
			nav:true,
			items: 3,
			startPosition:1,
			dots:true,
			responsive:{
				0:{
					items:1,
					center: false,
					startPosition:0,
					dots:true,
					margin:0,
				},
				750:{
					items:2,
					startPosition:1,

				},
				992:{
					items:2,
					startPosition:1,
				}
			}
		});
	} else {
		$('.s-templates-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');

	}

	$(window).resize(function () {
		if ($(window).width() < 992) {
			$('.s-blog-form').find("input").attr("placeholder", "Поиск...");
			$('.s-examples-list').addClass('owl-carousel');
			$('.s-examples-list').owlCarousel({
				loop:true,
				margin:15,
				nav:true,
				items: 3,
				startPosition:1,
				dots:false,
				responsive:{
					0:{
						items:1,
						center: false,
						startPosition:0,
						dots:true,
						margin:0,
					},
					750:{
						items:2,
						startPosition:1,

					},
					992:{
						items:2,
						startPosition:1,
					}
				}
			});
			$('.s-speak-list').addClass('owl-carousel');
			$('.s-speak-list').owlCarousel({
				loop:true,
				margin:15,
				nav:true,
				items: 3,
				startPosition:1,
				dots:false,
				responsive:{
					0:{
						items:1,
						center: false,
						startPosition:0,
						dots:true,
						margin:0,
					},
					750:{
						items:2,
						startPosition:1,

					},
					992:{
						items:2,
						startPosition:1,
					}
				}
			});
			$('.s-skills-list').addClass('owl-carousel');
			$('.s-skills-list').owlCarousel({
				loop:true,
				margin:15,
				nav:false,
				items: 3,
				startPosition:1,
				dots:false,
				responsive:{
					0:{
						items:1,
						center: false,
						startPosition:0,
						dots:true,
						margin:0,
					},
					750:{
						items:2,
						startPosition:1,

					},
					992:{
						items:2,
						startPosition:1,
					}
				}
			});
			$('.s-article-similar-list').addClass('owl-carousel');
			$('.s-article-similar-list').owlCarousel({
				loop:false,
				margin:15,
				nav:true,
				items: 3,
				startPosition:1,
				dots:false,
				responsive:{
					0:{
						items:1,
						center: false,
						startPosition:0,
						dots:true,
						margin:0,
					},
					750:{
						items:2,
						startPosition:1,

					},
					992:{
						items:2,
						startPosition:1,
					}
				}
			});
			
		} else {
			$('.s-blog-form').find("input").attr("placeholder", "Что необходимо Вам найти?");
			$('.s-examples-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
			$('.s-speak-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
			$('.s-skills-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
			$('.s-article-similar-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');

		}
		if ($(window).width() < 749) {
			$('.s-templates-list').addClass('owl-carousel');
			$('.s-templates-list').owlCarousel({
				loop:true,
				margin:15,
				nav:true,
				items: 3,
				startPosition:1,
				dots:true,
				responsive:{
					0:{
						items:1,
						center: false,
						startPosition:0,
						dots:true,
						margin:0,
					},
					750:{
						items:2,
						startPosition:1,

					},
					992:{
						items:2,
						startPosition:1,
					}
				}
			});
		} else {
			$('.s-templates-list').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');

		}
	});

});
$(document).ready(function(){   
	scrollHeader(window);
	$(window).scroll(function () {
		scrollHeader(this);
	});
});

function scrollHeader(obj) {
	if ($(obj).scrollTop() > 110) {
		if( $('.s-header').hasClass('article') ){
			$('.s-header').addClass('active');   
		} else {
			if( $('.s-header-toggle1').hasClass('active') && $('.s-header').hasClass('active') ){
				$('.s-header').addClass('active2');
			} else {
				$('.s-header').removeClass('active2');
			}
			$('.s-header').addClass('active');
			$('body').addClass('style1');
		}
		
	} else {
		if( $('.s-header').hasClass('article') ){
			$('.s-header').removeClass('active');  
		} else {
			$('.s-header').removeClass('active');
			$('body').removeClass('style1');
			$('.s-header').addClass('active1');
			if( $('.s-header-toggle1').hasClass('active') && $('.s-header').hasClass('active') ){
				$('.s-header').addClass('active2');
			} else {
				$('.s-header').removeClass('active2');
			}
		}

	}	
}

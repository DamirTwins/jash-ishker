(function ($) {
    $(function () {

        $(".s-header-user").click(function (e) {
            if (!$(".s-header-user-text").hasClass("active")) {
                $('.s-header-user-text').addClass("active");
                $(".submenu").slideDown();
            } else {
                $('.s-header-user-text').removeClass("active");
                $(".submenu").slideUp();
            }
        });

        $(document).on('mouseup.submenu', function (e) {
            if (!$(".s-header-user-text").hasClass("active")) {
                return;
            }
            var div = $(".s-header-user");
            if (!div.is(e.target) && div.has(e.target).length === 0) {
                $('.s-header-user-text').removeClass("active");
                $(".submenu").slideUp();
            }
        });


        $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
            $(this)
                .addClass('active').siblings().removeClass('active')
                .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
        });

        $('.lost').click(function (e) {
            e.preventDefault();
            $(".one_block.first1").hide();
            $(".one_block.first2").show();
        });

        $('.one_block.first2 .back').click(function (e) {
            e.preventDefault();
            $(".one_block.first2").hide();
            $(".one_block.first1").show();
        });

        $('.s-header-btn2.continue2').click(function (e) {
            e.preventDefault();
            $(".one_block.first3").hide();
            $(".one_block.first1").show();
        });

        $('.one_block.first.first1 .s-header-btn2').click(function (e) {
            e.preventDefault();
            var json = {"action": "signIn"};
            json.login = $('.one_block.first.first1 .email').val();
            json.password = $('.one_block.first.first1 .password').val();
            if ($('.one_block.first.first1 .promo').length && $('.one_block.first.first1 .promo').val().length > 1) {
                json.promo = $('.one_block.first.first1 .promo').val();
            }
            $.post("/ajax.php", json, function (data) {
                console.log(data);
                if (data.substring(0, 6) == "Error:") {
                    var error = data.substring(7);
                    $('.one_block.first.first1 .error').html(error).removeClass('hide');
                }
                if (data == "1") {
                    $('.one_block.first.first1 .error').addClass('hide');
                    window.location.href = "/edit/";
                }
            });
        });

        $('.two_block.registration .s-header-btn2').click(function (e) {
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            var json = {"action": "registration"};
            json.firstName = $('.two_block.registration .name').val();
            json.email = $('.two_block.registration .email').val();
            json.href = document.location.origin + document.location.pathname;
            if ($('.two_block.registration .promo').length && $('.two_block.registration .promo').val().length > 1) {
                json.promo = $('.two_block.registration .promo').val();
            }
            if (cCheckM() === false) {
                $('.two_block.registration .s-header-btn2').removeAttr('disabled');
                return;
            }
            // console.log(json);
            $.post("/ajax.php", json, function (data) {
                console.log(data);
                $('.two_block.registration .s-header-btn2').removeAttr('disabled');
                if (data.substring(0, 6) == "Error:") {
                    var error = data.substring(7);
                    $('.two_block.registration .error').html(error).removeClass('hide');
                }
                if (data == "1") {
                    $('.two_block.registration .error').addClass('hide');
                    let successUrl = "/edit/";
                    goal('reg', {'email': json.email, 'href': json.href}, successUrl); return;
                }
            });
        });

        $('.one_block.first2 .continue').click(function (e) {
            e.preventDefault();
            var email = $('.one_block.first2 .email').val();
            if (email == undefined || email == "") {
                $('.one_block.first2 .error').html("Для продолжения введите почту!").removeClass('hide');
                return false;
            }
            var json = {"action": "recoveryCheckMail", "email": email}
            $.post("/ajax.php", json, function (data) {
                console.log(data);
                if (data.substring(0, 6) == "Error:") {
                    var error = data.substring(7);
                    $('.one_block.first2 .error').html(error).removeClass('hide');
                    return false;
                }
                $(".one_block.first2").hide();
                $(".one_block.first3").show();
            });
        });

        // two_block registration error

        $('.s-popup-form .container input').on('change', function () {
            cCheckM();
        });

        $(".authFb").on("click", function (e) {
            e.preventDefault();
            if ($(this).hasClass("disabled")) {
                return false;
            }
            $('.authSocial').addClass("disabled");
            $.post("/include/fbauth.php", {'action': 'getFbAuthLink'}, function (data) {
                let href = document.location.origin + document.location.pathname;
                goal('reg', {'href': href}, data);
            });
        });
        $(".authVk").on("click", function (e) {
            e.preventDefault();
            if ($(this).hasClass("disabled")) {
                return false;
            }
            $('.authSocial').addClass("disabled");
            $.post("/ajax.php", {'action': 'getVkAuthLink'}, function (data) {
                let href = document.location.origin + document.location.pathname;
                goal('reg', {'href': href}, data);
            });
        });

        function cCheckM() {
            if ($('.s-popup-form .container input').prop('checked') === true) {
                $('.two_block.registration .error').addClass('hide');
                return true;
            } else {
                $('.two_block.registration .error').html("Для продолжения необходимо согласие с условиями обработки персональных данных!").removeClass('hide');
            }
            return false;
        }

    });
})(jQuery);
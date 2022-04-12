$(document).ready(function () {
    if ($('.resumeCount').length && function_exists("startResumeCounter")) {
        startResumeCounter();
    }

    clickCoockieAgree();
    $.post("/ajax.php", {action: "checkCookieAgree"}, function (data) {
        if (data === '0') {
            $('.rulesInfo.wpRules').addClass('visible');
            clickCoockieAgree();
        }
    });

});

function goal(type, data, successUrl) {
    setTimeout(function () {
        var systems = 'GA Metrika FB VK';
        if (type == 'reg') {
            goalId = 'Registration';
        } else if (type == 'buy') {
            goalId = 'Buy';
        } else if (type == 'copyResumeFromExemple') {
            goalId = 'copyResumeFromExemple';
        } else if (type == 'selectTemplateSideBanner') {
            goalId = 'selectTemplateSideBanner';
        } else if (type == 'checkout init reg') {
            goalId = 'checkoutInitReg';
            systems = 'FB';
        } else if (type == 'checkout init buy') {
            goalId = 'checkoutInitBuy';
            systems = 'FB';
        }
        dataLayer.push(
            {
                'event': 'universal_event',
                'event_category': goalId,
                'event_action': goalId,
                'event_label': goalId,
                'universal_event_systems': systems,
                'universal_event_name': goalId
            });
        // try {
        //     VK.Retargeting.Init("VK-RTRG-1080215-gxZWY");
        //     if (type == 'reg') {
        //         fbq('trackCustom', 'Registration');
        //         // VK.Retargeting.Event('Registration');
        //         // VK.Goal('Registration goal');
        //         VK.Retargeting.Add(40949553);
        //     }
        //     if (type == 'buy') {
        //         fbq('trackCustom', 'Buy');
        //         // VK.Retargeting.Event('Buy');
        //         VK.Retargeting.Add(40949540);
        //         // VK.Goal('Buy goal');
        //     }
        // } catch (e) {
        //     console.log(e.message);
        // }
        console.log([type,data,successUrl]);
        $.post("/ajax.php", {action: 'goalDebug', event: type, text: data});
        if(successUrl) { window.location.href = successUrl; }
    },500);
}

function clickCoockieAgree() {
    if ($('.rulesInfo.visible').length) {
        $('.rulesInfoClose').off('click').click(function () {
            var c = $(this);
            $.post("/ajax.php", {action: "cookieAgree"}, function (data) {
                c.closest('.rulesInfo').removeClass('visible');
            });
        });
    }
}

function function_exists(function_name) {
    if (typeof function_name == 'string') {
        return (typeof window[function_name] == 'function');
    } else {
        return (function_name instanceof Function);
    }
}

function startResumeCounter() {
    var timer = 60000;
    $(document).ready(function () {
        updateResumeCount();
        setInterval(function () {
            updateResumeCount();
        }, timer);
    });
}

function updateResumeCount() {
    $.post("/ajax.php", {'action': 'getResumeCount'}, function (data) { //console.log(data);
        $('.resumeCount').html(data);
        if ($('.s-load-users').length) {
            $('.s-load-users .user').html(getTermination(data, 'пользователь', 'пользователя', 'пользователей'));
            $('.s-load-users .buy').html(getTermination(data, 'приобрел', 'приобрели', 'приобрели'));
        }
    });
}

function getTermination(num, word1, word2, word3) {
    number = num.substr(-2);
    if (number > 10 && number < 15) {
        return word3;
    } else {
        number = number.substr(-1);
        if (number == 0) {
            return word3;
        }
        if (number == 1) {
            return word1;
        }
        if (number > 1 && number <= 4) {
            return word2;
        }
        if (number > 4) {
            return word3;
        }
    }
}


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
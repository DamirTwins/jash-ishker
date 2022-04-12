"use strict";
//intlTelInput

(function ($) {
    $.fn.removeClassLike = function (styleStart) {
        var newClass = [], classes = this.attr('class').split(' ');
        $.each(classes, function (k, v) {
            if (v.indexOf(styleStart) === -1) {
                newClass.push(v);
            }
        });
        this.attr('class', newClass.join(' '));
        return this;
    };
})(jQuery);

$(window).ready(function () {

    $(".profile-menu").click(function (e) {
        if (!$(".profile-menu-div").hasClass("active")) {
            $('.profile-menu-div').addClass("active");
        } else {
            $('.profile-menu-div').removeClass("active");
        }
    });

    $(document).on('mouseup.profile-menu-div .submenu', function (e) {
        if (!$(".profile-menu-div").hasClass("active")) {
            return;
        }
        var div = $(".profile-menu");
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            $('.profile-menu-div').removeClass("active");
        }
    });

    $('.addResume').on('click', function (e) {
        e.preventDefault();
        addResume();
    });
    $('#confirmDelete .delete').on('click', function (e) {
        e.preventDefault();
        deleteResume();
    });
    $('#confirmDelete .cancel').on('click', function (e) {
        e.preventDefault();
    });
    $(".accessRegister").on('click', function (e) {
        e.preventDefault();
        changeModal(this);
    });
    $("header .s-header-btn1").on('click', function (e) {
        e.preventDefault();
        changeModal(this);
    });
    $("#shareModal .input-group-prepend").click(function (e) {
        selectText("resumeLink");
        document.execCommand("Copy");
    });
    $('#openResumeModalSwitcher').click(function () {
        share();
    });
    $('.button-link.share, #previewBigModal span.share').on('click', function (e) {
        e.preventDefault();
        modalShare($('#resumeName').val(), $('#shareModal').attr('data-id'), 'preview');
    });
    $('.additionalSwitcher span').click(function () {
        $(this).toggleClass('open').closest('fieldset').find('.additionalDiv').toggleClass('open');
    });
    $('.helpSkill .help').click(function () {
        showTooltip($(this), 'skill');
    });
    $('.material-switch.ms-js-active input').each(function () {
        msCheckState(this);
    });
    initSwitcher();
    initPanel();
    initPDFAndPrint("edit");
    // $('.draggble-item-wrapper').arrangeable({dragSelector: '.manage-btn_drag',dragEndEvent:"my_drag_end_event" });
    // stickyToFooter();
    let href='/edit/';
    $(".authFb").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return false;
        }
        $('.authSocial').addClass("disabled");
        $.post("/include/fbauth.php", {'action': 'getFbAuthLink'}, function (data) {
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
            goal('reg', {'href': href}, data);
        });
    });

    window.active = true;
    window.activated = false;
    $(window).focus(function () {
        if (window.active === false) {
            window.active = true;
            getAdditionalInstructions(true);
        }
    });
    $(window).blur(function () {
        window.active = false;
    });
    getAdditionalInstructions(true);
    $('[data-toggle="tooltip"]').tooltip();
});   //ready

function initSwitcher() {
    $('.material-switch.ms-js-active input').off('click').on('click', function () {
        msCheckState(this);
    });
}

function msCheckState(obj) {
    $(obj).closest('.material-switcher-group').removeClass('ms-active');
    if ($(obj).prop('checked') === true) {
        $(obj).closest('.material-switcher-group').addClass('ms-active').find('.ms-text-after').html($(obj).attr('data-on'));
    } else {
        $(obj).closest('.material-switcher-group').find('.ms-text-after').html($(obj).attr('data-off'));
    }
}

function getAdditionalInstructions(active) {
    if (active === false || window.active === false || window.activated === true) {
        return;
    }
    window.activated = true;
    setTimeout(function () {
        $.post("/ajax.php", {'action': 'getAdditionalInstructions'}, function (data) {
            doActions(data);
            window.activated = false;
            getAdditionalInstructions(window.active);
        }).fail(function (data) {
            doActions(data);
            window.activated = false;
            getAdditionalInstructions(window.active);
        });
    }, 1000);
}

function doActions(data) {
    if (data == "reload") {
        window.location.reload();
        return;
    }
    var d = new Date(data);
    if (d != 'Invalid Date') {
        $('#paymentSucceeded .content span > b > span').html(data);
        openModal('#paymentSucceeded');
        goal('buy');
        initButtonRefresh();
    }
}

function initButtonRefresh() {
    $('#paymentSucceeded .s-header-btn1').off('click.refresh').on('click.refresh', function (e) {
        e.preventDefault();
        window.location.reload();
    });
}

function initEditor() {
    $.fn.selectpicker.Constructor.DEFAULTS.size = 8;
    $.fn.selectpicker.Constructor.DEFAULTS.width = false;
    $('.addProfArea').on('click.modal', function () {
        initProfAreaList();
    });
    $('.selectRegionList').on('click.modal', function () {
        initRegionList();
    });
    $('.profile-photo-container.add').click(function () {
        $('#resumeFileUpload').trigger('click');
    });
    $('#resumeFileUpload').bind('fileuploadadd', function (e, data) {
        $('#warningGradientOuterBarG').removeClass('hide');
        $('.profile-photo-container .uploadLabel span').addClass('hide');
    }).bind('fileuploaddone', function (e, data) {
        $('#warningGradientOuterBarG').addClass('hide');
        $('.profile-photo-container .uploadLabel span').removeClass('hide');
        showCropperModal(data.result);
    });
    $('.resume-photo-edit__buttons .photoEdit').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showCropperModal(false);
    });
    $('.resume-photo-edit__buttons .photoDelete').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        delPhoto();
        reloadIFrame('resume-preview');
    });
    $('.addBlock').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) {
            return false;
        }
        addBlock($(this).attr('data-type'));
    });
    $('.addCustomBlock').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) {
            return false;
        }
        addCustomBlock($(this));
    });
    $('.preview-manage__open, .preview-manage__setting,.bottom-panel__preview a').click(function () {
        resizePreviewBig();
        reloadIFrame('previewBig');
    });
    $('#resumeCity').keyup(function () {
        regionComplete(this);
    });
    $('select').each(function () {
        $(this).find('option[selected]').prop('selected', true);
    });
    $('#previewBigModal button.close, #previewBigModal .closeModal').click(function () {
        if ($('#previewBig').attr('updated') == 1) {
            $('#previewBig').attr('updated', 0);
            reloadIFrame('resume-preview');
        }
    });
    $('.slick-arrow,.preview-slider__buttons > i').click(function () {
        opage(this, $(this).parents('.previewModal').attr('id'));
    });
    resizePreview();
    reloadIFrame('resume-preview');
    initProfAreaDel();
    initCollapse();
    initPhone();
    initSocial();
    initEducation();
    initCourse();
    initLanguage();
    initExperience();
    initSkill();
    initQuill('#about');
    initQuill('#hobbies');
    initQuill('#custom');
    initCustomBlock('quality');
    initCustomBlock('recommendation');
    initCustomBlock('publication');
    $('#resumeLangauge').selectpicker({iconBase: 'lang'});
    $('#resumeBirthDay').selectpicker();
    $('#resumeBirthMonth').selectpicker();
    $('#resumeBirthYear').selectpicker();
    $('#resumeCurrency').selectpicker();
    $('#resumeEmployment').selectpicker();
    $('#resumeSchedule').selectpicker();
    $('#resumeRelocation').selectpicker();
    initQuill('#resumePurpose');
    initSave();
    initDelBlock();
    initCustomeEdit();
    initDel();
    initDrag();
    $('#resumeLangauge').off('change.save').on('changed.bs.select', function () {
        saveOptions({'language': $(this).val()});
    });
    $('#previewZoom').on('input change', function () {
        resizePreviewBig();
    });

    $('#resumeFont').selectpicker();
    $('.sidebar-nav .sidebar-nav__link').click(function (e) {
        e.preventDefault();
        var bst = $('body').scrollTop(), formPart = $("#" + $(this).attr('data-link')).offset().top + bst - 70;
        $("html, body").animate({scrollTop: formPart}, 800);
    });

    function updateControlStyle(style, val) {
        var iFrame = $('.preview-slider__iframe').contents().find('.resume');
        iFrame.removeClassLike(style).addClass(style + val);
        var json = {"action": "saveOption", resumeId: $('#resumeName').attr('data-id')};
        json[style] = style + val;
        return json;
    }

    function saveControlStyle(json, noCallback, fade) {
        $.post("/ajax.php", json, function (data) {
            if (noCallback === true) {
                return false;
            }
            reloadIFrame('previewBig', fade);
            reloadIFrameAsync('resume-preview');
        });
    }

    $("#previewFontSize").on("change", function () {
        var json = updateControlStyle("fsize", $(this).val());
        saveControlStyle(json);
    })
        .on("input", function () {
            updateControlStyle("fsize", $(this).val());
        });
    $("#previewLineHeight").on("change", function () {
        var json = updateControlStyle("lineh", $(this).val());
        saveControlStyle(json);
    })
        .on("input", function () {
            updateControlStyle("lineh", $(this).val());
        });
    $("#resumeFont").on("change", function () {
        var json = updateControlStyle("font", $(this).val());
        saveControlStyle(json);
    })
    $('.templates-list__link').on('click', function () {
        $(".templates-list__link").removeClass("active");
        $(this).addClass("active");
        var tpl = $(this).attr("id").substring(3);
        saveControlStyle({
            "action": "saveOption",
            "tpl": "tpl" + tpl,
            resumeId: $('#resumeName').attr('data-id')
        }, false, true);
    });

    $(window).resize(function () {
        if ($('#photoEditorModal').closest('.customModal').hasClass('show')) {
            showCropperModal('resize');
        } else {
            $('#photoEditorModal').attr('data-resize', 'true');
        }
        if ($('#previewBigModal').closest('.customModal').hasClass('show')) {
            resizePreviewBig();
        }
        resizePreview();
        // stickyToFooter();
    });
}

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
}

function resizePreview() {
    var ww = $(window).width(),
        wh = $(window).height();
    var sb = 65;
    if (ww < 1200) {
        sb = 0;
    }
    var pw = (ww - sb) / 2 - 45;
    if (ww > 1920) {
        pw = (ww - sb) - 910 - 45;
    }

    var ph = wh - 71,
        fw = pw - 52,
        fh = ph - 110 - 59,
        aspectRatio = Math.min((fw / 795), (fh / 1123));

    // console.log([ww,wh]);
    // console.log([pw,ph]);
    // console.log([fw,fh]);
    // console.log(aspectRatio);
    $('#sticky-wrapper .preview-slider__iframe').css('transform', 'scale(' + aspectRatio + ',' + aspectRatio + ')');
    $('#sticky-wrapper .preview-slider-wrap').width((aspectRatio * 795)).height((aspectRatio * 1123));
    $('#sticky-wrapper').width(pw).height(ph).css('top', 71);
    // reloadIFrame('resume-preview');
}

function stickyToFooter() {
    $(document).off('scroll');
    $(document).on('scroll', function () {
        var wst = $(window).scrollTop(),
            // sot = $('#sticky-wrapper').offset().top,
            st = 71,
            fot = $('.footer').offset().top,
            wh = $(window).height(),
            fh = $('.footer').height();
        if (wst + wh >= fot) {
            $('#sticky-wrapper').css('top', st - (wst + wh - fot));
        } else {
            $('#sticky-wrapper').css('top', st);
        }
    });
}


function resizePreviewBig() { //return;

    var scale = $('#previewZoom').val(), pwstep,
        rppv = parseInt($('.fieldset').css('padding-top')) * 2,
        // rpph = parseInt($('.fieldset').css('padding-left'))*2,
        ww = $(window).width(),
        wh = $(window).height();
    var pw, pwmin, pwmax,
        ph, phmin = wh - 81 - rppv - 61 - 8, phmax, fw,
        aspectRatio;
    if (ww < 768) {
        pwmax = ww - 32 - 60;
        pwmin = phmin * 795 / 1123;
        if (pwmin > pwmax) {
            pwmin = pwmax;
            phmin = pwmin * 1123 / 795;
        }
        phmax = pwmax * 1123 / 795;
        pwstep = (pwmax - pwmin) / 4;
        pw = pwmin + pwstep * scale;
        aspectRatio = pw / 795;
    }
    if (ww >= 768 && ww < 838) {

        pwmax = ww - 32 - 60 - 16 - 250;
        pwmin = phmin * 795 / 1123;
        if (pwmin > pwmax) {
            pwmin = pwmax;
            phmin = pwmin * 1123 / 795;
        }
        phmax = pwmax * 1123 / 795;
        pwstep = (pwmax - pwmin) / 4;
        pw = pwmin + pwstep * scale;
        aspectRatio = pw / 795;

    }

    if (ww >= 838) {

        pwmax = ww - 32 - 60 - 16 - 320;
        pwmin = phmin * 795 / 1123;
        if (pwmin > pwmax) {
            pwmin = pwmax;
            phmin = pwmin * 1123 / 795;
        }
        if (pwmax > (795 + 50)) {
            pwmax = (795 + 50);
            phmax = (1123 + 48 + 16);
        }
        phmax = pwmax * 1123 / 795;
        pwstep = (pwmax - pwmin) / 4;
        pw = pwmin + pwstep * scale;
        aspectRatio = pw / 795;
    }

    if (aspectRatio > 1) {
        aspectRatio = 1;
    }
    $('#previewBig .preview-slider__iframe').css('transform', 'scale(' + aspectRatio + ',' + aspectRatio + ')');
    $('#previewBig .preview-slider-wrap').width((aspectRatio * 795)).height((aspectRatio * 1123));

    // reloadIFrame();
}

function d(t) {
    console.log(t)
};

function reloadIFrame(id, fade) {
    var src = '/preview/?if', page = parseInt($('#' + id + ' .cpage').html());
    window.page = page;
    $('#' + id + ' iframe').off('load').removeClass('loading');
    if (fade === true) {
        $('#' + id + ' iframe.iFrameActive').addClass('loading');
    }
    $('#' + id + ' iframe.iFrameAux').attr('src', src).on('load', function () {
        var pages = $(this).contents().find('.resume').attr('data-pages');
        if (page > pages) {
            page = pages;
        }
        if (!page) {
            page = 1;
        }
        openPage(id, page);
        $('#' + id + ' .pagingInfo').html('<span class="cpage">' + page + '</span> из <span class="pages">' + pages + '</span>');
        $('#' + id + ' iframe').removeClass('iFrameAux loading').addClass('iFrameAux').removeClass('iFrameActive');
        $(this).addClass('iFrameActive').removeClass('iFrameAux');
        setTimeout(function () {
            $('iframe.iFrameAux').attr('src', src);
        }, 0);
    });
    return;
    //iFrameReady(id);
}

function getNaturalWidth(obj, id) {
    var img = obj.contents().find('.photo img');
    console.log(img.get(0).naturalWidth);
    if (img.naturalWidth == undefined) {
        console.log('noImgLoad');
    } else {
        console.log(img.naturalWidth);
    }

}

function reloadIFrameAsync(id) {
    setTimeout(function () {
        reloadIFrame(id);
    }, 0);
}

function opage(obj, id) {
    var cl = $(obj).attr('class'),
        dir = 1,
        cpageo = $('#' + id + ' .cpage'), cpage = parseInt(cpageo.html()),
        pageso = $('#' + id + ' .pages'), pages = parseInt(pageso.html());
    if (obj != undefined) {
        if (cl.indexOf("next") == "-1") {
            dir = -1;
        }
        if ((cpage + dir) > 0 && (cpage + dir) <= pages) {
            page = (cpage + dir);
        } else {
            return;
        }
        if (page == undefined || page < 1) {
            page = 1;
        }
        openPage(id, page);
    }
}

function openPage(id, page) {
    var iFrame = $('#' + id + ' iframe').contents().find('.resume .page');
    iFrame.removeClass("hide").addClass("hide").parent().find("#page" + page).removeClass("hide");
    $('#' + id + ' .cpage').html(page);
}

function parsePageLine(obj) {
    var lot = $(obj).offset().top, lh = $(obj).height(), b = $(obj).parents('.block').attr('class');
    if ((lot + lh) < 1123 * (page - 1) || (lot + lh) >= 1123 * page) {
        lsm.push(obj);
    } else {
        //console.log([obj,'obj OT',$(obj).offset().top]);
    }

    if ($(obj).hasClass('pbb') && 0) {
        console.log(['pbb', 'page', page, '(lot+lh) < 1123*(page-1)', (lot + lh) < 1123 * (page - 1), '(lot+lh) >= 1123*page', (lot + lh) >= 1123 * page, 'obj OT', $(obj).offset().top, obj]);
    }
}


function status(text, type) {
    if (type == void 0) {
        type = "ok";
    }
    $(".save-status").removeClass().addClass("save-status");
    $(".save-status i").removeClass();
    $(".save-status .text").html(text);
    if (type == "loading") {
        $(".save-status").addClass("loading");
        $(".save-status i").addClass("fas fa-spinner fa-spin");
    }
    if (type == "ok") {
        $(".save-status").addClass("ok");
        $(".save-status i").addClass("far fa-check-circle fa-pulse");
    }
    if (type == "error") {
        $(".save-status").addClass("error");
        $(".save-status i").addClass("fas fa-exclamation-triangle fa-pulse");
    }
    // setTimeout(function(){status(text,"ok");},300);
}

function saveState() {
    if ($(".save-status").hasClass("loading")) {
        return "loading";
    }
    if ($(".save-status").hasClass("error")) {
        return "error";
    }
    if ($(".save-status").hasClass("ok")) {
        return "ok";
    }
}

function initSave() {
    // $(".editor input,.editor select").not('input[type=file]').off('change.save');
    $(".editor input,.editor select").not('input[type=file]').off('change.save').on('change.save', function () {
        save();
    });
    $(".editor input#resumeCity").off('change.save').on('blur.save', function () {
        console.log($(this).attr('id'));
        save(200);
    });
    $(".editor .ql-editor").unbind('blur.save');
    $(".editor .ql-editor").on('blur.save', function () {
        save()
    });
}


function save(t, saveId) {
    if (t == void 0) {
        t = 0;
    }
    if (saveId == undefined) {
        saveId = (new Date()).getTime();
    }
    if (saveState() == "loading") {
        if (localStorage.getItem('saveId') <= saveId) {
            localStorage.setItem('saveId', saveId);
            setTimeout(function () {
                save(t, saveId);
            }, 100);
        }
        return;
    }
    if (saveState() != "error") {
        status("Сохранение", "loading");
    }
    localStorage.setItem('saveId', saveId);

    setTimeout(function () {
        var json = {action: "save"}, text, text2;
        json.id = $(".editor #resumeName").attr('data-id');
        json.name = $(".editor #resumeName").val();
        json.firstName = $(".editor #resumeFirstName").val();
        json.lastName = $(".editor #resumeLastName").val();
        json.patronymic = $(".editor #resumePatronymic").val();
        var by = $(".editor #resumeBirthYear option:selected").val(),
            bm = $(".editor #resumeBirthMonth option:selected").val(),
            bd = $(".editor #resumeBirthDay option:selected").val()
        json.birthday = {"YYYY": parseInt(by), "MM": parseInt(bm), "DD": parseInt(bd)}
        // if(!parseInt(by)||!parseInt(bm)||!parseInt(bd)){console.log(by,bm,bd);}
        // json.gender=$(".editor input[name='genderSelect']:checked").val();
        json.city = $(".editor #resumeCity").val();
        json.metro = $(".editor #resumeMetro").val();
        json.image = $('.editor .photo_img img').attr('id');
        json.email = $(".editor #resumeEmail").val();//if($("#email").val()) {} else {json.email="empty";}
        json.post = $(".editor #resumePostName").val();
        // json.salary=$(".editor #resumeSalary").val();
        // json.currency=$(".editor #salaryCurrency option:selected").val();
        var additional = {};
        additional.salary = $(".editor #resumeSalary").val();
        additional.citizenship = $(".editor #resumeCitizenship").val();
        additional.currency = $(".editor #resumeCurrency option:selected").val();
        additional.employment = $(".editor #resumeEmployment option:selected").val();
        additional.schedule = $(".editor #resumeSchedule option:selected").val();
        additional.relocation = $(".editor #resumeRelocation option:selected").val();
        if ($("#resumeBusinessTrip").prop("checked")) {
            additional.businessTrip = 1;
        } else {
            additional.businessTrip = 0;
        }
        additional.driverLicense = $(".editor #resumeDriverLicense").val();
        if ($("#resumeCar").prop("checked")) {
            additional.car = 1;
        } else {
            additional.car = 0;
        }
        additional.familyStatus = $(".editor #resumeFamilyStatus").val();
        if ($("#resumeChildren").prop("checked")) {
            additional.children = 1;
        } else {
            additional.children = 0;
        }
        text = $("#resumePurpose .ql-editor").html();
        if (text != clearStyles(text)) {
            text = clearStyles(text);
            $(this).find("#resumePurpose .ql-editor").html(text);
        }
        ;
        additional.purpose = text;
        if ($("#resumePurposeActive").prop("checked")) {
            additional.purposeActive = 1;
        } else {
            additional.purposeActive = 0;
        }
        json.additional = [additional];
        // var profs = []; $(".editor .profobls .delprof").each(function(index, value){ var prof={};
        //   prof.id=$(this).attr('id');
        //   prof.profAreaListId=$(this).parent().attr('data-value');
        //   profs[index]=prof;
        // });
        // json.profArea=profs;
        var phone = {};
        phone.phone = $("#resumePhone").val();
        $("#resumePhoneMessengers input").each(function (index, value) {
            if ($(this).prop("checked")) {
                phone[$(this).attr("data-id")] = 1;
            } else {
                phone[$(this).attr("data-id")] = 0;
            }
        });
        phone.id = $("#resumePhone").attr('data-id');
        json.phone = [phone];
        var socials = [];
        $(".editor .social").each(function (index, value) {
            var social = {};
            social.id = $(this).attr('id');
            social.type = $(this).find('.editSocialList option:selected').val();
            social.link = $(this).find('.link').val();
            social.sort = index;
            socials[index] = social;
        });
        json.social = socials;
        var educations = [];
        $(".editor .education").each(function (index, value) {
            var education = {};
            education.id = $(this).attr('id');
            education.level = $(this).find('.editEducationLevelList option:selected').val();
            education.name = $(this).find("input.name").val();
            education.fac = $(this).find("input.fac").val();
            education.spec = $(this).find("input.spec").val();
            education.yearEnd = $(this).find("select.yearEnd option:selected").val();
            education.sort = index;
            educations.push(education);
        });
        json.education = educations;
        var courses = [];
        $(".editor .course").each(function (index, value) {
            var course = {};
            course.id = $(this).attr('id');
            course.name = $(this).find("input.name").val();
            course.org = $(this).find("input.org").val();
            course.yearEnd = $(this).find("select.yearEnd option:selected").val();
            course.sort = index;
            courses.push(course);
        });
        json.course = courses;
        var languages = [];
        $(".editor .language").each(function (index, value) {
            var language = {};
            language.id = $(this).attr('id');
            language.languageListId = $(this).find(".name option:selected").val();
            language.languageLevelId = $(this).find(".level option:selected").val();
            language.sort = index;
            languages.push(language);
        });
        json.language = languages;
        // if($("#carier-start").prop("checked")) {json.carier_start=1;} else {json.carier_start=0;}
        var experiences = [];
        $(".editor .experience").each(function (index, value) {
            var experience = {};
            experience.id = $(this).attr('id');
            experience.org = $(this).find(".org").val();
            experience.webSite = $(this).find(".webSite").val();
            experience.post = $(this).find(".post").val();
            experience.monthStart = $(this).find("select.monthStart option:selected").val();
            experience.yearStart = $(this).find("select.yearStart option:selected").val();
            experience.monthEnd = $(this).find("select.monthEnd option:selected").val();
            experience.yearEnd = $(this).find("select.yearEnd option:selected").val();
            if ($(this).find("input.stillWork").prop("checked")) {
                experience.stillWork = 1;
            } else {
                experience.stillWork = 0;
            }
            text = $(this).find(".responsibility .ql-editor").html();
            if (text != clearStyles(text)) {
                text = clearStyles(text);
                $(this).find(".responsibility .ql-editor").html(text);
            }
            ;
            experience.responsibility = text;
            experience.sort = index;
            experiences.push(experience);
        });
        json.experience = experiences;
        //console.log(experiences);
        var skills = [];
        $("#skillList .skill").each(function (index, value) {
            var level = $(this).find(".skillLevels input[type='radio']:checked").val();
            if (level == undefined) {
                level = 1;
            }
            skills.push({'id': $(this).attr('id'), 'name': $(this).find('.name').val(), 'level': level, 'sort': index});
        });
        json.skill = skills;
        var qualities = [];
        $("#qualityList .quality").each(function (index, value) {
            qualities.push({'id': $(this).attr('id'), 'name': $(this).find('.name').val(), 'sort': index});
        });
        json.quality = qualities;
        text = $(".editor #about .ql-editor").html();
        text2 = clearStyles(text);
        if (text != clearStyles(text)) {
            text = clearStyles(text);
            $(".editor #about .ql-editor").html(text);
        }
        ;
        var about = {'about': text};
        json.about = [about];
        if ($(".editor #hobbies .ql-editor").length) {
            text = $(".editor #hobbies .ql-editor").html();
            if (text != clearStyles(text)) {
                text = clearStyles(text);
                $(".editor #hobbies .ql-editor").html(text);
            }
            var hobbies = {'text': text};
            json.hobbies = [hobbies];
        }
        if ($(".editor #custom .ql-editor").length) {
            text = $(".editor #custom .ql-editor").html();
            if (text != clearStyles(text)) {
                text = clearStyles(text);
                $(".editor #custom .ql-editor").html(text);
            }
            var custom = {'text': text, 'name': $('#form-part-custom .legend > span').html()};
            if ($("#resumeCustomCol").prop("checked")) {
                custom.col = 1;
            } else {
                custom.col = 0;
            }
            json.custom = [custom];
        }
        var recommendations = [];
        $(".editor .recommendation").each(function (index, value) {
            var recommendation = {};
            recommendation.id = $(this).attr('id');
            recommendation.name = $(this).find("input.name").val();
            recommendation.company = $(this).find("input.company").val();
            recommendation.email = $(this).find("input.email").val();
            recommendation.phone = $(this).find("input.phone").val();
            recommendation.sort = index;
            recommendations.push(recommendation);
        });
        json.recommendation = recommendations;
        var publications = [];
        $(".editor .publication").each(function (index, value) {
            var publication = {};
            publication.id = $(this).attr('id');
            publication.name = $(this).find("input.name").val();
            publication.dateYear = $(this).find("select.dateYear option:selected").val();
            publication.dateMonth = $(this).find("select.dateMonth option:selected").val();
            publication.sort = index;
            publications.push(publication);
        });
        json.publication = publications;

        $(".loader-div").fadeIn();
        $(".control .designs").addClass("disabled");
        $.ajax({
            cache: false, timeout: 10000, type: "POST", url: "/ajax.php", data: json,
            error: function () {
                status("Ошибка сохрания", "error");
                save(5000);
            },
            success: function (data) {
                if (data == 'reload') {
                    window.location.href = "/edit/";
                }
                console.log(data);
                status("Сохранено");
                reloadIFrame('resume-preview');
            }
        });


        //if (saveState() == "loading") {return;}
    }, t);
}

function saveOptions(options) {
    options.action = 'saveOption';
    options.resumeId = $(".editor #resumeName").attr('data-id');
    if (saveState() != "error") {
        status("Сохранение", "loading");
    }
    console.log(options);
    $.ajax({
        cache: false, timeout: 10000, type: "POST", url: "/ajax.php", data: options,
        error: function () {
            status("Ошибка сохрания", "error");
            setTimeout(function () {
                saveOptions($options);
            }, 5000);
        },
        success: function (data) {
            if (data == 'reload') {
                window.location.href = "/edit/";
            }
            ;
            status("Сохранено");
            reloadIFrame('resume-preview');
            console.log(data);
        }
    });
}

function clearStyles(text) {
    if (text == undefined) {
        return;
    }
    var p1 = text.indexOf('style="'), p2 = text.indexOf('"', (p1 + 7)), res;
    if (p1 > 0) {
        res = text.substring(0, p1) + text.substring(p2 + 1);
    } else {
        res = text;
    }
    res = res.replace("<p>undefined</p>", "");
    if (res.indexOf('<p><br></p>') !== -1 && res.indexOf('<p><br></p>') < 5) {
        res = res.replace("<p><br></p>", "");
        return clearStyles(res);
    }
    if (res.indexOf('<li><br></li>') !== -1) {
        res = res.replace("<li><br></li>", "");
        return clearStyles(res);
    }
    if (res.indexOf('<p>undefined</p>') !== -1) {
        res = res.replace("<p>undefined</p>", "");
        return clearStyles(res);
    }
    if (res.indexOf('<p class="ql-align-justify"> </p>') !== -1 ) {
        res = res.replace('<p class="ql-align-justify"> </p>', "");
        return clearStyles(res);
    }
    if (res.indexOf('<p class="ql-align-justify"><br></p>') !== -1) {
        res = res.replace('<p class="ql-align-justify"><br></p>', "");
        return clearStyles(res);
    }

    if (text != res) {
        return clearStyles(res);
    }
    return res;
}

function dateAddZero(num) {
    num = eval(num);
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

// function yearAddZero(num) {num=eval(num); if(num<1900) { num = "0000"; } return num; }

function initRegionList() {
    $('#selectRegionListModal .btn-info').click(function () {
        $('#resumeCity').val($('#selectRegionListModal input:checked').val());
        save();
    });
}

function initProfAreaList() {
    var profAreaContainer = $('#modalProfArea .modal-fieldset-container');
    var sel = profAreaContainer.find('.custom-control-input:checked');
    var size = sel.length;
    if (size >= 3) {
        profAreaContainer.find('.custom-control-input').not(':checked').prop('disabled', true);
    }
    $.post("/ajax.php", {action: "getProfAreaList"}, function (data) {
        profAreaContainer.find('.custom-control-input').unbind('click');
        profAreaContainer.find('.custom-control-input').click(function (e) {
            var sel = profAreaContainer.find('.custom-control-input:checked');
            var size = sel.length;
            if ($(this).prop('checked') === true) {
                if (size >= 3) {
                    profAreaContainer.find('.custom-control-input').not(':checked').prop('disabled', true);
                }
            } else {
                if (size < 3) {
                    profAreaContainer.find('.custom-control-input').prop('disabled', false);
                }
            }
        });
        $('#modalProfArea button.btn-info').off('click');
        $('#modalProfArea button.btn-info').on('click', function () {
            var sel = profAreaContainer.find('.custom-control-input:checked');
            var idList = [];
            sel.each(function () {
                idList.push($(this).attr('data-id'));
            });
            $.post('/ajax.php', {action: 'saveProfArea', idList: idList}, function (data) {
                console.log(data);
                $('.profAreaContainer .profArea').remove();
                $('.profAreaContainer .addProfArea').before(data);
                initProfAreaDel();
                reloadIFrame('resume-preview');
                status("Сохранено");
            })
        });
    });
}

function initProfAreaDel() {
    $('.profAreaContainer .profArea .selectr-tag-remove').off('click');
    $('.profAreaContainer .profArea .selectr-tag-remove').on('click', function () {
        var id = $(this).parent().attr('id');
        var listId = $('#' + id).attr('data-id');
        $.post('/ajax.php', {action: 'delProfArea', id: id}, function (data) {
            $('#' + id).remove();
            $('#modalProfArea .modal-fieldset-container .custom-control-input#idpa' + listId).prop('checked', false);
            $('#modalProfArea .modal-fieldset-container .custom-control-input').prop('disabled', false);
            reloadIFrame('resume-preview');
            status("Сохранено");
        });
    });
}

function initCollapse(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.draggble-item-wrapper').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('#' + id).find('.manage-btn-edit').on('click.collapse', function () {
            $(this).closest('.form-part').find('.draggble-item-wrapper').removeClass('open');
            if ($(this).attr("aria-expanded") == "false") {
                $(this).closest('.draggble-item-wrapper').addClass('open');
            }
        });
    });
}

function initPhone() {
    var pi = $('#resumePhone');
    pi.intlTelInput({
        autoHideDialCode: false,
        defaultCountry: "ru",
        onlyCountries: ['ru', 'kz', 'ua', 'by'],
        nationalMode: false,
    });
}

function initSocial(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.social').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.social#' + id).find('.editSocialList').selectpicker({iconBase: 'fab sn-icon'}).on('changed.bs.select', function () {
            $(this).parents('.social').find('.draggble-item').attr('data-type', $(this).val())
                .find('.draggble-list__icon i').attr('class', $(this).find('option[value=' + $(this).val() + ']').attr('data-icon') + ' sn-icon fab');
        });

        $('.social#' + id).find('.link').off('change.update').on('change.update', function () {
            var link = $(this).val();
            $(this).parents('.social').find('.titleName').html(escapeHtml(link)).attr('title', link).attr('href', link);
            $(this).parents('.social').find('.draggble-list__icon a').attr('href', link);
        });

    });

}

function initEducation(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.education').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.education#' + id).find('select.yearEnd').selectpicker().on('changed.bs.select', function () {
            var year = $(this).val();
            $('.education#' + id).find('.titleYearEnd').html(year);
            if (year > 0) {
                $('.education#' + id).find('.titleYearEndWord').removeClass('hide');
            } else {
                $('.education#' + id).find('.titleYearEndWord').addClass('hide');
            }
        });
        $('.education#' + id).find('select.editEducationLevelList').selectpicker();
        $('.education#' + id).find('.name').on('change.update', function () {
            var name = $(this).val();
            $('.education#' + id).find('.titleName').html(escapeHtml(name));
            $('.education#' + id).find('.titleName').attr('title', name);
        });
    });
}

function initCourse(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.course').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.course#' + id).find('.yearEnd').selectpicker().on('changed.bs.select', function () {
            var year = $(this).val();
            $('.course#' + id).find('.titleYearEnd').html(year);
            if (year > 0) {
                $('.course#' + id).find('.titleYearEndWord').removeClass('hide');
            } else {
                $('.course#' + id).find('.titleYearEndWord').addClass('hide');
            }
        });
        $('.course#' + id).find('.name').on('change.update', function () {
            var name = $(this).val();
            $('.course#' + id).find('.titleName').html(escapeHtml(name));
            $('.course#' + id).find('.titleName').attr('title', name);
        });
    });
}

function initLanguage(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.language').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.language#' + id).find('.name').selectpicker({iconBase: 'lang'}).on('changed.bs.select', function () {
            var html = $(this).find('option[value=' + $(this).val() + ']').html();
            $('.language#' + id).find('.titleName').html(html).attr('title', html);
        });
        $('.language#' + id).find('.level').selectpicker().on('changed.bs.select', function () {
            var html = $(this).find('option[value=' + $(this).val() + ']').html();
            $('.language#' + id).find('.titleLevel').html(html).attr('title', html);
        });
    });
}

function initExperience(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.experience').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.experience#' + id).find('select.monthStart').selectpicker().on('changed.bs.select', function () {
            $('.experience#' + id).find('.titleDateRange .monthStart').html($(this).find('option[value=' + $(this).val() + ']').html());
            checkExperienceDate(id);
        });
        $('.experience#' + id).find('select.yearStart').selectpicker().on('changed.bs.select', function () {
            $('.experience#' + id).find('.titleDateRange .yearStart').html($(this).find('option[value=' + $(this).val() + ']').val());
            checkExperienceDate(id);
        });
        $('.experience#' + id).find('select.monthEnd').selectpicker().on('changed.bs.select', function () {
            $('.experience#' + id).find('.titleDateRange .monthEnd').html($(this).find('option[value=' + $(this).val() + ']').html());
            checkExperienceDate(id);
        });
        $('.experience#' + id).find('select.yearEnd').selectpicker().on('changed.bs.select', function () {
            $('.experience#' + id).find('.titleDateRange .yearEnd').html($(this).find('option[value=' + $(this).val() + ']').val());
            checkExperienceDate(id);
        });
        $('#' + id).find('.stillWork').on('click', function () {
            checkExperienceDate(id);
        });
        $('.experience#' + id).find('.post').on('change.update', function () {
            var name = $(this).val();
            $('.experience#' + id).find('.titleName').html(escapeHtml(name)).attr('title', name);
        });
        initQuill('#responsibility' + id);
        $('.experience#' + id).find('.help').click(function (e) {
            e.preventDefault();
            showTooltip($(this), 'responsibility');
        });
    });
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

function showTooltip(obj, type) {
    var ttId = obj.attr('data-tooltip'), tt = $(ttId).find('input.postTooltip');
    if (type == 'responsibility') {
        var listObj = obj.closest('.experience').find('.ql-editor');
        tt.val(obj.closest('.experience').find('input.post').val());
    } else if (type == 'skill') {
        var listObj = $('#skillList');
        tt.val($('#resumePostName').val());
    }
    let post = tt.val();
    if (post == undefined || post == '') {
        post = $('#resumePostName').val();
    }
    getTooltips(post, listObj, type);
    $(ttId).offset({top: obj.offset().top, left: (obj.offset().left + obj.width() + 20)});
    $(window).resize(function () {
        $(ttId).offset({top: obj.offset().top, left: (obj.offset().left + obj.width() + 20)});
    });
    openTooltip(ttId);
    $('#ct-help .postTooltip').off('keyup').on('keyup', function () {
        getTooltips($(this).val(), listObj, type);
    });
}

function getTooltips(post, obj, type) {
    $.post("/ajax.php", {'action': 'getTooltips', 'type': type, 'post': post}, function (data) {
        if (isJson(data) === true) {
            data = JSON.parse(data);
        } else {
            console.log(data);
            return;
        }
        var posts = '', list = '',
            plusSrc = '/img/svg-icons/square-plus.svg',
            plus = '<img class="svgIcon" src="' + plusSrc + '">',
            checkSrc = '/img/svg-icons/square-check.svg',
            check = '<img class="svgIcon" src="' + checkSrc + '">';
        // console.log(data);
        $.each(data.posts, function () {
            posts += '<span>' + this + '</span>';
        });
        $('#ct-help .posts').html(posts).find('span').not(':first-child').off('click').on('click', function () {
            $('#ct-help .postTooltip').val($(this).html());
            getTooltips($(this).html(), obj, type);
        });
        $.each(data.list, function () {
            if (checkAddedListItem(this + '', obj, type) === true) {
                list += '<li class="active">' + check + '<span>' + this + '</span></li>';
            } else {
                list += '<li>' + plus + '<span>' + this + '</span></li>';
            }
        });
        $('#ct-help .list').html(list);
        $('#ct-help .list li').off('click').on('click', function () {
            if ($(this).hasClass('active')) {
                if (removeListItem($(this).find('span').html(), obj, type) === true) {
                    $(this).removeClass('active').find('img').attr('src', plusSrc);
                }
            } else {
                addListItem($(this).find('span').html(), obj, type);
                $(this).addClass('active').find('img').attr('src', checkSrc);
            }
        });
    });
}

function checkAddedListItem(listItem, listObj, type) {
    var result = false;
    if (type == 'responsibility') {
        listObj.find('li').each(function () {
            var r1 = trimChar(listItem.toLowerCase()), r2 = trimChar($(this).html().toLowerCase());
            if (r1 == r2) {
                result = true;
                return false;
            }
        });
    } else if (type == 'skill') {
        listObj.find('input.name').each(function () {
            var r1 = trimChar(listItem.toLowerCase()), r2 = trimChar($(this).val().toLowerCase());
            if (r1 == r2) {
                result = true;
                return false;
            }
        });
    }
    return result;
}

function addListItem(listItem, listObj, type) {
    if (type == 'responsibility') {
        if ($(listObj.find('ul').last()).is(':last-child')) {
            listObj.find('ul').last().append('<li>' + listItem + '</li>');
        } else {
            listObj.append('<ul><li>' + listItem + '</li></ul>');
        }
        save();
    } else {
        var blockId = addBlock(type, listItem);
    }
}

function removeListItem(listItem, listObj, type) {
    var result = false;
    if (type == 'responsibility') {
        listObj.find('li').each(function () {
            var r1 = trimChar(listItem.toLowerCase()), r2 = trimChar($(this).html().toLowerCase());
            if (r1 == r2) {
                $(this).remove();
                save();
                result = true;
            }
        });
    } else {
        listObj.find('.' + type).each(function () {
            var r1 = trimChar(listItem.toLowerCase()), r2 = trimChar($(this).find('input.name').val().toLowerCase());
            if (r1 == r2) {
                delBlock($(this).closest('.' + type).find('.manage-btn-delete'));
                result = true;
            }
        });
    }
    return result;
}

function trimChar(string, charsToRemove) {
    var defaultChars = [';', '.', '!', '?', ','];
    if (charsToRemove === undefined) {
        charsToRemove = defaultChars;
    }
    for (var i = charsToRemove.length - 1; i >= 0; i--) {
        while (string.charAt(0) == charsToRemove[i]) {
            string = string.substring(1);
        }
        while (string.charAt(string.length - 1) == charsToRemove[i]) {
            string = string.substring(0, string.length - 1);
        }
    }
    return string;
}

function initSkill(id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.skill').each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.skill#' + id).find('.name').on('change.update', function () {
            var name = $(this).val();
            $('.skill#' + id).find('.titleName').html(escapeHtml(name)).attr('title', name);
        });
        $('.skill#' + id).find('.skillLevels .form-control span').mouseover(function () {
            $(this).addClass('active').prevAll().addClass('active');
            skillHoverLevel($(this).find('input'));
        })
            .mouseout(function () {
                $(this).parent().find('span').removeClass('active');
                skillHoverLevel($(this).parent().find('input:checked'));
            })
            .find('input').off('change').click(function (e) {
            skillCheckLevel(this);
        });
        $('.skill#' + id).find('input:checked').each(function () {
            skillCheckLevel(this);
        });
    });
}

function skillCheckLevel(obj) {
    $(obj).attr('checked', 'checked').prop('checked', true);
    skillHoverLevel(obj);
}

function skillHoverLevel(obj) {
    $(obj).closest('.form-control').find('span').attr('class', 'checked');
    $(obj).parent().nextAll().removeClass('checked');
    var label = $(obj).closest('.form-group').find('label > span'),
        level = $(obj).val();
    label.html($(obj).attr('data-name')).removeClass('active');
    if (level > 1) {
        label.addClass('active');
    }
}

function loadCropperAfterImgLoad(img, img_width, img_height) {
    var winH = $(window).height(), winW = $(window).width(), img_aspect_ratio = img_width / img_height, padding = 15,
        buttonsHeight = 50, titleHeight = 30, modalWidthMax = 555 - padding * 2, modalWidth, modalHeight;
    if (winW <= 450) {
        buttonsHeight = 50;
    }
    if (modalWidthMax > (winW - padding * 4)) {
        modalWidthMax = winW - padding * 4;
    }
    var modalHeightMax = winH - padding * 6 - buttonsHeight - titleHeight;
    // console.log('img size',img_width,img_height);
    // console.log(['max',modalWidthMax,modalHeightMax,img_aspect_ratio]);
    if (img_width <= modalWidthMax) {
        modalWidth = modalWidthMax;
        if (img_height <= modalHeightMax) {
            modalHeight = img_height;
        } else {
            modalHeight = modalHeightMax;
        }
    } else {
        modalWidth = modalWidthMax;
        if (modalWidth / img_aspect_ratio <= modalHeightMax) {
            modalHeight = modalWidth / img_aspect_ratio;
        } else {
            modalHeight = modalHeightMax;
            modalWidth = modalHeight * img_aspect_ratio;
        }
    }

    $('.modal-body__photo').height(modalHeight);
    img.off('load.img2').attr('width', modalWidth).attr('height', modalHeight).cropper('destroy');
    setTimeout(function () {
        img.cropper({aspectRatio: 1});
        img.off('ready').on('ready', function () {
            img.removeClass('loading');
            img.addClass('loaded');
            $('#photoEditorModal .modal-body__photoDiv').attr('class', 'modal-body__photoDiv');
            $('#photoEditorModal .modalLoading').attr('class', 'modalLoading hidden');
        });
    }, 100);
}

function showCropperModal(result) {
    console.log(result);
    if (result && result.status && result.status == 'error') {
        alert(result.message);
        return;
    }
    var img = $('#photoEditorModal .modal-body__photo img.img-fluid');
    if (img.hasClass('loading')) {
        return;
    }
    if (img.hasClass('loaded') && result == false) {
        if ($('#photoEditorModal').attr('data-resize') == 'true') {
            $('#photoEditorModal').removeAttr('data-resize');
            result = 'resize';
        } else {
            return;
        }
    }
    img.addClass('loading');
    $('#photoEditorModal .modal-body__photoDiv').attr('class', 'modal-body__photoDiv hidden');
    $('#photoEditorModal .modalLoading').attr('class', 'modalLoading');
    var img_width, img_height, modal_sizes, modalWidth, modalHeight;
    if (result && result != 'resize') {
        img_width = result.size[0];
        img_height = result.size[1];
        // console.log('img size',img_width,img_height,img.get(0));
        loadCropperAfterImgLoad(img, img_width, img_height);
        img.attr('src', '/getimage.php?id=' + result.filename + '&temp=1&' + Math.random());
    } else {
        img.off('load.img').on('load.img', function () {
            img_width = img.get(0).naturalWidth;
            img_height = img.get(0).naturalHeight;
            // console.log('img size2',img_width,img_height,img.get(0));
            loadCropperAfterImgLoad(img, img_width, img_height);
        });
        img.trigger('load.img');
    }

    if (result == 'resize') {
        return;
    }
    $('#photoEditorModal #changeApect1x1').off('click').on('click', function () {
        $(this).parent().find('button').removeClass('active');
        $(this).addClass("active");
        img.cropper('setAspectRatio', 1);
    });
    $('#photoEditorModal #changeApect3x4').off('click').on('click', function () {
        $(this).parent().find('button').removeClass('active');
        $(this).addClass("active");
        img.cropper('setAspectRatio', 3 / 4);
    });
    $('#photoEditorModal #rotateLeft').off('click').on('click', function () {
        $(this).parent().find('button').removeClass('active');
        $(this).addClass("active");
        img.cropper('rotate', -90);
    });
    $('#photoEditorModal #rotateRight').off('click').on('click', function () {
        $(this).parent().find('button').removeClass('active');
        $(this).addClass("active");
        img.cropper('rotate', 90);
    });
    $('#photoEditorModal .btn-outline-info').off('click.save').on('click.save', function () {
        var cropOptions = img.data('cropper'),
            containerSize = img.cropper('getContainerData'),
            data = {
                cropSize: img.cropper('getData'),
                cropBoxData: img.cropper('getCropBoxData'),
                canvasData: img.cropper('getCanvasData'),
                imageSize: img.cropper('getImageData'),
                aspect: cropOptions.options.aspectRatio
            };
        console.log(data);
        $.ajax({
            method: "POST",
            url: '/crop.php',
            data: data
        }).done(function (callback) {
            console.log(callback);
            if (callback == 'error')
                alert('Выберите хотя бы часть изображения');
            else if (callback == 'unsupported')
                alert('Выбранный формат не поддерживается');
            else
                $('.resume-photo-edit__buttons').removeClass('hide');
            $('.resume-photo-edit .uploadLabel').addClass('hide');
            $('.profile-photo-container').removeClass('add');
            $('#resumeFileUpload').addClass('hide');
            $('.resume-photo-edit img.avatar').attr('src', callback);
            $.post("/ajax.php", {'action': 'getUserPhoto'}, function (data) {
                $('header .profile-menu__avatar').removeClass('noIcon').find('img').attr('src', data);
            });
            reloadIFrame('resume-preview');
            status("Сохранено");
        });
    });
}

function delPhoto() {
    $.post("/ajax.php", {action: "delPhoto"}, function (data) {
        console.log(data);
        var src = '/images/form-edit/foto_grey.png';
        $('.resume-photo-edit img.avatar').attr('src', src);
        $('.profile-menu__avatar').addClass('noIcon').find('img.img-fluid').attr('src', data);
        $('.resume-photo-edit__buttons').addClass('hide');
        $('.resume-photo-edit .uploadLabel').removeClass('hide');
        $('.profile-photo-container').addClass('add').off('click').click(function () {
            console.log();
            $('#resumeFileUpload').trigger('click');
        });
        reloadIFrame('resume-preview');
    });
}


function initQuill(id) {
    if (!$(id).length) {
        return;
    }
    var toolbarOptions = [
        ['bold', 'italic', 'underline'],
        [{'align': ''}, {'align': 'right'}, {'align': 'center'}, {'align': 'justify'}],
        [{'list': 'bullet'}], //, { 'list': 'ordered'}
        ['link'],
    ];

    var quill = new Quill(id, {
        theme: 'snow',
        scrollingContainer: 'editor-block',
        modules: {
            toolbar: toolbarOptions,
            history: {
                delay: 2000,
                maxStack: 50,
                userOnly: true
            }
        }
    });
}

function checkExperienceDate(id) {
    var dr = {};
    var ms = eval($('.experience#' + id + ' .monthStart option:selected').val());
    if (ms) {
        dr["ms"] = ms;
    }
    var ys = eval($('.experience#' + id + ' .yearStart option:selected').val());
    if (ys) {
        dr["ys"] = ys;
    }
    var me = eval($('.experience#' + id + ' .monthEnd option:selected').val());
    if (me) {
        dr["me"] = me;
    }
    var ye = eval($('.experience#' + id + ' .yearEnd option:selected').val());
    if (ye) {
        dr["ye"] = ye;
    }
    var sw = $('.experience#' + id + ' .stillWork').prop('checked');
    if (sw) {
        console.log(sw)
    }
    ;
    var drl = Object.keys(dr).length;
    if (drl == 4 || dr["ms"] && dr["ys"] && sw) {
        $('.experience#' + id + ' .titleDateRange').attr('class', 'titleDateRange');
        if (sw) {
            $('.experience#' + id).find('.titleDateRange .monthEnd').html('н. в.');
            $('.experience#' + id).find('.titleDateRange .yearEnd').html('');
        } else {
            $('.experience#' + id).find('.titleDateRange .monthEnd').html($('.experience#' + id + ' .monthEnd option:selected').html());
            $('.experience#' + id).find('.titleDateRange .yearEnd').html($('.experience#' + id + ' .yearEnd option:selected').html());
        }
        return true;
    } else {
        $('.experience#' + id + ' .titleDateRange').attr('class', 'titleDateRange hide');
        return false;
    }
}

function addCustomBlock(obj) {
    var block = $(obj).attr('data-type');
    if ($('#form-part-' + block).length > 0) {
        return;
    }
    if ($(obj).hasClass('disabled')) {
        return;
    }
    $(obj).addClass('disabled');
    $.post("/ajax.php", {
        'action': 'addCustomBlock',
        'blockType': block,
        resumeId: $('#resumeName').attr('data-id')
    }, function (data) {
        var id = $(data).attr('id');
        $('.form-parts-draggable').append(data);
        $('#form-part-' + block + ' .addBlock').on('click', function (e) {
            e.preventDefault();
            if ($(this).hasClass('disabled')) {
                return false;
            }
            addBlock($(this).attr('data-type'));
        });
        initDelBlock(block);
        if (block == 'custom') {
            initCustomeEdit();
            initSwitcher();
        }
        initDragBlock();
        saveBlockSort();
        if (block == 'hobbies' || block == 'custom') {
            initQuill('#' + block);
            if (block == 'custom') {
                $('#form-part-custom [data-toggle="tooltip"]').tooltip();
            }
        } else {
            initCustomBlock(block);
            $('#' + id).find('.name').focus();
            initDel($('.' + block).attr('id'));
            initDrag();
        }
        initSave();
        save();
    });
}

function initCustomeEdit() {
    $('#form-part-custom .legend > .manage-btn-edit').off('click').on('click', function () {
        $(this).parent().find('span').attr('contenteditable', true).focus().off('blur').on('blur', function () {
            $(this).removeAttr('contenteditable');
            save();
        });
        // console.log(html());
    });
}

function addBlock(block, name) {
    $('.form-part-' + block + ' .addBlock').addClass('disabled');
    $.post("/ajax.php", {
        'action': 'addBlock',
        'blockType': block,
        resumeId: $('#resumeName').attr('data-id')
    }, function (data) {
        var id = $(data).attr('id');
        $('.' + block + ' .manage-btn.manage-btn-edit').attr('aria-expanded', 'false').closest('.draggble-item-wrapper').removeClass('open');
        $('.' + block + ' .edit-drag-item').removeClass('show');
        $('#' + block + 'List').append(data);
        var scrollTop = $('#' + block + 'List .' + block + ':last-child').offset().top;
        setTimeout(function () {
            $('html, body').animate({scrollTop: scrollTop - 70}, 300);
        }, 200);
        switch (block) {
            case 'phone':
                initPhone();
                break;
            case 'social':
                initSocial(id);
                break;
            case 'education':
                initEducation(id);
                break;
            case 'course':
                initCourse(id);
                break;
            case 'language':
                initLanguage(id);
                break;
            case 'experience':
                initExperience(id);
                break;
            case 'skill':
                initSkill(id);
                break;
            case 'quality':
                initCustomBlock('quality', id);
                break;
            case 'recommendation':
                initCustomBlock('recommendation', id);
                break;
            case 'publication':
                initCustomBlock('publication', id);
                break;
            default:
                $('.form-part-' + block + ' .addBlock').removeClass('disabled');
                return;
        }
        initDel(id);
        initSave();
        initDrag();
        initCollapse(id);
        if (name !== undefined) {
            $('.' + block + '#' + id + ' .titleName').html(name);
            $('#' + block + id + ' .name').val(name);
        }
        save();
        $('.form-part-' + block + ' .addBlock').removeClass('disabled');
    });
}

function initCustomBlock(block, id) {
    var idList = [];
    if (id !== undefined) {
        idList.push(id);
    } else {
        $('.' + block).each(function (index, element) {
            idList.push($(this).attr('id'));
        });
    }
    $.each(idList, function (index, id) {
        $('.' + block + '#' + id).find('.name').on('change.update', function () {
            var name = $(this).val();
            $('.' + block + '#' + id).find('.titleName').html(escapeHtml(name)).attr('title', name);
        });
        if (block == 'recommendation') {
            $('.' + block + '#' + id).find('.company').on('change.update', function () {
                $('.' + block + '#' + id).find('.titleCompany').html(escapeHtml($(this).val()));
            });
        }
        if (block == 'publication') {
            $('.' + block + '#' + id).find('select.dateYear').selectpicker().on('changed.bs.select', function () {
                var year = $(this).find('option[value=' + $(this).val() + ']').val();
                $('.' + block + '#' + id).find('.titleDate .titleYear').html(year);
                if (year > 1000) {
                    $('.' + block + '#' + id).find('.titleDate').removeClass('hide');
                } else {
                    $('.' + block + '#' + id).find('.titleDate').attr('class', 'titleDate hide');
                }
            });
            $('.' + block + '#' + id).find('select.dateMonth').selectpicker().on('changed.bs.select', function () {
                $('.' + block + '#' + id).find('.titleDate .titleMonth').html($(this).find('option[value=' + $(this).val() + ']').val());
            });
        }
    });
}


function initDel(id) {
    var sel;
    if (id !== undefined) {
        sel = $('#' + id + ' .manage-btn-delete');
    } else {
        sel = $('.draggble-item-wrapper .manage-btn-delete');
    }
    sel.on('click', function (e) {
        e.preventDefault();
        // console.log(className,delId);
        delBlock($(this));
    });
}

function delBlock(obj) {
    var type = obj.parents('.draggble-item-wrapper').attr('data-type');
    var delId = obj.parents('.draggble-item-wrapper').attr('id');
    console.log({action: 'delBlock', id: delId, type: type, resumeId: $('#resumeName').attr('data-id')});
    $.post("/ajax.php", {
        action: 'delBlock',
        id: delId,
        type: type,
        resumeId: $('#resumeName').attr('data-id')
    }, function (data) {
        console.log(data);
        if (data == 'deleted') {
            $('#' + delId).remove();
            reloadIFrame('resume-preview');
            status("Сохранено");
        }
    });
}

function initDrag() {
    $(".draggble").sortable({
        handle: ".manage-btn_drag", tolerance: "pointer", placeholder: "sortable-placeholder draggble-item",
        sort: function (event, ui) {
            var top = event.pageY - (ui.helper.outerHeight(true) / 2);
            ui.helper.offset({top: top});
        },
        update: function () {
            save();
        }
    });
}

function initDragBlock() {
    $(".form-parts-draggable").sortable({
        handle: ".manage-btn_drag-block", tolerance: "pointer", placeholder: "sortable-placeholder-block draggble-item",
        sort: function (event, ui) {
            var top = event.pageY - 14;
            ui.helper.offset({top: top});
        },
        start: function (event, ui) {
            if (ui.item.height() > 235) {
                $('.sortable-placeholder-block').height(235);
                ui.item.height(235);
            }
        },
        stop: function (event, ui) {
        },
        // start: function(event, ui) {console.log(event,ui);},
        update: function () {
            saveBlockSort();
        }
    });
}

function initDelBlock(block) {
    var sel;
    if (block !== undefined) {
        sel = $('#form-part-' + block + ' .legend > .manage-btn-delete');
    } else {
        sel = $('.form-parts-draggable .legend > .manage-btn-delete');
    }
    $(sel).off('click').on('click', function () {
        var blockId = $(this).closest('.form-part').attr('data-id'), obj = $(this);
        block = $(this).closest('.form-part').attr('data-type');
        $('.addCustomBlock[data-type="' + block + '"]').removeClass('disabled');
        $.post("/ajax.php", {
            action: 'delCustomBlock',
            id: blockId,
            resumeId: $('#resumeName').attr('data-id')
        }, function (data) {
            console.log(data);
            if (data == 'deleted') {
                $(obj).closest('.form-part').remove();
                reloadIFrame('resume-preview');
                status("Сохранено");
            }
        });
    });
}

function saveBlockSort() {
    var sort = [];
    $('.form-parts-draggable .form-part').each(function (k, v) {
        sort.push($(this).attr('data-id'));
    });
    saveOptions({'sort': sort});
}

function initPanel(context) {
    if (context == undefined) {
        context = ".resume-list";
    } else {
        context = "#" + context;
        $(context).tooltip();
    }
    if (!$('.resume-panel').length) {
        return;
    }
    $(context + ' [data-toggle="tooltip"]').tooltip();
    $(context + ' .manage-button').on('click', function (e) {
        e.preventDefault();
    });
    initModal();
    $(context + ' .manage-button_delete').on('click', function (e) {
        var name = $(this).parents('.resume-panel').find('.resume-panel__name .text-12').val();
        $('#confirmDelete .resumeName').html(escapeHtml(name));
        $('#confirmDelete .delete').attr('data-id', $(this).parents('.resume-panel').attr('id'));
    });
    $(context + ' .manage-button_copy').on('click', function (e) {
        var json = {action: "copyResume", resumeId: $(this).parents('.resume-panel').attr('id')};
        $.post("/ajax.php", json, function (data) {
            $('.resume-list').prepend(data);
            initPanel($(data).attr('id'));
        });
    });
    $(context + ' .manage-button_edit, ' + context + ' .editResume input').on('click', function (e) {
        initEditLink(this);
    });


    $(context + ' .manage-button_share').on('click', function (e) {
        var name = $(this).parents('.resume-panel').find('.editResume input').val();
        $('#shareModalLabel').html('Доступ к резюме: ' + escapeHtml(name));
        var id = $(this).parents('.resume-panel').attr('id'), link = "https://myresume.ru/resume/" + id + "/";
        $('#shareModal .link').html(link);
        $('#shareModal a.btn-outline-success').attr('href', link);
        $('#shareModal').attr("data-id", id);
        $('#shareModal').attr('data-instance', "list");
        if ($(this).parents('.resume-panel').attr('data-public') == '1') {
            $(".disableDiv, .disableInfo").addClass("hide");
            $('#openResumeModalSwitcher').prop("checked", true);
        } else {
            $(".disableDiv, .disableInfo").removeClass("hide");
            $('#openResumeModalSwitcher').prop("checked", false);
        }
        $("#shareModal .social-likes").socialLikes({
            url: 'https://myresume.ru/resume/' + id + '/',
            title: "Резюме: " + $(this).parents('.resume-panel').attr('data-post'),
            data: false,
        });
        //$('#confirmDelete .delete').attr('data-id',$(this).parents('.resume-panel').attr('id'));
    });

    initPDFAndPrint('list', context);
    initRename();
}

function dopdf(obj, resumeId) {
    if ($(obj).hasClass('disabled')) {
        return false;
    }
    $(obj).addClass('disabled');
    var holder = window.open("/files/holder.html", 'document');
    $.post("/createhtml.php", {do: "pdf", resumeId: resumeId, check: "resumePdf"}, function (data) {
        if (isJson(data) === true && 0) { // откл, баг с сохранением
            data = JSON.parse(data);
            if (data.exist == 1 && data.equal == 1) {
                openPdfWindow(obj, resumeId);
                return false;
            }
        }
        $.post("/ajax.php", {action: "dopdf", resumeId: resumeId}, function (data) {
            openPdfWindow(obj, resumeId);
        });
    });
}

function openPdfWindow(obj, resumeId) {
    $(obj).removeClass('disabled');
    window.open('/resume.php?id=' + resumeId, 'document');
}

function print() {
    var holder = window.open("/preview/?print=1", 'document');
}

function modalShare(name, resumeId, instance) {
    //modalShare($('#resumeName').val(), $('#shareModal').attr('data-id'), 'preview');
    $('#shareModal').attr('data-instance', instance);
    // if(instance=="list") {state=$(".list_file li.selected span.public").attr("id").substring(2);}
    // else if(instance=="preview") { state=$(".preview .list_shared .share").hasClass("public")?1:0; }
    // if(state=="1"){
    //   $('.wrapper_modal.share .switch input').prop("checked",true);
    //   $('.wrapper_modal.share .input-group #resume-link').removeClass("disabled");
    // }
    // else{
    //   $('.wrapper_modal.share .switch input').prop("checked",false);
    //   $('.wrapper_modal.share .input-group #resume-link').addClass("disabled");
    // }
    // $('.wrapper_modal.share .input-group #resume-link').html(siteUrl+"/resume/"+resumeId);
    // $('.wrapper_modal.share .input-group #resume-link-preview').attr("href", siteUrl+"/resume/"+resumeId+"?"+Math.random());

    $('#shareModalLabel').html("Доступ к резюме: " + escapeHtml(name));
    if (instance == "list") {
        $('#shareModal').attr("data-id", resumeId);
    }
    updateTempHtmlAndResumeImage();
    // $('.wrapper_modal.share label:first-child').html("Открыть резюме для просмотра?");
    // $('.wrapper_modal.share').fadeIn();
    // enterClose('.wrapper_modal.share');
    // $(document).mouseup(function (e){ // событие клика по веб-документу
    //   var div = $(".wrapper_modal.share .modal"); // тут указываем ID элемента
    //   if (!div.is(e.target) // если клик был не по нашему блоку
    //     && div.has(e.target).length === 0 ) { // и не по его дочерним элементам
    //     div.parent().fadeOut('slow');
    //     $(document).unbind("mouseup");
    //   }
    // });
}

function share() {
    var sw = $('#openResumeModalSwitcher').parent().parent(),
        swi = $('#openResumeModalSwitcher'),
        link = $('#shareModal .form-control.link'),
        btn = $('#shareModal .btn.btn-outline-info.viewPublic'),
        id = $('#shareModal').attr("data-id"),
        instance = $('#shareModal').attr('data-instance'),
        json;
    if (swi.prop("checked")) {
        link.removeClass("disabled");
        btn.removeAttr("disabled");
        swi.prop("disabled", true);
        sw.addClass("disabled");
        json = {action: "setShare", state: "on", resumeId: id, instance: instance};
        $.post("/ajax.php", json, function (data) {
            if (data.substring(0, 7) == "Error: ") {
                console.log(data.substring(7));
                return;
            }
            if (data == "1") {
                sw.removeClass("disabled");
                swi.prop("disabled", false);
                $(".disableDiv, .disableInfo").addClass("hide");
                if (instance == "list") {
                    $('.resume-panel#' + id).attr("data-public", 1).find('.resume-panel__avatar').removeClass('avatar_is_offline').addClass('avatar_is_online');
                    $('.resume-panel#' + id).find('.resume-panel__status').removeClass('resume-panel__status_is_offline').addClass('resume-panel__status_is_online').html("Публикация онлайн");
                }
            }
            console.log(data);
        });
    } else {
        link.addClass("disabled");
        btn.attr("disabled", "disabled");
        swi.prop("disabled", true);
        sw.addClass("disabled");
        json = {action: "setShare", state: "off", resumeId: id, instance: instance};
        $.post("/ajax.php", json, function (data) {
            if (data.substring(0, 7) == "Error: ") {
                console.log(data.substring(7));
                return;
            }
            if (data == "1") {
                sw.removeClass("disabled");
                swi.prop("disabled", false);
                $(".disableDiv, .disableInfo").removeClass("hide");
                if (instance == "list") {
                    $('.resume-panel#' + id).attr("data-public", 0).find('.resume-panel__avatar').addClass('avatar_is_offline').removeClass('avatar_is_online');
                    $('.resume-panel#' + id).find('.resume-panel__status').addClass('resume-panel__status_is_offline').removeClass('resume-panel__status_is_online').html("Не опубликовано");
                }
            }
            console.log(data);
        });
    }
}

function addResume() {
    $.post("/ajax.php", {action: "addResume"}, function (data) {
        $('.resume-list').prepend(data);
        initPanel($(data).attr('id'));
    });
}

function deleteResume() {
    var resumeId = $('#confirmDelete .delete').attr('data-id'),
        json = {action: "deleteResume", resumeId: resumeId};
    $.post("/ajax.php", json, function (data) {
        if (data == "deleted") {
            $("#" + resumeId).remove();
        } else {
            console.log(data);
        }
    });
}


function saveSettings() {
    var pass1 = $(".settings #password1").val(),
        pass2 = $(".settings #password2").val(),
        passOld = $(".settings #passwordOld").val(),
        pcd = $(".pass-check");
    if (!passOld) {
        pcd.removeClass("match").addClass("different");
        pcd.find(".text-danger span").html("Введите старый пароль!");
        return;
    }
    var json = {"action": "saveSettings", "passOld": passOld};
    if (pass1.length > 0 && pass2.length > 0) {
        json.pass1 = pass1;
        json.pass2 = pass2;
    }
    $.post("/ajax.php", json, function (data) {
        console.log(data);
        if (data.substring(0, 7) == "Error: ") {
            $(".pass-check").removeClass("match").addClass("different");
            pcd.find(".text-danger span").html("Старый пароль не подходит!");
            return;
        }
        $(".pass-check").removeClass("different").addClass("match");
    });
}

function validateForm() {
    var letter = /[a-zA-Zа-яА-Я]/,
        number = /[0-9]/,
        count = 0,
        password = $("#password1").val(),
        password2 = $("#password2").val();

    if (letter.test(password)) {
        $(".settings .s").attr("class", "s ok");
        count++;
    } else {
        $(".settings .s").attr("class", "s");
    }
    if (number.test(password)) {
        $(".settings .d").attr("class", "d ok");
        count++;
    } else {
        $(".settings .d").attr("class", "d");
    }
    if (password.length > 4) {
        $(".settings .l").attr("class", "l ok");
        count++;
        if (password == password2) {
            $(".settings .eq").attr("class", "eq ok");
            count++;
        } else {
            $(".settings .eq").attr("class", "eq");
        }
    } else {
        $(".settings .l").attr("class", "l");
    }
    if (count == 4) {
        $(".settings .errorMessage > span").attr("class", "ok");
        return true;
    } else {
        $(".settings .errorMessage > span").attr("class", "");
    }
    return false;
}

function changeEmail(email) {
    $.post("/ajax.php", {action: "changeEmail", email: email}, function (data) {
        var ce = $(".changeEmail");
        if (data.substring(0, 7) == "Error: ") {
            ce.removeClass("ok").addClass("error");
            ce.find(".text-danger span").html(data.substring(7));
            return;
        } else if (data != 1) {
            console.log(data);
            ce.removeClass("ok").addClass("error");
            return;
        }
        ce.removeClass("error").addClass("ok");
        var h = $("header .header__menu .profile-menu__user span");
        if (h.html().indexOf("@") !== -1) {
            h.html(email);
        }
    });
}

function validateEmail(mail) {
    if (!mail.length) {
        return 0;
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z0-9_\-\.]{2,10})$/;
    if (reg.test(mail) == false) {
        return false;
    } else {
        return true;
    }
}

function regionComplete(obj) {
    var city = $(obj).val();
    $.post("/ajax.php", {action: "regionComplete", city: city}, function (data) {
        $('#dropDownSearchContent').html(data);
        $('#dropDownSearchContent li').off('click').on('click', function () {
            $(obj).val($(this).attr("data-city"));
        });
    });
}

function changeModal(obj) {
    $(document).off('focusin');
    if ($(obj).hasClass('login')) {
        $('.tabs_register').removeClass('active');
        $('.tabs_login').addClass('active');
        $('#login .registration .title_first').html('Для регистрации введите данные:');
    }
    if ($(obj).hasClass('share-icon__pdf')) {
        $('.tabs_login').removeClass('active');
        $('.tabs_register').addClass('active');
        $('#login .registration .title_first').html('Для скачивания резюме - зарегистрируйтесь:');
    }
    if ($(obj).hasClass('share-icon__share')) {
        $('.tabs_login').removeClass('active');
        $('.tabs_register').addClass('active');
        $('#login .registration .title_first').html('Для размещения резюме онлайн - зарегистрируйтесь:');
    }
    if ($(obj).hasClass('share-icon__print')) {
        $('.tabs_login').removeClass('active');
        $('.tabs_register').addClass('active');
        $('#login .registration .title_first').html('Для распечатывания резюме - зарегистрируйтесь:');
    }
}

function initEditLink(obj) {
    var json = {action: "changeActiveResumeId", resumeId: $(obj).parents('.resume-panel').attr('id')};
    $.post("/ajax.php", json, function (data) {
        if (data == 1) {
            window.location.href = "/edit/";
        }
    });
}

function changeResumeName(obj) {
    var i = $(obj).parent().find('input');
    i.off('click');
    resizeInput(i);
    i.removeAttr('readonly').focus().off('blur').on('blur', function () {
        i.attr('title', i.val());
        i.attr('readonly', 'readonly').off('click').on('click', function (e) {
            e.preventDefault();
            initEditLink(this);
        });
        $.post('/ajax.php', {
            action: 'changeResumeName',
            resumeId: $(obj).parents('.resume-panel').attr('id'),
            name: i.val()
        }, function (data) {
            console.log(data);
        });
    });
}

function resizeInput(i) {
    var b = $('.input-buffer');
    b.text(i.get(0).value.replace(/ /ig, "'"));
    i.width(b.width() + 5);
    i.off('input').on('input', function () {
        b.text(i.get(0).value.replace(/ /ig, "'"));
        i.width(b.width() + 5);
    });
}

function initRename() {
    $('.title-edit-switcher').off('click').on('click', function () {
        changeResumeName(this);
    });
    $('.editResume input').off('keypress').on('keypress', function (e) {
        if (e.which == 13) {
            $(this).trigger('blur');
        }
    })
        .each(function () {
            resizeInput($(this));
        });
}

function initPDFAndPrint(instance, context) {
    if (context == undefined) {
        context = "";
    }
    if (instance == "edit") {
        $('.dopdf').not(".accessFull").not(".accessRegister").on('click', function (e) {
            e.preventDefault();
            dopdf(this, $('#resumeName').attr('data-id'));
        });
        $('.print').not(".accessFull").not(".accessRegister").on('click', function (e) {
            e.preventDefault();
            print();
        });
        return;
    }

    $(context + ' .manage-button_print:not(.accessFull)').on('click', function (e) {
        var holder = window.open("/files/holder.html", 'document');
        var json = {action: "changeActiveResumeId", resumeId: $(this).parents('.resume-panel').attr('id')};
        $.post("/ajax.php", json, function (data) {
            if (data == 1) {
                holder.open("/preview/?print=1", 'document');
            }
        });
    });

    $(context + ' .manage-button_download:not(.accessFull)').on('click', function (e) {
        var obj = this;
        // var holder = window.open("/files/holder.html",'document');
        var json = {action: "changeActiveResumeId", resumeId: $(this).parents('.resume-panel').attr('id')};
        $.post("/ajax.php", json, function (data) {
            if (data == 1) {
                dopdf(obj, $(obj).closest('.resume-panel').attr('id'));
            }
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// preview


function printTpl(value) {
    $(".loader-div").fadeIn("slow");
    $(".control .designs").addClass("disabled");
    $.post("/ajax.php", {"action": "ptintTpl", "tpl": value}, function (data) {
        $(".resume-preload").html($(".resume-html").html());
        setTimeout(function () {

            $(".resume-html").css("display", "none");
            $(".resume-preload").css("display", "block");
            $(".resume-html .resume").removeClassLike("tpl");
            $(".resume-html .resume").addClass("tpl" + value);
            $(".resume-html").html(data);
            // object = $('<div class="resume-preload"/>').html(data);
            setTimeout(function () {
                // $(".right.db_min .resume-html").html($(".resume-preload").html());
                // object.detach().prependTo('.resume-html');
                $(".resume-preload").css("display", "none");
                $(".resume-html").css("display", "block");
                $(".loader-div").fadeOut("slow");
                $(".control .designs").removeClass("disabled");
                // saveControls(0);
                // reset();
            }, 0);
        }, 200);
    });
}

function saveControls(t) {
    if (t == void 0) {
        t = 500;
    }
    setTimeout(function () {
        // updateTempHtmlAndResumeImage();
        $(".control .slider input").each(function () {
            $(this).data("ionRangeSlider").update({"disable": true});
        });
        $(".control select#font").prop("disabled", "disabled").niceSelect('update');
        $.post("/ajax.php", {
            "action": "saveControls",
            "styles": $(".resume").attr("class"),
            resumeId: $('#resumeName').attr('data-id')
        }, function (data) {
            console.log(data);
            setTimeout(function () {
                $(".control .slider input").each(function () {
                    $(this).data("ionRangeSlider").update({"disable": false});
                });
                $(".control select#font").prop("disabled", false).niceSelect('update');
            }, t * 2);
        });
    }, t);
}

function updateTempHtmlAndResumeImage(resumeId) {
    if (resumeId == void 0) {
        resumeId = false;
    }
    $('#resumePreview .loader').css('display', 'inline');
    $('#resumePreview .resumePreviewImage').css('display', 'none');
    var json = {do: "pdf", check: "resumeImage"};
    if (resumeId !== false) {
        json.resumeId = resumeId;
    }
    $.post("/createhtml.php", json, function (data) {
        console.log(data);
        if (isJson(data) === true) { //console.log(data);
            data = JSON.parse(data);
            if (data.exist == 1 && data.equal == 1) {
                updateResumePreviewImage(resumeId);
                return false;
            }
        }
        $.post("/ajax.php", {action: "doResumeImage", resumeId: resumeId}, function (data) {
            updateResumePreviewImage(resumeId);
        });
    });
}

function updateResumePreviewImage(resumeId) {
    let newSrc = $('#resumePreview .resumePreviewImage').attr('data-src') + '?' + Math.random();
    if (resumeId !== false) {
        newSrc = '/images/resume/' + resumeId + '.png?' + Math.random();
    }
    $('#resumePreview .loader').css('display', 'none');
    $('#resumePreview .resumePreviewImage').css('display', 'block').attr('src', newSrc);
}

function reset() {
    return;
    setTimeout(function () {
        hp = 1123;
        //$(".resume .content-bar, .resume .side-bar").css("height","");
        sb = document.getElementsByClassName("side-bar body")[0];
        cb = document.getElementsByClassName("content-bar body")[0];
        sh = document.getElementsByClassName("side-bar head")[0];
        ch = document.getElementsByClassName("content-bar head")[0];
        sf = document.getElementsByClassName("side-bar footer")[0];
        cf = document.getElementsByClassName("content-bar footer")[0];
        if (!sb || !sh || !sf || !cb || !ch || !cf) {
            return;
        }
        hsb = sb.offsetHeight;
        hcb = cb.offsetHeight;
        hb = Math.max(hsb, hcb);
        hsh = sh.offsetHeight;
        hch = ch.offsetHeight;
        hh = Math.max(hsh, hch);
        hsf = sf.offsetHeight;
        hcf = cf.offsetHeight;
        hf = Math.max(hsf, hcf);
        sb.style.height = hb + "px";
        cb.style.height = hb + "px";
        sh.style.height = hh + "px";
        ch.style.height = hh + "px";
        sf.style.height = hf + "px";
        cf.style.height = hf + "px";
        // $(".resume .content-bar.head, .resume .side-bar.head").height(hh);
        // $(".resume .content-bar.footer, .resume .side-bar.footer").height(hf);
        h = hb + hh + hf;
        ps = Math.ceil(h / hp);
        h = ps * hp - hh - hf;
        $(".resume .content-bar.body, .resume .side-bar.body").height(h);
        $(".pager").remove();
        for (var p = 1; p < ps; p++) {
            top1 = p * hp;
            dp = "<div style='top:" + top1 + "px' class='pager noprint'><div>" + p + " стр</div><div>" + (p + 1) + " стр</div></div>";
            $(".resume").append(dp);
        }
    }, 200);
}


// setTimeout(function(){ hp=1123;
// sb=document.getElementsByClassName("side-bar body")[0]; cb=document.getElementsByClassName("content-bar body")[0];
// sh=document.getElementsByClassName("side-bar head")[0]; ch=document.getElementsByClassName("content-bar head")[0];
// sf=document.getElementsByClassName("side-bar footer")[0]; cf=document.getElementsByClassName("content-bar footer")[0];
// hsb=sb.offsetHeight; hcb=cb.offsetHeight; hb=Math.max(hsb,hcb);
// hsh=sh.offsetHeight; hch=ch.offsetHeight; hh=Math.max(hsh,hch);
// hsf=sf.offsetHeight; hcf=cf.offsetHeight; hf=Math.max(hsf,hcf);
// sb.style.height=hb+"px";cb.style.height=hb+"px";
// sh.style.height=hh+"px";ch.style.height=hh+"px";
// sf.style.height=hf+"px";cf.style.height=hf+"px";
// h=hb+hh+hf; ps=Math.ceil(h/hp); h=ps*hp-hh-hf;
// b=document.getElementsByTagName("body")[0];
// style = document.createElement( "style" );
//  style.type = "text/css";
//  stb = ".content-bar.body,.side-bar.body {min-height: "+h+"px !important; } ";
//  sth = ".content-bar.head,.side-bar.head {height: "+hh+"px !important; } ";
//  stf = ".content-bar.footer,.side-bar.footer {height: "+hf+"px !important;} ";
// st="@media print {"+stb+sth+stf+"}";
// style.innerHTML = st;
// b.appendChild(style);
// },100);
// history.pushState(null, null, location.origin+location.pathname);

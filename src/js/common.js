'use strict';

// Closest Polyfill for IE
(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {
            return null
        }
        else return this.parentElement.closest(selector)
    };
}(Element.prototype));


// Toggle ClassName
var openedClass = 'opened';

function toggle(e) {
    var el = e.target;
    if (el.closest('.js-button')) {
        var parentBlock = el.closest('.js-wrap');
        parentBlock.classList.toggle(openedClass);
        e.preventDefault();
    }
}

// Animate Nav Scroll
function animateScroll(el, e) {
    var link = el.attr('href');
    TweenLite.to(window, 1, {scrollTo: link});
    e.preventDefault();
}


document.addEventListener('DOMContentLoaded', function() {
    $(function () {
        var data = {
            rss_url: 'https://blog.chronobank.io/feed'
        };
        $.get('https://api.rss2json.com/v1/api.json', data, function (response) {
            if (response.status == 'ok') {
                var html = '';
                $.each(response.items, function (k, item) {
                    if(k < 4){
                        var self = item;
                        var title, url, descr, img, pic;

                        title = self.title;
                        url = self.link;
                        var yourString = item.description.replace(/<img[^>]*>/g,""); //replace with your string.
                        yourString = yourString.replace(/<p[^>]*>/g,"");
                        yourString = yourString.replace(/<em[^>]*>/g,"");
                        var maxLength = 120; // maximum number of characters to extract
                        //trim the string to the maximum length
                        var trimmedString = yourString.substr(0, maxLength);
                        //re-trim if we are in the middle of a word
                        descr = trimmedString.substr(Math.max(0, trimmedString.lastIndexOf(">") + 1), Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
                        var tagIndex = item.description.indexOf('<img');
                        var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
                        var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
                        var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
                        var pic = item.description.substring(srcStart, srcEnd); // Extract just the URL

                        console.log(title, url, pic, descr);

                        html = html + '<a class="news__block" target="_blank" href="' + url + '"><div class="news__pic" style="background-image: url(' + pic + ')"></div><h4 class="news__block_title">' + title + '</h4><p class="news__block_descr">' + descr + '...</p></a>'

                    }
                    $('.news__container').html(html);
                });
            }
        })
    });



    // Nav
    $('.nav__i').on('click', function () {
        $('.nav__block').fadeIn(300);
    });
    $('.js-close-menu').on('click', function () {
        $('.nav__block').fadeOut(300);
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $('.nav__block').fadeOut(300);
        }
    });
    $('.js-nav-sec').on('click', function (e) {
        var self = $(this).next();
        if (self.css('display') === 'none') {
            self.fadeIn(300);
        } else {
            self.fadeOut(300);
        }
        e.preventDefault();
    });


    // Video
    $('.js-video').on('click', function () {
        $('.header__video-container').addClass('header__video_opened');
    });
    $('.header__video-container').on('click', function () {
        $('.header__video-container').removeClass('header__video_opened');
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $('.header__video-container').removeClass('header__video_opened');
        }
    });

    // initFonts();
    //
    document.addEventListener('click', toggle, false);


    // Slider
    var swiperRoadmap = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 40,
        grabCursor: true
    });

    // Form validate
    $('.js-validate').each(function () {
        $(this).validate();
    });

    // Animate 1st slide
    var tl1 = new TimelineLite();
    tl1.fromTo('.js-first-slide', 2, {
        opacity: 0
    }, {
        opacity: 1
    });

    // Animate scroll
    $('.js-scrollto').on('click', function (e) {
        animateScroll($(this), e);
    });

    // Animate labels
    $('.js-field').each(function () {
        var self = $(this);
        if (self.val() != '') {
            self.parent().addClass('field__filled');
        }
    });
    $('.js-field').on('focus', function () {
        $(this).parent().addClass('field__filled');
    });
    $('.js-field').on('blur', function () {
        var self = $(this);
        if (self.val() == '') {
            self.parent().removeClass('field__filled');
        }
    });


    // Nav
    $('.js-nav').on('click', function () {
        $('.js-main-container').addClass('nav_opened')
    });
    $('.js-nav__close').on('click', function (e) {
        $('.js-main-container').removeClass('nav_opened');
        e.preventDefault();
    });
    $('.js-nav__item').on('click', function (e) {
        animateScroll($(this), e);
    });

    // Dialog
    $('.js-send-dialog').validate({
        submitHandler: function (form) {
            $('.js-send-dialog').hide();
            $('.dialog__success').css({
                display: 'flex'
            });
        }
    });

    var dialog = $('.dialog');
    $('.js-show-dialog').on('click', function () {
        dialog.addClass('dialog_opened');
    });
    $('.js-hide-dialog').on('click', function () {
        dialog.removeClass('dialog_opened');
    });
    $('.js-field').on('focus', function () {
        $(this).parent().addClass('dialog__full');
    });
    $('.js-field').on('blur', function () {
        if ($(this)[0].value.length == 0) {
            $(this).parent().removeClass('dialog__full');
        }
    });
    $('.js-clear').on('click', function () {
        $('.js-field')[0].value = '';
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            dialog.removeClass('dialog_opened');
        }
    });


    $('.widjet').marquee({
        //speed in milliseconds of the marquee
        duration: 15000,
        //gap in pixels between the tickers
        gap: 50,
        //time in milliseconds before the marquee will start animating
        delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'left'
        //true or false - should the marquee be duplicated to show an effect of continues flow
        // duplicated: true
    });

    $('.js-widjet').each(function () {
        var self = $(this);
        var url = self.data('url');
        $.ajax({
            url: url,
        }).done(function (response) {
            var title = response.result[0].MarketName;
            var price = response.result[0].Last;
            var changes = price * 100 / response.result[0].PrevDay - 100;
            var increase = (changes > 0 ? true : false);
            var increaseClass = increase ? 'widjet__percent_plus' : 'widjet__percent_minus';
            var increaseSvg = increase ? '<svg class="widjet__i"><use xlink:href="#plus"></use></svg>' : '<svg class="widjet__i"><use xlink:href="#minus"></use></svg>';
            changes = changes.toFixed(5);
            changes = Math.abs(changes);
            price = price.toFixed(7);
            var template = '<div class="widjet__name">' + title + '</div><div class="widjet__inner"><div class="widjet__sum">' + price + '</div><div class="widjet__currency">USD</div></div><div class="widjet__percent ' + increaseClass + '">' + changes + '% ' + increaseSvg + '</div>';
            self.html(template)
        })
    })


});


// Init Fonts
// function initFonts() {
//   if( sessionStorage.foutFontsLoaded ) {
//     document.documentElement.className += " fonts-loaded";
//     return;
//   }
//   var fontA = new FontFaceObserver('Aizel Accent');
//   var fontB = new FontFaceObserver('Aizel Accent', {
//     style: 'italic'
//   });
//   Promise.all([fontA.load(), fontB.load()]).then(function () {
//     document.documentElement.className += " fonts-loaded";
//     sessionStorage.foutFontsLoaded = true;
//   });
// }

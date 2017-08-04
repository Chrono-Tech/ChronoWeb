'use strict';

window.jQuery = require('jquery');
window.$ = window.jQuery;
// var FontFaceObserver = require('font-face-observer');
var TweenLite = require('gsap').TweenLite;
var ScrollToPlugin = require('gsap/ScrollToPlugin');
var Swiper = require('swiper');
require("../../node_modules/jquery-validation/dist/jquery.validate.js");
require("../../node_modules/jquery.marquee/jquery.marquee.min.js");




// Closest Polyfill for IE
(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {return null}
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
  var link =  el.attr('href');
  TweenLite.to(window, 1, {scrollTo: link});
  e.preventDefault();
}


document.addEventListener('DOMContentLoaded', function() {

  $.ajax({
    url: 'https://medium.com/feed/@Chronobank',
  })
  .done(function(response) {
    var html = '';
    console.log(response);
    $(response).find('item').each(function(i) {
      if (i < 4) {
        var self = $(this);
        var title, url, descr, pic;

        title = self.find('title').text();
        url = self.find('guid').text();
        descr = self.find('content')['prevObject'].text();
        descr = self[0].getElementsByTagName("encoded")[0].childNodes[0].nodeValue;
        pic = descr.match(/src="http([^">]+)/g);
        pic = pic[0].match(/http([^">]+)/g);
        descr = descr.replace(/<\/?[^>]+(>|$)/g, "");
        descr = descr.replace(/  /g, "");
        descr = descr.substring(0,110);

        console.log(title, url, pic, descr);

        html = html + '<a class="news__block" target="_blank" href="' + url + '"><div class="news__pic" style="background-image: url(' + pic + ')"></div><h4 class="news__title">' + title + '</h4><p class="news__descr">' + descr + '...</p></a>'
      }
      $('.news').html(html);
    })
  });


  // Nav
  $('.nav__i').on('click', function() {
    $('.nav__block').fadeIn(300);
  })
  $('.js-close-menu').on('click', function() {
    $('.nav__block').fadeOut(300);
  })
  $(document).keyup(function(e) {
     if (e.keyCode == 27) {
        $('.nav__block').fadeOut(300);
    }
  });
  $('.js-nav-sec').on('click', function(e) {
    var self = $(this).next();
    if (self.css('display') === 'none') {
      self.fadeIn(300);
    } else {
      self.fadeOut(300);
    }
    e.preventDefault();
  })


  // Video
  $('.js-video').on('click', function() {
    $('.header__video-container').addClass('header__video_opened');
  })
  $('.header__video-container').on('click', function() {
    $('.header__video-container').removeClass('header__video_opened');
  })
  $(document).keyup(function(e) {
     if (e.keyCode == 27) {
        $('.header__video-container').removeClass('header__video_opened');
    }
  });

  // initFonts();
  //
  document.addEventListener('click', toggle, false);


  // Slider
  var swiperPartners = new Swiper ('.js-swiper', {
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 16,
    speed: 300,
    pagination: '.swiper-pagination',
  })

  // Form validate
  $('.js-validate').each(function() {
    $(this).validate();
  })

  // Animate 1st slide
  var tl1 = new TimelineLite();
  tl1.fromTo('.js-first-slide', 2, {
    opacity: 0,
  }, {
    opacity: 1,
  })

  // Animate scroll
  $('.js-scrollto').on('click', function(e) {
    animateScroll($(this), e);
  })

  // Animate labels
  $('.js-field').each(function() {
    var self = $(this);
    if (self.val() != '') {
      self.parent().addClass('field__filled');
    }
  })
  $('.js-field').on('focus', function() {
    $(this).parent().addClass('field__filled');
  })
  $('.js-field').on('blur', function() {
    var self = $(this);
    if (self.val() == '') {
      self.parent().removeClass('field__filled');
    }
  })









  // Nav
  $('.js-nav').on('click', function() {
    $('.js-main-container').addClass('nav_opened')
  })
  $('.js-nav__close').on('click', function(e) {
    $('.js-main-container').removeClass('nav_opened');
    e.preventDefault();
  })
  $('.js-nav__item').on('click', function(e) {
    animateScroll($(this), e);
  })

  // Dialog
  $('.js-send-dialog').validate({
    submitHandler: function(form) {
      $('.js-send-dialog').hide();
      $('.dialog__success').css({
        display: 'flex'
      });
    }
   });

  var dialog = $('.dialog');
  $('.js-show-dialog').on('click', function() {
    dialog.addClass('dialog_opened');
  })
  $('.js-hide-dialog').on('click', function() {
    dialog.removeClass('dialog_opened');
  })
  $('.js-field').on('focus', function() {
    $(this).parent().addClass('dialog__full');
  })
  $('.js-field').on('blur', function() {
    if ($(this)[0].value.length == 0) {
      $(this).parent().removeClass('dialog__full');
    }
  })
  $('.js-clear').on('click', function() {
    $('.js-field')[0].value = '';
  })
  $(document).keyup(function(e) {
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
      direction: 'left',
      //true or false - should the marquee be duplicated to show an effect of continues flow
      // duplicated: true
  });









})


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

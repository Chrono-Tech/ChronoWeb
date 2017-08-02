'use strict';

window.jQuery = require('jquery');
window.$ = window.jQuery;
// var FontFaceObserver = require('font-face-observer');
var TweenLite = require('gsap').TweenLite;
var ScrollToPlugin = require('gsap/ScrollToPlugin');
var Swiper = require('swiper');
require("../../node_modules/jquery-validation/dist/jquery.validate.js");



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

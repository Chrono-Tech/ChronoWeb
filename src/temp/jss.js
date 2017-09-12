<script type="application/javascript">
	$(document).ready(function() {
		var $callback_modal = $("#callback__modal"),
			$callback_modal_dialog = $("#callback__modal__dialog"),
			$button_submit_main = $("#button-submit_main"),
			$button_submit_modal = $("#button-submit_modal");

		var $root = $('html, body');

		$('body').addClass('ready');

		$("a[href^='#pres']").click(function() {
			$root.animate({
				scrollTop: $( $.attr(this, 'href') ).offset().top
			}, 500);
			return false;
		});

		var start = false;
		var presSlider = new Swiper('#pres-slider', {
			effect: "fade",
			speed: 500,
			pagination: '.swiper-pagination',
			paginationClickable: true,
			paginationType: 'bullets',
			paginationBulletRender: function (swiper, index, className) {
				return '<li class="' + className + '">' + $(swiper.slides[index]).find("h3").text() + '</li>';
			},
			//touchEventsTarget: 'wrapper',
			scrollbar: '.swiper-scrollbar',
			scrollbarHide: false,
			scrollbarDraggable: true,
			scrollbarSnapOnRelease: false,
			followFinger: false,
			slidesPerView: 'auto',
			centeredSlides: true,
			spaceBetween: 30,
			grabCursor: true,
			breakpoints: {
				959: {
					scrollbarDraggable: false
				}
			},
			fade: {
				crossFade: true
			},
			'onSlideChangeStart': function (swiper) {
				if (!start) {
					if (swiper.isHorizontal()) {
						swiper.bullets.each(function (index) {
							var params = swiper.bulletsParams[index];
							params.position = this.offsetLeft;
							params.size = this.offsetWidth;
							params.center = (params.position + params.size) / 2;
						});
					}
					else {
						swiper.bullets.each(function (index) {
							var params = swiper.bulletsParams[index];
							params.position = this.offsetTop;
							params.size = this.offsetHeight;
							params.center = (params.position + params.size) / 2;
						});
					}
					start = true;
				}
			}
		});

		function validate(input, validateInput) {
			if (validateInput($(input).val())) {
				$(input).parent().removeClass("error");
				return true;
			} else {
				$(input).parent().addClass("error");
				$(input).focus();
				return false;
			}
		}

		$('#button_stat, #button_solution-gkh, #button_solution-net, #button_solution-edu, #button_call--header, #button_call--footer').click(function () {
			callbackModal("Мы&nbsp;перезвоним Вам в&nbsp;течение 7-ми минут и&nbsp;поможем подобрать лучшее решение для&nbsp;приёма платежей");
		});

		$('#button_special-offer').click(function () {
			callbackModal("Мы&nbsp;перезвоним Вам в&nbsp;течение 7-ми минут и&nbsp;подключим к&nbsp;приёму платежей от&nbsp;1&nbsp;часа");
		});

		function callbackModal(describe) {
			if (!$callback_modal.hasClass("show")) {
				$("#callback-content").show();
				$("#callback-result").removeClass('success');
				$("#modal__describe").html(describe);
				showModal();
			}
		}

		$('#callback-close__cross, #callback-close__button').click(function () {
			hideModal()
		});

		function showModal() {
			var m_top = Math.round(($(window).height() - $callback_modal_dialog.outerHeight()) / 2);
			if (m_top > 45) {
				$callback_modal_dialog.css({marginTop: m_top});
			}
			$callback_modal.addClass("show");
		}

		function hideModal() {
			$callback_modal.removeClass("show");
		}

		function callBack(id, button, submitAction) {
			var $form = $(id);
			var wrong = document.getElementById("wrong");
			button.prop('disabled', true);
			if (validate($form.find('input[name="name"]'), function isValidName(name) {
					return name;
				})
				&& validate($form.find('input[name="phone"]'), function isValidPhone(phone) {
					return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(phone);
				})
				&& validate($form.find('input[name="email"]'), function isValidEmail(email) {
					return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
				})
				&& validate($form.find('input[name="action"]'), function isValidAction(action) {
					return true;
				})) {

				setTimeout(function() {button.prop('disabled', false);}, 10000);

				$.ajax({
					url: "/lp/providers/php/callback.php",
					type: "POST",
					dataType: 'json',
					data: $form.serialize(),
					success: function (dat) {
						if (submitAction(dat)) {
							$form.find('input').val("");
						}
						wrong.style.display="none";
						wrong.innerText=" ";
						button.prop('disabled', false);


					},
					error: function(){
						/* window.alert("Ошибка!")*/
						wrong.innerText="Ошибка: Заявка не отправлена. Попробуйте позже";
						wrong.style.display="block";
					},
					complete: function(){
						button.prop('disabled', false);
					}
				});
			} else {
				button.prop('disabled', false);
			}
		}
		/*Нижняя форма*/
		$("#form__main-callback").on('submit', function (e) {
			if (!$callback_modal.hasClass("show")) {
				callBack(this, $button_submit_main, function (data) {
					if (!data['error']) {
						$("#callback-result").addClass('success');
						$("#callback-content").hide();
						showModal();
						return true
					}
					else {
						//$("callback-result__text").text(data['error']);
						//$result.addClass('error');
						return false;
					}
				});
			}
			return false;
		});
		/*Модальное окно с формой*/
		$("#form__modal-callback").on('submit', function (e) {
			callBack(this, $button_submit_modal, function (data) {
				if (!data['error']) {
					$("#callback-content").fadeOut(500, function () {
						$("#callback-result").addClass('success');
						showModal();
					});
					return true
				}
				else {
					//$("callback-result__text").text(data['error']);
					//$result.addClass('error');
					return false;
				}
			});
			return false;
		});

		$("#phone__main, #phone__modal, .backcall-window__form-tel").mask("+7 (999) 999-9999", {autoclear: false});
	});
</script>
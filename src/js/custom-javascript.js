(function ($) {
    jQuery(document).ready(function () {
        setTimeout(function () {
            $(".page-wrapper").css({
                "padding-top": $("#top-bars").height()
            });
        }, 600);
        // Sticky header
        jQuery(window).scroll(function () {
            if ($(this).scrollTop() > 60) {
                $('#menu_area').addClass("sticky");
            } else {
                $('#menu_area').removeClass("sticky");
            }
        });

        if ( /*@cc_on!@*/ true) {
            var ieclass = 'ie' + document.documentMode;
            jQuery(".popup-wrap").addClass(ieclass);
        }
        jQuery(".sticky-popup").addClass('sticky-popup-left');
        var contwidth = jQuery(".popup-content").outerWidth() + 2;
        jQuery(".sticky-popup").css("left", "-" + contwidth + "px");

        jQuery(".sticky-popup").css("visibility", "visible");

        jQuery('.sticky-popup').addClass("open_sticky_popup_left");
        jQuery('.sticky-popup').addClass("popup-content-bounce-in-left");

        jQuery(".popup-header").click(function () {
            if (jQuery('.sticky-popup').hasClass("open")) {
                jQuery('.sticky-popup').removeClass("open");
                jQuery(".sticky-popup").css("left", "-" + contwidth + "px");
            } else {
                jQuery('.sticky-popup').addClass("open");
                jQuery(".sticky-popup").css("left", 0);
            }

        });
        //Delay click to 45s for Quick Quote Side Tab
        setTimeout(function () {
            $(".sticky-popup .popup-header").trigger('click');
        }, 45000);

        $('#close-notice, #accept-cookie').click(function(e) {
            e.preventDefault();
            $("#cookie-notice").removeClass("slide-up");
            $("#cookie-notice").addClass("slide-down");
        });

        $(document).ready(function () {
            $('#faq__accordion .faq-wrap:first-of-type > div').css('display' , 'block');
            $('#faq__accordion .faq-wrap:first-of-type > h3').addClass('active');
            $("#faq__accordion .faq-wrap > h3").on("click", function (e) {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(this)
                        .siblings("#faq__accordion .faq-wrap > div")
                        .slideUp(200);
                } else {
                    $("#faq__accordion .faq-wrap > h3").removeClass("active");
                    $(this).addClass("active");
                    $("#faq__accordion .faq-wrap > div").slideUp(200);
                    $(this)
                        .siblings("#faq__accordion .faq-wrap > div")
                        .slideDown(200);
                }
                e.preventDefault();
            });
        });

        $(".default-accordion .faq-box > h4").on("click", function(e) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this)
                .siblings(".default-accordion .faq-box div")
                .slideUp(200);
            } else {
                $(".default-accordion .faq-box > h4").removeClass("active");
                $(this).addClass("active");
                $(".default-accordion .faq-box div").slideUp(200);
                $(this)
                .siblings(".default-accordion .faq-box div")
                .slideDown(200);
            }
            e.preventDefault();
        });        

        // desktop multilevel menu
        $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
            if (!$(this).next().hasClass('show')) {
                $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
            }
            var $subMenu = $(this).next(".dropdown-menu");
            $subMenu.toggleClass('show');
            $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
                $('.dropdown-submenu .show').removeClass("show");
            });
            return false;
        })

    // Menu
    $('#mobile-menu--btn a').click(function(){
        $('.main-menu-sidebar').addClass("menu-active");
        $('.menu-overlay').addClass("active-overlay");
        $(this).toggleClass('open');
    });

    // Menu
    $('.close-menu-btn').click(function(){
        $('.main-menu-sidebar').removeClass("menu-active");
        $('.menu-overlay').removeClass("active-overlay");
    });

        $(function() {
    
        var menu_ul = $('.nav-links > li.has-menu  ul'),
            menu_a  = $('.nav-links > li.has-menu  small');
        
        menu_ul.hide();
        
        menu_a.click(function(e) {
            e.preventDefault();
            if(!$(this).hasClass('active')) {
            menu_a.removeClass('active');
            menu_ul.filter(':visible').slideUp('normal');
            $(this).addClass('active').next().stop(true,true).slideDown('normal');
            } else {
            $(this).removeClass('active');
            $(this).next().stop(true,true).slideUp('normal');
            }
        });
        
        });
        
    $(".nav-links > li.has-menu  small ").attr("href","javascript:;");

    var $menu = $('#menu');

    $(document).mouseup(function (e) {
        if (!$menu.is(e.target) // if the target of the click isn't the container...
        && $menu.has(e.target).length === 0) // ... nor a descendant of the container
        {
        $menu.removeClass('menu-active');
        $('.menu-overlay').removeClass("active-overlay");
        }
    });        

        // date picker
        $(function () {

            var date1 = new Date('05/05/2022');
            var date2 = new Date('05/20/2022');

            var date3 = new Date('06/05/2022');
            var date4 = new Date('06/20/2022');

            var date5 = new Date('07/05/2022');
            var date6 = new Date('07/20/2022');

            $(".date-picker-input").datepicker({
                minDate: '0',
                showOtherMonths: true,
                selectOtherMonths: true,


                beforeShowDay: function (date) {
                    var highlight = date >= date1 && date <= date2
                    var highlight2 = date >= date3 && date <= date4
                    var highlight3 = date >= date5 && date <= date6
                    if (highlight || highlight2 || highlight3) {
                        return [true, "event", 'Tooltip text'];
                    } else {
                        return [true, '', ''];
                    }
                }

            });

        });

        $('.date-picker-input').on('click', function (e) {
            e.preventDefault();
            $(this).attr("autocomplete", "off");
        });

        $(".date-picker-input").attr("autocomplete", "off");
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 150) {
                jQuery('#go-to-top').addClass('on');
            } else {
                jQuery('#go-to-top').removeClass('on');
            }
        });

        $('.full-content a').attr("target", "_blank");

        // Fancybox
        $('#gallery-page [data-fancybox="gallery"]').fancybox();

        $('#blog-page .blog-photo [data-fancybox="gallery"]').fancybox();

        //$('#top-cta .features-list .feature-box h3').matchHeight();

        // Wrap every 5 .gallery-item divs with .gal-row
        var divs = $(".gallery-items > .gallery-item");
        for (var i = 0; i < divs.length; i += 5) {
            divs.slice(i, i + 5).wrapAll("<div class='gal-row'></div>");
        }

        $(document).on('click', '.moving-tips .moving-item h4 a', function (event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top - 150
            }, 500);
        });
        $("#toggle-tl").click(function () {
            $("#top-license p").slideToggle();
        });
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 150) {
                jQuery('#go-to-top').addClass('on');
            } else {
                jQuery('#go-to-top').removeClass('on');
            }
        });
        jQuery('#go-to-top').click(function () {
            jQuery('body,html').animate({
                scrollTop: 0
            }, 800);
        });
        $('#city-reviews-slider').slick({
            infinite: false,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: true,
            arrows: true,
            autoplay: false,
            responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: false,
                        autoplaySpeed: 8000
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        autoplay: false,
                        autoplaySpeed: 8000
                    }
                },

                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: false,
                        infinite: false,
                        autoplaySpeed: 8000
                    }
                },

            ]
        });
        //modal
        setTimeout(function () {
            jQuery('.modal-overlay').addClass('show');
        }, 1000);
        $('.zebra_tooltips_below').click(function (e) {
            var myEm = $(this).attr('data-my-element');
            var modal = $('.modal-overlay[data-my-element = ' + myEm + '], .modal[data-my-element = ' + myEm + ']');
            e.preventDefault();
            modal.addClass('active');
            $('html').addClass('fixed');
        });
        $('.close-modal').click(function () {
            var modal = $('.modal-overlay, .modal');
            $('html').removeClass('fixed');
            modal.removeClass('active');
        });
    });
})(jQuery);
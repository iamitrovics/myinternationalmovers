//@prepros-prepend modernizr.js
//@prepros-prepend bootstrap4\bootstrap.bundle.js
//@prepros-prepend easing.js
//@prepros-prepend skip-link-focus-fix.js
//@prepros-prepend moment\moment-with-locales.min.js
//@prepros-prepend jquery.fancybox.min.js
//@prepros-prepend bootstrap-select.js
//@prepros-prepend jquery-ui.min.js
//@prepros-prepend slick.js
//@prepros-prepend sliding-menu.js

(function($) {
	jQuery(document).ready(function() {
        setTimeout(function () {
            $(".page-wrapper").css({"padding-top": $("#top-bars").height()});
        }, 600);
		// Sticky header
		jQuery(window).scroll(function() {
		  if ($(this).scrollTop() > 60){  
		      $('#menu_area').addClass("sticky");
		    }
		    else{
		      $('#menu_area').removeClass("sticky");
		    }
		});

        if (/*@cc_on!@*/true) {                     
            var ieclass = 'ie' + document.documentMode; 
            jQuery( ".popup-wrap" ).addClass(ieclass);
        } 
        jQuery( ".sticky-popup" ).addClass('sticky-popup-left');
        var contwidth = jQuery( ".popup-content" ).outerWidth()+2;          
        jQuery( ".sticky-popup" ).css( "left", "-"+contwidth+"px" );

        jQuery( ".sticky-popup" ).css( "visibility", "visible" );

        jQuery('.sticky-popup').addClass("open_sticky_popup_left");
        jQuery('.sticky-popup').addClass("popup-content-bounce-in-left");
        
        jQuery( ".popup-header" ).click(function() {
            if(jQuery('.sticky-popup').hasClass("open"))
            {
                jQuery('.sticky-popup').removeClass("open");
                jQuery( ".sticky-popup" ).css( "left", "-"+contwidth+"px" );
            }
            else
            {
                jQuery('.sticky-popup').addClass("open");
                jQuery( ".sticky-popup" ).css( "left", 0 );     
            }
          
        }); 
        //Delay click to 45s for Quick Quote Side Tab
        setTimeout(function() {
            $(".sticky-popup .popup-header").trigger('click');
        },45000);

        // new $.Zebra_Tooltips($('.zebra_tooltips_below'), {
        //     max_width: 500,
        //     position: 'below'
        // });

        $('#cookie-notice').addClass('slide-up');

        $('#close-notice, #accept-cookie').click(function(e) {
            e.preventDefault();
            $("#cookie-notice").removeClass("slide-up");
            $("#cookie-notice").addClass("slide-down");
        });

        $("#faq__accordion").accordion({
            heightStyle: "content",
            autoHeight: false,
            clearStyle: true,
            active: 0,
            collapsible: true,
            header: '> div.faq-wrap >h3'
        });

		// desktop multilevel menu
		$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
	      	if (!$(this).next().hasClass('show')) {
	        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
	      }
	      var $subMenu = $(this).next(".dropdown-menu");
	      $subMenu.toggleClass('show');
	      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
	        $('.dropdown-submenu .show').removeClass("show");
	      });
	      return false;
	    })

	    // mobile multilevel menu
        $("#menu").slidingMenu();

	 	jQuery("#top__mobile .menu-btn").click(function(){
	    	jQuery(".menu-overlay").addClass("active-overlay");
            jQuery('.main-menu-sidebar').addClass("menu-active");
	    });
	   
	    jQuery('.main-menu-sidebar .close-menu-btn, .menu-overlay').click(function(){
	        jQuery('.main-menu-sidebar').removeClass("menu-active");
	        jQuery(".menu-overlay").removeClass("active-overlay");
	    });

	    // date picker

        $(function () {
            
                var date1 = new Date('05/05/2021');
                var date2 = new Date('05/20/2021');

                var date3 = new Date('06/05/2021');
                var date4 = new Date('06/20/2021');

                var date5 = new Date('07/05/2021');
                var date6 = new Date('07/20/2021');                
                    
                $(".date-picker-input").datepicker({
                    minDate: '0',
                    showOtherMonths: true,
                    selectOtherMonths: true, 
                    
                    
                    beforeShowDay: function( date ) {
                        var highlight = date >= date1 && date <= date2
                        var highlight2 = date >= date3 && date <= date4
                        var highlight3 = date >= date5 && date <= date6
                        if( highlight || highlight2 || highlight3 ) {
                             return [true, "event", 'Tooltip text'];
                        } else {
                             return [true, '', ''];
                        }
                    }
            
                });

        });

        $(function() {
            $('.quote-cta--single a.btn-cta').click(function() {
              if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                  $('html, body').animate({
                    scrollTop: target.offset().top - 100
                  }, 1000);
                  return false;
                }
              }
            });
          });      
          
          $('.full-content a').attr("target","_blank");

        $('.date-picker-input').on('click', function(e) {
          e.preventDefault();
          $(this).attr("autocomplete", "off");  
       });

       $(".date-picker-input").attr("autocomplete", "off");

        // Fancybox
        $('#gallery-page [data-fancybox="gallery"]').fancybox();

        $('#blog-page .blog-photo [data-fancybox="gallery"]').fancybox();
	
		//$('#top-cta .features-list .feature-box h3').matchHeight();

        // Wrap every 5 .gallery-item divs with .gal-row
        var divs = $(".gallery-items > .gallery-item");
        for(var i = 0; i < divs.length; i+=5) {
          divs.slice(i, i+5).wrapAll("<div class='gal-row'></div>");
        }

        $(document).on('click', '.moving-tips .moving-item h4 a', function(event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top-150
            }, 500);
        });
         $("#toggle-tl").click(function(){
            $("#top-license p").slideToggle();
        });
        jQuery(window).scroll(function() {
            if (jQuery(this).scrollTop() > 150) {
                jQuery('#go-to-top').addClass('on');
            } else {
                jQuery('#go-to-top').removeClass('on');
            }
        });
        jQuery('#go-to-top').click(function() {
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
	});
})(jQuery);

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

/* global window, document, define, jQuery, setInterval, clearInterval */
;

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  var Slick = window.Slick || {};

  Slick = function () {
    var instanceUid = 0;

    function Slick(element, settings) {
      var _ = this,
          dataSettings;

      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function (slider, i) {
          return $('<button type="button" />').text(i + 1);
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000
      };
      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false
      };
      $.extend(_, _.initials);
      _.activeBreakpoint = null;
      _.animType = null;
      _.animProp = null;
      _.breakpoints = [];
      _.breakpointSettings = [];
      _.cssTransitions = false;
      _.focussed = false;
      _.interrupted = false;
      _.hidden = 'hidden';
      _.paused = true;
      _.positionProp = null;
      _.respondTo = null;
      _.rowCount = 1;
      _.shouldClick = true;
      _.$slider = $(element);
      _.$slidesCache = null;
      _.transformType = null;
      _.transitionType = null;
      _.visibilityChange = 'visibilitychange';
      _.windowWidth = 0;
      _.windowTimer = null;
      dataSettings = $(element).data('slick') || {};
      _.options = $.extend({}, _.defaults, settings, dataSettings);
      _.currentSlide = _.options.initialSlide;
      _.originalSettings = _.options;

      if (typeof document.mozHidden !== 'undefined') {
        _.hidden = 'mozHidden';
        _.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        _.hidden = 'webkitHidden';
        _.visibilityChange = 'webkitvisibilitychange';
      }

      _.autoPlay = $.proxy(_.autoPlay, _);
      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
      _.changeSlide = $.proxy(_.changeSlide, _);
      _.clickHandler = $.proxy(_.clickHandler, _);
      _.selectHandler = $.proxy(_.selectHandler, _);
      _.setPosition = $.proxy(_.setPosition, _);
      _.swipeHandler = $.proxy(_.swipeHandler, _);
      _.dragHandler = $.proxy(_.dragHandler, _);
      _.keyHandler = $.proxy(_.keyHandler, _);
      _.instanceUid = instanceUid++; // A simple way to check for HTML strings
      // Strict HTML recognition (must start with <)
      // Extracted from jQuery v1.11 source

      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

      _.registerBreakpoints();

      _.init(true);
    }

    return Slick;
  }();

  Slick.prototype.activateADA = function () {
    var _ = this;

    _.$slideTrack.find('.slick-active').attr({
      'aria-hidden': 'false'
    }).find('a, input, button, select').attr({
      'tabindex': '0'
    });
  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
    var _ = this;

    if (typeof index === 'boolean') {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= _.slideCount) {
      return false;
    }

    _.unload();

    if (typeof index === 'number') {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index));
      } else {
        $(markup).insertAfter(_.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack);
      } else {
        $(markup).appendTo(_.$slideTrack);
      }
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index);
    });

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.animateHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.animate({
        height: targetHeight
      }, _.options.speed);
    }
  };

  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
        _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }

    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate({
          left: targetLeft
        }, _.options.speed, _.options.easing, callback);
      } else {
        _.$slideTrack.animate({
          top: targetLeft
        }, _.options.speed, _.options.easing, callback);
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft;
        }

        $({
          animStart: _.currentLeft
        }).animate({
          animStart: targetLeft
        }, {
          duration: _.options.speed,
          easing: _.options.easing,
          step: function (now) {
            now = Math.ceil(now);

            if (_.options.vertical === false) {
              animProps[_.animType] = 'translate(' + now + 'px, 0px)';

              _.$slideTrack.css(animProps);
            } else {
              animProps[_.animType] = 'translate(0px,' + now + 'px)';

              _.$slideTrack.css(animProps);
            }
          },
          complete: function () {
            if (callback) {
              callback.call();
            }
          }
        });
      } else {
        _.applyTransition();

        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
        }

        _.$slideTrack.css(animProps);

        if (callback) {
          setTimeout(function () {
            _.disableTransition();

            callback.call();
          }, _.options.speed);
        }
      }
    }
  };

  Slick.prototype.getNavTarget = function () {
    var _ = this,
        asNavFor = _.options.asNavFor;

    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider);
    }

    return asNavFor;
  };

  Slick.prototype.asNavFor = function (index) {
    var _ = this,
        asNavFor = _.getNavTarget();

    if (asNavFor !== null && typeof asNavFor === 'object') {
      asNavFor.each(function () {
        var target = $(this).slick('getSlick');

        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  };

  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
        transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
    } else {
      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.autoPlay = function () {
    var _ = this;

    _.autoPlayClear();

    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
    }
  };

  Slick.prototype.autoPlayClear = function () {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  };

  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
        slideTo = _.currentSlide + _.options.slidesToScroll;

    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0;
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll;

          if (_.currentSlide - 1 === 0) {
            _.direction = 1;
          }
        }
      }

      _.slideHandler(slideTo);
    }
  };

  Slick.prototype.buildArrows = function () {
    var _ = this;

    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        }
      } else {
        _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
          'aria-disabled': 'true',
          'tabindex': '-1'
        });
      }
    }
  };

  Slick.prototype.buildDots = function () {
    var _ = this,
        i,
        dot;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass('slick-dotted');

      dot = $('<ul />').addClass(_.options.dotsClass);

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
      }

      _.$dots = dot.appendTo(_.options.appendDots);

      _.$dots.find('li').first().addClass('slick-active');
    }
  };

  Slick.prototype.buildOut = function () {
    var _ = this;

    _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
    _.slideCount = _.$slides.length;

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
    });

    _.$slider.addClass('slick-slider');

    _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();

    _.$slideTrack.css('opacity', 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass('draggable');
    }
  };

  Slick.prototype.buildRows = function () {
    var _ = this,
        a,
        b,
        c,
        newSlides,
        numOfSlides,
        originalSlides,
        slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div');

        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div');

          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);

            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }

          slide.appendChild(row);
        }

        newSlides.appendChild(slide);
      }

      _.$slider.empty().append(newSlides);

      _.$slider.children().children().children().css({
        'width': 100 / _.options.slidesPerRow + '%',
        'display': 'inline-block'
      });
    }
  };

  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
        breakpoint,
        targetBreakpoint,
        respondToWidth,
        triggerBreakpoint = false;

    var sliderWidth = _.$slider.width();

    var windowWidth = window.innerWidth || $(window).width();

    if (_.respondTo === 'window') {
      respondToWidth = windowWidth;
    } else if (_.respondTo === 'slider') {
      respondToWidth = sliderWidth;
    } else if (_.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint;

            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }

              _.refresh(initial);
            }

            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          _.activeBreakpoint = targetBreakpoint;

          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
            _.unslick(targetBreakpoint);
          } else {
            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }

            _.refresh(initial);
          }

          triggerBreakpoint = targetBreakpoint;
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          _.options = _.originalSettings;

          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }

          _.refresh(initial);

          triggerBreakpoint = targetBreakpoint;
        }
      } // only trigger breakpoints during an actual break. not on initialize.


      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
      }
    }
  };

  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
        $target = $(event.currentTarget),
        indexOffset,
        slideOffset,
        unevenOffset; // If target is a link, prevent default action.


    if ($target.is('a')) {
      event.preventDefault();
    } // If target is not the <li> element (ie: a child), find the <li>.


    if (!$target.is('li')) {
      $target = $target.closest('li');
    }

    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

    switch (event.data.message) {
      case 'previous':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
        }

        break;

      case 'next':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
        }

        break;

      case 'index':
        var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

        _.slideHandler(_.checkNavigable(index), false, dontAnimate);

        $target.children().trigger('focus');
        break;

      default:
        return;
    }
  };

  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
        navigables,
        prevNavigable;

    navigables = _.getNavigableIndexes();
    prevNavigable = 0;

    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }

        prevNavigable = navigables[n];
      }
    }

    return index;
  };

  Slick.prototype.cleanUpEvents = function () {
    var _ = this;

    if (_.options.dots && _.$dots !== null) {
      $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));

      if (_.options.accessibility === true) {
        _.$dots.off('keydown.slick', _.keyHandler);
      }
    }

    _.$slider.off('focus.slick blur.slick');

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
      }
    }

    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);

    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);

    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);

    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

    _.$list.off('click.slick', _.clickHandler);

    $(document).off(_.visibilityChange, _.visibility);

    _.cleanUpSlideEvents();

    if (_.options.accessibility === true) {
      _.$list.off('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off('click.slick', _.selectHandler);
    }

    $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
  };

  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this;

    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));

    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
  };

  Slick.prototype.cleanUpRows = function () {
    var _ = this,
        originalSlides;

    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr('style');

      _.$slider.empty().append(originalSlides);
    }
  };

  Slick.prototype.clickHandler = function (event) {
    var _ = this;

    if (_.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  Slick.prototype.destroy = function (refresh) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $('.slick-cloned', _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }
    }

    if (_.$slides) {
      _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
        $(this).attr('style', $(this).data('originalStyling'));
      });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass('slick-slider');

    _.$slider.removeClass('slick-initialized');

    _.$slider.removeClass('slick-dotted');

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger('destroy', [_]);
    }
  };

  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
        transition = {};

    transition[_.transitionType] = '';

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({
        zIndex: _.options.zIndex
      });

      _.$slides.eq(slideIndex).animate({
        opacity: 1
      }, _.options.speed, _.options.easing, callback);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: _.options.zIndex
      });

      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex);

          callback.call();
        }, _.options.speed);
      }
    }
  };

  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).animate({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      }, _.options.speed, _.options.easing);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      });
    }
  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
    var _ = this;

    if (filter !== null) {
      _.$slidesCache = _.$slides;

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.focusHandler = function () {
    var _ = this; // If any child element receives focus within the slider we need to pause the autoplay


    _.$slider.off('focus.slick blur.slick').on('focus.slick', '*', function (event) {
      var $sf = $(this);
      setTimeout(function () {
        if (_.options.pauseOnFocus) {
          if ($sf.is(':focus')) {
            _.focussed = true;

            _.autoPlay();
          }
        }
      }, 0);
    }).on('blur.slick', '*', function (event) {
      var $sf = $(this); // When a blur occurs on any elements within the slider we become unfocused

      if (_.options.pauseOnFocus) {
        _.focussed = false;

        _.autoPlay();
      }
    });
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this;

    return _.currentSlide;
  };

  Slick.prototype.getDotCount = function () {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty;
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else if (!_.options.asNavFor) {
      pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  };

  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
        targetLeft,
        verticalHeight,
        verticalOffset = 0,
        targetSlide,
        coef;

    _.slideOffset = 0;
    verticalHeight = _.$slides.first().outerHeight(true);

    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
        coef = -1;

        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5;
          } else if (_.options.slidesToShow === 1) {
            coef = -2;
          }
        }

        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
      }

      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
          if (slideIndex > _.slideCount) {
            _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
            verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
          } else {
            _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
            verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
      }
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0;
      verticalOffset = 0;
    }

    if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
      _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2;
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0;
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (_.options.variableWidth === true) {
      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
      } else {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
      }

      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
      }

      if (_.options.centerMode === true) {
        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
    var _ = this;

    return _.options[option];
  };

  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
        breakPoint = 0,
        counter = 0,
        indexes = [],
        max;

    if (_.options.infinite === false) {
      max = _.slideCount;
    } else {
      breakPoint = _.options.slidesToScroll * -1;
      counter = _.options.slidesToScroll * -1;
      max = _.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + _.options.slidesToScroll;
      counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
    }

    return indexes;
  };

  Slick.prototype.getSlick = function () {
    return this;
  };

  Slick.prototype.getSlideCount = function () {
    var _ = this,
        slidesTraversed,
        swipedSlide,
        swipeTarget,
        centerOffset;

    centerOffset = _.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0;
    swipeTarget = _.swipeLeft * -1 + centerOffset;

    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
        var slideOuterWidth, slideOffset, slideRightBoundary;
        slideOuterWidth = $(slide).outerWidth();
        slideOffset = slide.offsetLeft;

        if (_.options.centerMode !== true) {
          slideOffset += slideOuterWidth / 2;
        }

        slideRightBoundary = slideOffset + slideOuterWidth;

        if (swipeTarget < slideRightBoundary) {
          swipedSlide = slide;
          return false;
        }
      });

      slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
      return slidesTraversed;
    } else {
      return _.options.slidesToScroll;
    }
  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'index',
        index: parseInt(slide)
      }
    }, dontAnimate);
  };

  Slick.prototype.init = function (creation) {
    var _ = this;

    if (!$(_.$slider).hasClass('slick-initialized')) {
      $(_.$slider).addClass('slick-initialized');

      _.buildRows();

      _.buildOut();

      _.setProps();

      _.startLoad();

      _.loadSlider();

      _.initializeEvents();

      _.updateArrows();

      _.updateDots();

      _.checkResponsive(true);

      _.focusHandler();
    }

    if (creation) {
      _.$slider.trigger('init', [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }

    if (_.options.autoplay) {
      _.paused = false;

      _.autoPlay();
    }
  };

  Slick.prototype.initADA = function () {
    var _ = this,
        numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
        tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
      return val >= 0 && val < _.slideCount;
    });

    _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
      'aria-hidden': 'true',
      'tabindex': '-1'
    }).find('a, input, button, select').attr({
      'tabindex': '-1'
    });

    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i);
        $(this).attr({
          'role': 'tabpanel',
          'id': 'slick-slide' + _.instanceUid + i,
          'tabindex': -1
        });

        if (slideControlIndex !== -1) {
          var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex;

          if ($('#' + ariaButtonControl).length) {
            $(this).attr({
              'aria-describedby': ariaButtonControl
            });
          }
        }
      });

      _.$dots.attr('role', 'tablist').find('li').each(function (i) {
        var mappedSlideIndex = tabControlIndexes[i];
        $(this).attr({
          'role': 'presentation'
        });
        $(this).find('button').first().attr({
          'role': 'tab',
          'id': 'slick-slide-control' + _.instanceUid + i,
          'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
          'aria-label': i + 1 + ' of ' + numDotGroups,
          'aria-selected': null,
          'tabindex': '-1'
        });
      }).eq(_.currentSlide).find('button').attr({
        'aria-selected': 'true',
        'tabindex': '0'
      }).end();
    }

    for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({
          'tabindex': '0'
        });
      } else {
        _.$slides.eq(i).removeAttr('tabindex');
      }
    }

    _.activateADA();
  };

  Slick.prototype.initArrowEvents = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off('click.slick').on('click.slick', {
        message: 'previous'
      }, _.changeSlide);

      _.$nextArrow.off('click.slick').on('click.slick', {
        message: 'next'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow.on('keydown.slick', _.keyHandler);

        _.$nextArrow.on('keydown.slick', _.keyHandler);
      }
    }
  };

  Slick.prototype.initDotEvents = function () {
    var _ = this;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('click.slick', {
        message: 'index'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$dots.on('keydown.slick', _.keyHandler);
      }
    }

    if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initSlideEvents = function () {
    var _ = this;

    if (_.options.pauseOnHover) {
      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));

      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initializeEvents = function () {
    var _ = this;

    _.initArrowEvents();

    _.initDotEvents();

    _.initSlideEvents();

    _.$list.on('touchstart.slick mousedown.slick', {
      action: 'start'
    }, _.swipeHandler);

    _.$list.on('touchmove.slick mousemove.slick', {
      action: 'move'
    }, _.swipeHandler);

    _.$list.on('touchend.slick mouseup.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('touchcancel.slick mouseleave.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('click.slick', _.clickHandler);

    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

    if (_.options.accessibility === true) {
      _.$list.on('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
    $(_.setPosition);
  };

  Slick.prototype.initUI = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show();

      _.$nextArrow.show();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show();
    }
  };

  Slick.prototype.keyHandler = function (event) {
    var _ = this; //Dont slide if the cursor is inside the form fields and arrow keys are pressed


    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'next' : 'previous'
          }
        });
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'previous' : 'next'
          }
        });
      }
    }
  };

  Slick.prototype.lazyLoad = function () {
    var _ = this,
        loadRange,
        cloneRange,
        rangeStart,
        rangeEnd;

    function loadImages(imagesScope) {
      $('img[data-lazy]', imagesScope).each(function () {
        var image = $(this),
            imageSource = $(this).attr('data-lazy'),
            imageSrcSet = $(this).attr('data-srcset'),
            imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
            imageToLoad = document.createElement('img');

        imageToLoad.onload = function () {
          image.animate({
            opacity: 0
          }, 100, function () {
            if (imageSrcSet) {
              image.attr('srcset', imageSrcSet);

              if (imageSizes) {
                image.attr('sizes', imageSizes);
              }
            }

            image.attr('src', imageSource).animate({
              opacity: 1
            }, 200, function () {
              image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
            });

            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
          });
        };

        imageToLoad.onerror = function () {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
        };

        imageToLoad.src = imageSource;
      });
    }

    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + _.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
      }
    } else {
      rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);

      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd <= _.slideCount) rangeEnd++;
      }
    }

    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

    if (_.options.lazyLoad === 'anticipated') {
      var prevSlide = rangeStart - 1,
          nextSlide = rangeEnd,
          $slides = _.$slider.find('.slick-slide');

      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1;
        loadRange = loadRange.add($slides.eq(prevSlide));
        loadRange = loadRange.add($slides.eq(nextSlide));
        prevSlide--;
        nextSlide++;
      }
    }

    loadImages(loadRange);

    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-slide');
      loadImages(cloneRange);
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
      loadImages(cloneRange);
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
      loadImages(cloneRange);
    }
  };

  Slick.prototype.loadSlider = function () {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1
    });

    _.$slider.removeClass('slick-loading');

    _.initUI();

    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad();
    }
  };

  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'next'
      }
    });
  };

  Slick.prototype.orientationChange = function () {
    var _ = this;

    _.checkResponsive();

    _.setPosition();
  };

  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this;

    _.autoPlayClear();

    _.paused = true;
  };

  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this;

    _.autoPlay();

    _.options.autoplay = true;
    _.paused = false;
    _.focussed = false;
    _.interrupted = false;
  };

  Slick.prototype.postSlide = function (index) {
    var _ = this;

    if (!_.unslicked) {
      _.$slider.trigger('afterChange', [_, index]);

      _.animating = false;

      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition();
      }

      _.swipeLeft = null;

      if (_.options.autoplay) {
        _.autoPlay();
      }

      if (_.options.accessibility === true) {
        _.initADA();

        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide));
          $currentSlide.attr('tabindex', 0).focus();
        }
      }
    }
  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'previous'
      }
    });
  };

  Slick.prototype.preventDefault = function (event) {
    event.preventDefault();
  };

  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1;

    var _ = this,
        $imgsToLoad = $('img[data-lazy]', _.$slider),
        image,
        imageSource,
        imageSrcSet,
        imageSizes,
        imageToLoad;

    if ($imgsToLoad.length) {
      image = $imgsToLoad.first();
      imageSource = image.attr('data-lazy');
      imageSrcSet = image.attr('data-srcset');
      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
      imageToLoad = document.createElement('img');

      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr('srcset', imageSrcSet);

          if (imageSizes) {
            image.attr('sizes', imageSizes);
          }
        }

        image.attr('src', imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');

        if (_.options.adaptiveHeight === true) {
          _.setPosition();
        }

        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

        _.progressiveLazyLoad();
      };

      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          /**
           * try to load the image 3 times,
           * leave a slight delay so we don't get
           * servers blocking the request.
           */
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

          _.progressiveLazyLoad();
        }
      };

      imageToLoad.src = imageSource;
    } else {
      _.$slider.trigger('allImagesLoaded', [_]);
    }
  };

  Slick.prototype.refresh = function (initializing) {
    var _ = this,
        currentSlide,
        lastVisibleIndex;

    lastVisibleIndex = _.slideCount - _.options.slidesToShow; // in non-infinite sliders, we don't want to go past the
    // last visible index.

    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex;
    } // if less slides than to show, go to start.


    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    $.extend(_, _.initials, {
      currentSlide: currentSlide
    });

    _.init();

    if (!initializing) {
      _.changeSlide({
        data: {
          message: 'index',
          index: currentSlide
        }
      }, false);
    }
  };

  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
        breakpoint,
        currentBreakpoint,
        l,
        responsiveSettings = _.options.responsive || null;

    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || 'window';

      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint; // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don't want dupes.

          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }

            l--;
          }

          _.breakpoints.push(currentBreakpoint);

          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a;
      });
    }
  };

  Slick.prototype.reinit = function () {
    var _ = this;

    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();

    _.setupInfinite();

    _.buildArrows();

    _.updateArrows();

    _.initArrowEvents();

    _.buildDots();

    _.updateDots();

    _.initDotEvents();

    _.cleanUpSlideEvents();

    _.initSlideEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    _.setPosition();

    _.focusHandler();

    _.paused = !_.options.autoplay;

    _.autoPlay();

    _.$slider.trigger('reInit', [_]);
  };

  Slick.prototype.resize = function () {
    var _ = this;

    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay);
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width();

        _.checkResponsive();

        if (!_.unslicked) {
          _.setPosition();
        }
      }, 50);
    }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
    var _ = this;

    if (typeof index === 'boolean') {
      removeBefore = index;
      index = removeBefore === true ? 0 : _.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false;
    }

    _.unload();

    if (removeAll === true) {
      _.$slideTrack.children().remove();
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.setCSS = function (position) {
    var _ = this,
        positionProps = {},
        x,
        y;

    if (_.options.rtl === true) {
      position = -position;
    }

    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};

      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';

        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';

        _.$slideTrack.css(positionProps);
      }
    }
  };

  Slick.prototype.setDimensions = function () {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: '0px ' + _.options.centerPadding
        });
      }
    } else {
      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);

      if (_.options.centerMode === true) {
        _.$list.css({
          padding: _.options.centerPadding + ' 0px'
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();

    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

      _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);

      _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();

    if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
  };

  Slick.prototype.setFade = function () {
    var _ = this,
        targetLeft;

    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1;

      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1
    });
  };

  Slick.prototype.setHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.css('height', targetHeight);
    }
  };

  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    /**
     * accepts arguments in format of:
     *
     *  - for changing a single option's value:
     *     .slick("setOption", option, value, refresh )
     *
     *  - for changing a set of responsive options:
     *     .slick("setOption", 'responsive', [{}, ...], refresh )
     *
     *  - for updating multiple values at once (not responsive)
     *     .slick("setOption", { 'option': value, ... }, refresh )
     */
    var _ = this,
        l,
        item,
        option,
        value,
        refresh = false,
        type;

    if ($.type(arguments[0]) === 'object') {
      option = arguments[0];
      refresh = arguments[1];
      type = 'multiple';
    } else if ($.type(arguments[0]) === 'string') {
      option = arguments[0];
      value = arguments[1];
      refresh = arguments[2];

      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
        type = 'responsive';
      } else if (typeof arguments[1] !== 'undefined') {
        type = 'single';
      }
    }

    if (type === 'single') {
      _.options[option] = value;
    } else if (type === 'multiple') {
      $.each(option, function (opt, val) {
        _.options[opt] = val;
      });
    } else if (type === 'responsive') {
      for (item in value) {
        if ($.type(_.options.responsive) !== 'array') {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1; // loop through the responsive object and splice out duplicates.

          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }

            l--;
          }

          _.options.responsive.push(value[item]);
        }
      }
    }

    if (refresh) {
      _.unload();

      _.reinit();
    }
  };

  Slick.prototype.setPosition = function () {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger('setPosition', [_]);
  };

  Slick.prototype.setProps = function () {
    var _ = this,
        bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? 'top' : 'left';

    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical');
    } else {
      _.$slider.removeClass('slick-vertical');
    }

    if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform';
      _.transformType = '-o-transform';
      _.transitionType = 'OTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform';
      _.transformType = '-moz-transform';
      _.transitionType = 'MozTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform';
      _.transformType = '-webkit-transform';
      _.transitionType = 'webkitTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform';
      _.transformType = '-ms-transform';
      _.transitionType = 'msTransition';
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }

    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform';
      _.transformType = 'transform';
      _.transitionType = 'transition';
    }

    _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
  };

  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
        centerOffset,
        allSlides,
        indexOffset,
        remainder;

    allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

    _.$slides.eq(index).addClass('slick-current');

    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          indexOffset = _.options.slidesToShow + index;
          allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
        }

        if (index === 0) {
          allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass('slick-center');
        }
      }

      _.$slides.eq(index).addClass('slick-center');
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass('slick-active').attr('aria-hidden', 'false');
      } else {
        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {
          allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
        }
      }
    }

    if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
      _.lazyLoad();
    }
  };

  Slick.prototype.setupInfinite = function () {
    var _ = this,
        i,
        slideIndex,
        infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
        }

        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
        }

        _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
          $(this).attr('id', '');
        });
      }
    }
  };

  Slick.prototype.interrupt = function (toggle) {
    var _ = this;

    if (!toggle) {
      _.autoPlay();
    }

    _.interrupted = toggle;
  };

  Slick.prototype.selectHandler = function (event) {
    var _ = this;

    var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');
    var index = parseInt(targetElement.attr('data-slick-index'));
    if (!index) index = 0;

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true);

      return;
    }

    _.slideHandler(index);
  };

  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
        animSlide,
        oldSlide,
        slideLeft,
        targetLeft = null,
        _ = this,
        navTarget;

    sync = sync || false;

    if (_.animating === true && _.options.waitForAnimate === true) {
      return;
    }

    if (_.options.fade === true && _.currentSlide === index) {
      return;
    }

    if (sync === false) {
      _.asNavFor(index);
    }

    targetSlide = index;
    targetLeft = _.getLeft(targetSlide);
    slideLeft = _.getLeft(_.currentSlide);
    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

    if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    }

    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
      } else {
        animSlide = _.slideCount + targetSlide;
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - _.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    _.animating = true;

    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

    oldSlide = _.currentSlide;
    _.currentSlide = animSlide;

    _.setSlideClasses(_.currentSlide);

    if (_.options.asNavFor) {
      navTarget = _.getNavTarget();
      navTarget = navTarget.slick('getSlick');

      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide);
      }
    }

    _.updateDots();

    _.updateArrows();

    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide);

        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }

      _.animateHeight();

      return;
    }

    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
  };

  Slick.prototype.startLoad = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide();

      _.$nextArrow.hide();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide();
    }

    _.$slider.addClass('slick-loading');
  };

  Slick.prototype.swipeDirection = function () {
    var xDist,
        yDist,
        r,
        swipeAngle,
        _ = this;

    xDist = _.touchObject.startX - _.touchObject.curX;
    yDist = _.touchObject.startY - _.touchObject.curY;
    r = Math.atan2(yDist, xDist);
    swipeAngle = Math.round(r * 180 / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? 'right' : 'left';
    }

    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  };

  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
        slideCount,
        direction;

    _.dragging = false;
    _.swiping = false;

    if (_.scrolling) {
      _.scrolling = false;
      return false;
    }

    _.interrupted = false;
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

    if (_.touchObject.curX === undefined) {
      return false;
    }

    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger('edge', [_, _.swipeDirection()]);
    }

    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection();

      switch (direction) {
        case 'left':
        case 'down':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
          _.currentDirection = 0;
          break;

        case 'right':
        case 'up':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
          _.currentDirection = 1;
          break;

        default:
      }

      if (direction != 'vertical') {
        _.slideHandler(slideCount);

        _.touchObject = {};

        _.$slider.trigger('swipe', [_, direction]);
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide);

        _.touchObject = {};
      }
    }
  };

  Slick.prototype.swipeHandler = function (event) {
    var _ = this;

    if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
      return;
    } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
      return;
    }

    _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
    }

    switch (event.data.action) {
      case 'start':
        _.swipeStart(event);

        break;

      case 'move':
        _.swipeMove(event);

        break;

      case 'end':
        _.swipeEnd(event);

        break;
    }
  };

  Slick.prototype.swipeMove = function (event) {
    var _ = this,
        edgeWasHit = false,
        curLeft,
        swipeDirection,
        swipeLength,
        positionOffset,
        touches,
        verticalSwipeLength;

    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

    if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
      return false;
    }

    curLeft = _.getLeft(_.currentSlide);
    _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
    _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
    _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
    verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true;
      return false;
    }

    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength;
    }

    swipeDirection = _.swipeDirection();

    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true;
      event.preventDefault();
    }

    positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
    }

    swipeLength = _.touchObject.swipeLength;
    _.touchObject.edgeHit = false;

    if (_.options.infinite === false) {
      if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
        _.touchObject.edgeHit = true;
      }
    }

    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
    }

    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (_.options.fade === true || _.options.touchMove === false) {
      return false;
    }

    if (_.animating === true) {
      _.swipeLeft = null;
      return false;
    }

    _.setCSS(_.swipeLeft);
  };

  Slick.prototype.swipeStart = function (event) {
    var _ = this,
        touches;

    _.interrupted = true;

    if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
      _.touchObject = {};
      return false;
    }

    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
      touches = event.originalEvent.touches[0];
    }

    _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
    _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
    _.dragging = true;
  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this;

    if (_.$slidesCache !== null) {
      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.unload = function () {
    var _ = this;

    $('.slick-cloned', _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
  };

  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this;

    _.$slider.trigger('unslick', [_, fromBreakpoint]);

    _.destroy();
  };

  Slick.prototype.updateArrows = function () {
    var _ = this,
        centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      if (_.currentSlide === 0) {
        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      }
    }
  };

  Slick.prototype.updateDots = function () {
    var _ = this;

    if (_.$dots !== null) {
      _.$dots.find('li').removeClass('slick-active').end();

      _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
    }
  };

  Slick.prototype.visibility = function () {
    var _ = this;

    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true;
      } else {
        _.interrupted = false;
      }
    }
  };

  $.fn.slick = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof opt == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
      if (typeof ret != 'undefined') return ret;
    }

    return _;
  };
});
/*! jQuery UI - v1.12.1 - 2021-03-11
* http://jqueryui.com
* Includes: keycode.js, widgets/datepicker.js, effect.js, effects/effect-fade.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */
!function (t) {
  "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery);
}(function (b) {
  b.ui = b.ui || {};
  var r;
  b.ui.version = "1.12.1", b.ui.keyCode = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  };

  function t() {
    this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
      closeText: "Done",
      prevText: "Prev",
      nextText: "Next",
      currentText: "Today",
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      weekHeader: "Wk",
      dateFormat: "mm/dd/yy",
      firstDay: 0,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: ""
    }, this._defaults = {
      showOn: "focus",
      showAnim: "fadeIn",
      showOptions: {},
      defaultDate: null,
      appendText: "",
      buttonText: "...",
      buttonImage: "",
      buttonImageOnly: !1,
      hideIfNoPrevNext: !1,
      navigationAsDateFormat: !1,
      gotoCurrent: !1,
      changeMonth: !1,
      changeYear: !1,
      yearRange: "c-10:c+10",
      showOtherMonths: !1,
      selectOtherMonths: !1,
      showWeek: !1,
      calculateWeek: this.iso8601Week,
      shortYearCutoff: "+10",
      minDate: null,
      maxDate: null,
      duration: "fast",
      beforeShowDay: null,
      beforeShow: null,
      onSelect: null,
      onChangeMonthYear: null,
      onClose: null,
      numberOfMonths: 1,
      showCurrentAtPos: 0,
      stepMonths: 1,
      stepBigMonths: 12,
      altField: "",
      altFormat: "",
      constrainInput: !0,
      showButtonPanel: !1,
      autoSize: !1,
      disabled: !1
    }, b.extend(this._defaults, this.regional[""]), this.regional.en = b.extend(!0, {}, this.regional[""]), this.regional["en-US"] = b.extend(!0, {}, this.regional.en), this.dpDiv = a(b("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
  }

  function a(t) {
    var e = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return t.on("mouseout", e, function () {
      b(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && b(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && b(this).removeClass("ui-datepicker-next-hover");
    }).on("mouseover", e, s);
  }

  function s() {
    b.datepicker._isDisabledDatepicker((r.inline ? r.dpDiv.parent() : r.input)[0]) || (b(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), b(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && b(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && b(this).addClass("ui-datepicker-next-hover"));
  }

  function c(t, e) {
    for (var a in b.extend(t, e), e) null == e[a] && (t[a] = e[a]);

    return t;
  }

  b.extend(b.ui, {
    datepicker: {
      version: "1.12.1"
    }
  }), b.extend(t.prototype, {
    markerClassName: "hasDatepicker",
    maxRows: 4,
    _widgetDatepicker: function () {
      return this.dpDiv;
    },
    setDefaults: function (t) {
      return c(this._defaults, t || {}), this;
    },
    _attachDatepicker: function (t, e) {
      var a,
          i = t.nodeName.toLowerCase(),
          n = "div" === i || "span" === i;
      t.id || (this.uuid += 1, t.id = "dp" + this.uuid), (a = this._newInst(b(t), n)).settings = b.extend({}, e || {}), "input" === i ? this._connectDatepicker(t, a) : n && this._inlineDatepicker(t, a);
    },
    _newInst: function (t, e) {
      return {
        id: t[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
        input: t,
        selectedDay: 0,
        selectedMonth: 0,
        selectedYear: 0,
        drawMonth: 0,
        drawYear: 0,
        inline: e,
        dpDiv: e ? a(b("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
      };
    },
    _connectDatepicker: function (t, e) {
      var a = b(t);
      e.append = b([]), e.trigger = b([]), a.hasClass(this.markerClassName) || (this._attachments(a, e), a.addClass(this.markerClassName).on("keydown", this._doKeyDown).on("keypress", this._doKeyPress).on("keyup", this._doKeyUp), this._autoSize(e), b.data(t, "datepicker", e), e.settings.disabled && this._disableDatepicker(t));
    },
    _attachments: function (t, e) {
      var a,
          i = this._get(e, "appendText"),
          n = this._get(e, "isRTL");

      e.append && e.append.remove(), i && (e.append = b("<span class='" + this._appendClass + "'>" + i + "</span>"), t[n ? "before" : "after"](e.append)), t.off("focus", this._showDatepicker), e.trigger && e.trigger.remove(), "focus" !== (a = this._get(e, "showOn")) && "both" !== a || t.on("focus", this._showDatepicker), "button" !== a && "both" !== a || (i = this._get(e, "buttonText"), a = this._get(e, "buttonImage"), e.trigger = b(this._get(e, "buttonImageOnly") ? b("<img/>").addClass(this._triggerClass).attr({
        src: a,
        alt: i,
        title: i
      }) : b("<button type='button'></button>").addClass(this._triggerClass).html(a ? b("<img/>").attr({
        src: a,
        alt: i,
        title: i
      }) : i)), t[n ? "before" : "after"](e.trigger), e.trigger.on("click", function () {
        return b.datepicker._datepickerShowing && b.datepicker._lastInput === t[0] ? b.datepicker._hideDatepicker() : (b.datepicker._datepickerShowing && b.datepicker._lastInput !== t[0] && b.datepicker._hideDatepicker(), b.datepicker._showDatepicker(t[0])), !1;
      }));
    },
    _autoSize: function (t) {
      var e, a, i, n, r, s;
      this._get(t, "autoSize") && !t.inline && (r = new Date(2009, 11, 20), (s = this._get(t, "dateFormat")).match(/[DM]/) && (e = function (t) {
        for (n = i = a = 0; n < t.length; n++) t[n].length > a && (a = t[n].length, i = n);

        return i;
      }, r.setMonth(e(this._get(t, s.match(/MM/) ? "monthNames" : "monthNamesShort"))), r.setDate(e(this._get(t, s.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - r.getDay())), t.input.attr("size", this._formatDate(t, r).length));
    },
    _inlineDatepicker: function (t, e) {
      var a = b(t);
      a.hasClass(this.markerClassName) || (a.addClass(this.markerClassName).append(e.dpDiv), b.data(t, "datepicker", e), this._setDate(e, this._getDefaultDate(e), !0), this._updateDatepicker(e), this._updateAlternate(e), e.settings.disabled && this._disableDatepicker(t), e.dpDiv.css("display", "block"));
    },
    _dialogDatepicker: function (t, e, a, i, n) {
      var r,
          s = this._dialogInst;
      return s || (this.uuid += 1, r = "dp" + this.uuid, this._dialogInput = b("<input type='text' id='" + r + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.on("keydown", this._doKeyDown), b("body").append(this._dialogInput), (s = this._dialogInst = this._newInst(this._dialogInput, !1)).settings = {}, b.data(this._dialogInput[0], "datepicker", s)), c(s.settings, i || {}), e = e && e.constructor === Date ? this._formatDate(s, e) : e, this._dialogInput.val(e), this._pos = n ? n.length ? n : [n.pageX, n.pageY] : null, this._pos || (r = document.documentElement.clientWidth, i = document.documentElement.clientHeight, e = document.documentElement.scrollLeft || document.body.scrollLeft, n = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [r / 2 - 100 + e, i / 2 - 150 + n]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), s.settings.onSelect = a, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), b.blockUI && b.blockUI(this.dpDiv), b.data(this._dialogInput[0], "datepicker", s), this;
    },
    _destroyDatepicker: function (t) {
      var e,
          a = b(t),
          i = b.data(t, "datepicker");
      a.hasClass(this.markerClassName) && (e = t.nodeName.toLowerCase(), b.removeData(t, "datepicker"), "input" === e ? (i.append.remove(), i.trigger.remove(), a.removeClass(this.markerClassName).off("focus", this._showDatepicker).off("keydown", this._doKeyDown).off("keypress", this._doKeyPress).off("keyup", this._doKeyUp)) : "div" !== e && "span" !== e || a.removeClass(this.markerClassName).empty(), r === i && (r = null));
    },
    _enableDatepicker: function (e) {
      var t,
          a = b(e),
          i = b.data(e, "datepicker");
      a.hasClass(this.markerClassName) && ("input" === (t = e.nodeName.toLowerCase()) ? (e.disabled = !1, i.trigger.filter("button").each(function () {
        this.disabled = !1;
      }).end().filter("img").css({
        opacity: "1.0",
        cursor: ""
      })) : "div" !== t && "span" !== t || ((a = a.children("." + this._inlineClass)).children().removeClass("ui-state-disabled"), a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = b.map(this._disabledInputs, function (t) {
        return t === e ? null : t;
      }));
    },
    _disableDatepicker: function (e) {
      var t,
          a = b(e),
          i = b.data(e, "datepicker");
      a.hasClass(this.markerClassName) && ("input" === (t = e.nodeName.toLowerCase()) ? (e.disabled = !0, i.trigger.filter("button").each(function () {
        this.disabled = !0;
      }).end().filter("img").css({
        opacity: "0.5",
        cursor: "default"
      })) : "div" !== t && "span" !== t || ((a = a.children("." + this._inlineClass)).children().addClass("ui-state-disabled"), a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = b.map(this._disabledInputs, function (t) {
        return t === e ? null : t;
      }), this._disabledInputs[this._disabledInputs.length] = e);
    },
    _isDisabledDatepicker: function (t) {
      if (!t) return !1;

      for (var e = 0; e < this._disabledInputs.length; e++) if (this._disabledInputs[e] === t) return !0;

      return !1;
    },
    _getInst: function (t) {
      try {
        return b.data(t, "datepicker");
      } catch (t) {
        throw "Missing instance data for this datepicker";
      }
    },
    _optionDatepicker: function (t, e, a) {
      var i,
          n,
          r,
          s,
          o = this._getInst(t);

      if (2 === arguments.length && "string" == typeof e) return "defaults" === e ? b.extend({}, b.datepicker._defaults) : o ? "all" === e ? b.extend({}, o.settings) : this._get(o, e) : null;
      i = e || {}, "string" == typeof e && ((i = {})[e] = a), o && (this._curInst === o && this._hideDatepicker(), n = this._getDateDatepicker(t, !0), r = this._getMinMaxDate(o, "min"), s = this._getMinMaxDate(o, "max"), c(o.settings, i), null !== r && void 0 !== i.dateFormat && void 0 === i.minDate && (o.settings.minDate = this._formatDate(o, r)), null !== s && void 0 !== i.dateFormat && void 0 === i.maxDate && (o.settings.maxDate = this._formatDate(o, s)), "disabled" in i && (i.disabled ? this._disableDatepicker(t) : this._enableDatepicker(t)), this._attachments(b(t), o), this._autoSize(o), this._setDate(o, n), this._updateAlternate(o), this._updateDatepicker(o));
    },
    _changeDatepicker: function (t, e, a) {
      this._optionDatepicker(t, e, a);
    },
    _refreshDatepicker: function (t) {
      t = this._getInst(t);
      t && this._updateDatepicker(t);
    },
    _setDateDatepicker: function (t, e) {
      t = this._getInst(t);
      t && (this._setDate(t, e), this._updateDatepicker(t), this._updateAlternate(t));
    },
    _getDateDatepicker: function (t, e) {
      t = this._getInst(t);
      return t && !t.inline && this._setDateFromField(t, e), t ? this._getDate(t) : null;
    },
    _doKeyDown: function (t) {
      var e,
          a,
          i = b.datepicker._getInst(t.target),
          n = !0,
          r = i.dpDiv.is(".ui-datepicker-rtl");

      if (i._keyEvent = !0, b.datepicker._datepickerShowing) switch (t.keyCode) {
        case 9:
          b.datepicker._hideDatepicker(), n = !1;
          break;

        case 13:
          return (a = b("td." + b.datepicker._dayOverClass + ":not(." + b.datepicker._currentClass + ")", i.dpDiv))[0] && b.datepicker._selectDay(t.target, i.selectedMonth, i.selectedYear, a[0]), (e = b.datepicker._get(i, "onSelect")) ? (a = b.datepicker._formatDate(i), e.apply(i.input ? i.input[0] : null, [a, i])) : b.datepicker._hideDatepicker(), !1;

        case 27:
          b.datepicker._hideDatepicker();

          break;

        case 33:
          b.datepicker._adjustDate(t.target, t.ctrlKey ? -b.datepicker._get(i, "stepBigMonths") : -b.datepicker._get(i, "stepMonths"), "M");

          break;

        case 34:
          b.datepicker._adjustDate(t.target, t.ctrlKey ? +b.datepicker._get(i, "stepBigMonths") : +b.datepicker._get(i, "stepMonths"), "M");

          break;

        case 35:
          (t.ctrlKey || t.metaKey) && b.datepicker._clearDate(t.target), n = t.ctrlKey || t.metaKey;
          break;

        case 36:
          (t.ctrlKey || t.metaKey) && b.datepicker._gotoToday(t.target), n = t.ctrlKey || t.metaKey;
          break;

        case 37:
          (t.ctrlKey || t.metaKey) && b.datepicker._adjustDate(t.target, r ? 1 : -1, "D"), n = t.ctrlKey || t.metaKey, t.originalEvent.altKey && b.datepicker._adjustDate(t.target, t.ctrlKey ? -b.datepicker._get(i, "stepBigMonths") : -b.datepicker._get(i, "stepMonths"), "M");
          break;

        case 38:
          (t.ctrlKey || t.metaKey) && b.datepicker._adjustDate(t.target, -7, "D"), n = t.ctrlKey || t.metaKey;
          break;

        case 39:
          (t.ctrlKey || t.metaKey) && b.datepicker._adjustDate(t.target, r ? -1 : 1, "D"), n = t.ctrlKey || t.metaKey, t.originalEvent.altKey && b.datepicker._adjustDate(t.target, t.ctrlKey ? +b.datepicker._get(i, "stepBigMonths") : +b.datepicker._get(i, "stepMonths"), "M");
          break;

        case 40:
          (t.ctrlKey || t.metaKey) && b.datepicker._adjustDate(t.target, 7, "D"), n = t.ctrlKey || t.metaKey;
          break;

        default:
          n = !1;
      } else 36 === t.keyCode && t.ctrlKey ? b.datepicker._showDatepicker(this) : n = !1;
      n && (t.preventDefault(), t.stopPropagation());
    },
    _doKeyPress: function (t) {
      var e,
          a = b.datepicker._getInst(t.target);

      if (b.datepicker._get(a, "constrainInput")) return e = b.datepicker._possibleChars(b.datepicker._get(a, "dateFormat")), a = String.fromCharCode(null == t.charCode ? t.keyCode : t.charCode), t.ctrlKey || t.metaKey || a < " " || !e || -1 < e.indexOf(a);
    },
    _doKeyUp: function (t) {
      var e = b.datepicker._getInst(t.target);

      if (e.input.val() !== e.lastVal) try {
        b.datepicker.parseDate(b.datepicker._get(e, "dateFormat"), e.input ? e.input.val() : null, b.datepicker._getFormatConfig(e)) && (b.datepicker._setDateFromField(e), b.datepicker._updateAlternate(e), b.datepicker._updateDatepicker(e));
      } catch (t) {}
      return !0;
    },
    _showDatepicker: function (t) {
      var e, a, i, n;
      "input" !== (t = t.target || t).nodeName.toLowerCase() && (t = b("input", t.parentNode)[0]), b.datepicker._isDisabledDatepicker(t) || b.datepicker._lastInput === t || (n = b.datepicker._getInst(t), b.datepicker._curInst && b.datepicker._curInst !== n && (b.datepicker._curInst.dpDiv.stop(!0, !0), n && b.datepicker._datepickerShowing && b.datepicker._hideDatepicker(b.datepicker._curInst.input[0])), !1 !== (a = (i = b.datepicker._get(n, "beforeShow")) ? i.apply(t, [t, n]) : {}) && (c(n.settings, a), n.lastVal = null, b.datepicker._lastInput = t, b.datepicker._setDateFromField(n), b.datepicker._inDialog && (t.value = ""), b.datepicker._pos || (b.datepicker._pos = b.datepicker._findPos(t), b.datepicker._pos[1] += t.offsetHeight), e = !1, b(t).parents().each(function () {
        return !(e |= "fixed" === b(this).css("position"));
      }), i = {
        left: b.datepicker._pos[0],
        top: b.datepicker._pos[1]
      }, b.datepicker._pos = null, n.dpDiv.empty(), n.dpDiv.css({
        position: "absolute",
        display: "block",
        top: "-1000px"
      }), b.datepicker._updateDatepicker(n), i = b.datepicker._checkOffset(n, i, e), n.dpDiv.css({
        position: b.datepicker._inDialog && b.blockUI ? "static" : e ? "fixed" : "absolute",
        display: "none",
        left: i.left + "px",
        top: i.top + "px"
      }), n.inline || (a = b.datepicker._get(n, "showAnim"), i = b.datepicker._get(n, "duration"), n.dpDiv.css("z-index", function (t) {
        for (var e, a; t.length && t[0] !== document;) {
          if (("absolute" === (e = t.css("position")) || "relative" === e || "fixed" === e) && (a = parseInt(t.css("zIndex"), 10), !isNaN(a) && 0 !== a)) return a;
          t = t.parent();
        }

        return 0;
      }(b(t)) + 1), b.datepicker._datepickerShowing = !0, b.effects && b.effects.effect[a] ? n.dpDiv.show(a, b.datepicker._get(n, "showOptions"), i) : n.dpDiv[a || "show"](a ? i : null), b.datepicker._shouldFocusInput(n) && n.input.trigger("focus"), b.datepicker._curInst = n)));
    },
    _updateDatepicker: function (t) {
      this.maxRows = 4, (r = t).dpDiv.empty().append(this._generateHTML(t)), this._attachHandlers(t);

      var e,
          a = this._getNumberOfMonths(t),
          i = a[1],
          n = t.dpDiv.find("." + this._dayOverClass + " a");

      0 < n.length && s.apply(n.get(0)), t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), 1 < i && t.dpDiv.addClass("ui-datepicker-multi-" + i).css("width", 17 * i + "em"), t.dpDiv[(1 !== a[0] || 1 !== a[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), t === b.datepicker._curInst && b.datepicker._datepickerShowing && b.datepicker._shouldFocusInput(t) && t.input.trigger("focus"), t.yearshtml && (e = t.yearshtml, setTimeout(function () {
        e === t.yearshtml && t.yearshtml && t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml), e = t.yearshtml = null;
      }, 0));
    },
    _shouldFocusInput: function (t) {
      return t.input && t.input.is(":visible") && !t.input.is(":disabled") && !t.input.is(":focus");
    },
    _checkOffset: function (t, e, a) {
      var i = t.dpDiv.outerWidth(),
          n = t.dpDiv.outerHeight(),
          r = t.input ? t.input.outerWidth() : 0,
          s = t.input ? t.input.outerHeight() : 0,
          o = document.documentElement.clientWidth + (a ? 0 : b(document).scrollLeft()),
          c = document.documentElement.clientHeight + (a ? 0 : b(document).scrollTop());
      return e.left -= this._get(t, "isRTL") ? i - r : 0, e.left -= a && e.left === t.input.offset().left ? b(document).scrollLeft() : 0, e.top -= a && e.top === t.input.offset().top + s ? b(document).scrollTop() : 0, e.left -= Math.min(e.left, e.left + i > o && i < o ? Math.abs(e.left + i - o) : 0), e.top -= Math.min(e.top, e.top + n > c && n < c ? Math.abs(n + s) : 0), e;
    },
    _findPos: function (t) {
      for (var e = this._getInst(t), a = this._get(e, "isRTL"); t && ("hidden" === t.type || 1 !== t.nodeType || b.expr.filters.hidden(t));) t = t[a ? "previousSibling" : "nextSibling"];

      return [(e = b(t).offset()).left, e.top];
    },
    _hideDatepicker: function (t) {
      var e,
          a,
          i = this._curInst;
      !i || t && i !== b.data(t, "datepicker") || this._datepickerShowing && (e = this._get(i, "showAnim"), a = this._get(i, "duration"), t = function () {
        b.datepicker._tidyDialog(i);
      }, b.effects && (b.effects.effect[e] || b.effects[e]) ? i.dpDiv.hide(e, b.datepicker._get(i, "showOptions"), a, t) : i.dpDiv["slideDown" === e ? "slideUp" : "fadeIn" === e ? "fadeOut" : "hide"](e ? a : null, t), e || t(), this._datepickerShowing = !1, (t = this._get(i, "onClose")) && t.apply(i.input ? i.input[0] : null, [i.input ? i.input.val() : "", i]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
        position: "absolute",
        left: "0",
        top: "-100px"
      }), b.blockUI && (b.unblockUI(), b("body").append(this.dpDiv))), this._inDialog = !1);
    },
    _tidyDialog: function (t) {
      t.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar");
    },
    _checkExternalClick: function (t) {
      var e;
      b.datepicker._curInst && (e = b(t.target), t = b.datepicker._getInst(e[0]), (e[0].id === b.datepicker._mainDivId || 0 !== e.parents("#" + b.datepicker._mainDivId).length || e.hasClass(b.datepicker.markerClassName) || e.closest("." + b.datepicker._triggerClass).length || !b.datepicker._datepickerShowing || b.datepicker._inDialog && b.blockUI) && (!e.hasClass(b.datepicker.markerClassName) || b.datepicker._curInst === t) || b.datepicker._hideDatepicker());
    },
    _adjustDate: function (t, e, a) {
      var i = b(t),
          t = this._getInst(i[0]);

      this._isDisabledDatepicker(i[0]) || (this._adjustInstDate(t, e + ("M" === a ? this._get(t, "showCurrentAtPos") : 0), a), this._updateDatepicker(t));
    },
    _gotoToday: function (t) {
      var e = b(t),
          a = this._getInst(e[0]);

      this._get(a, "gotoCurrent") && a.currentDay ? (a.selectedDay = a.currentDay, a.drawMonth = a.selectedMonth = a.currentMonth, a.drawYear = a.selectedYear = a.currentYear) : (t = new Date(), a.selectedDay = t.getDate(), a.drawMonth = a.selectedMonth = t.getMonth(), a.drawYear = a.selectedYear = t.getFullYear()), this._notifyChange(a), this._adjustDate(e);
    },
    _selectMonthYear: function (t, e, a) {
      var i = b(t),
          t = this._getInst(i[0]);

      t["selected" + ("M" === a ? "Month" : "Year")] = t["draw" + ("M" === a ? "Month" : "Year")] = parseInt(e.options[e.selectedIndex].value, 10), this._notifyChange(t), this._adjustDate(i);
    },
    _selectDay: function (t, e, a, i) {
      var n = b(t);
      b(i).hasClass(this._unselectableClass) || this._isDisabledDatepicker(n[0]) || ((n = this._getInst(n[0])).selectedDay = n.currentDay = b("a", i).html(), n.selectedMonth = n.currentMonth = e, n.selectedYear = n.currentYear = a, this._selectDate(t, this._formatDate(n, n.currentDay, n.currentMonth, n.currentYear)));
    },
    _clearDate: function (t) {
      t = b(t);

      this._selectDate(t, "");
    },
    _selectDate: function (t, e) {
      var a = b(t),
          t = this._getInst(a[0]);

      e = null != e ? e : this._formatDate(t), t.input && t.input.val(e), this._updateAlternate(t), (a = this._get(t, "onSelect")) ? a.apply(t.input ? t.input[0] : null, [e, t]) : t.input && t.input.trigger("change"), t.inline ? this._updateDatepicker(t) : (this._hideDatepicker(), this._lastInput = t.input[0], "object" != typeof t.input[0] && t.input.trigger("focus"), this._lastInput = null);
    },
    _updateAlternate: function (t) {
      var e,
          a,
          i = this._get(t, "altField");

      i && (e = this._get(t, "altFormat") || this._get(t, "dateFormat"), a = this._getDate(t), t = this.formatDate(e, a, this._getFormatConfig(t)), b(i).val(t));
    },
    noWeekends: function (t) {
      t = t.getDay();
      return [0 < t && t < 6, ""];
    },
    iso8601Week: function (t) {
      var e = new Date(t.getTime());
      return e.setDate(e.getDate() + 4 - (e.getDay() || 7)), t = e.getTime(), e.setMonth(0), e.setDate(1), Math.floor(Math.round((t - e) / 864e5) / 7) + 1;
    },
    parseDate: function (e, n, t) {
      if (null == e || null == n) throw "Invalid arguments";
      if ("" === (n = "object" == typeof n ? n.toString() : n + "")) return null;

      function r(t) {
        return (t = v + 1 < e.length && e.charAt(v + 1) === t) && v++, t;
      }

      function a(t) {
        var e = r(t),
            e = "@" === t ? 14 : "!" === t ? 20 : "y" === t && e ? 4 : "o" === t ? 3 : 2,
            e = new RegExp("^\\d{" + ("y" === t ? e : 1) + "," + e + "}");
        if (!(e = n.substring(d).match(e))) throw "Missing number at position " + d;
        return d += e[0].length, parseInt(e[0], 10);
      }

      function i(t, e, a) {
        var i = -1,
            e = b.map(r(t) ? a : e, function (t, e) {
          return [[e, t]];
        }).sort(function (t, e) {
          return -(t[1].length - e[1].length);
        });
        if (b.each(e, function (t, e) {
          var a = e[1];
          if (n.substr(d, a.length).toLowerCase() === a.toLowerCase()) return i = e[0], d += a.length, !1;
        }), -1 !== i) return i + 1;
        throw "Unknown name at position " + d;
      }

      function s() {
        if (n.charAt(d) !== e.charAt(v)) throw "Unexpected literal at position " + d;
        d++;
      }

      for (var o, c, l, d = 0, u = (t ? t.shortYearCutoff : null) || this._defaults.shortYearCutoff, u = "string" != typeof u ? u : new Date().getFullYear() % 100 + parseInt(u, 10), h = (t ? t.dayNamesShort : null) || this._defaults.dayNamesShort, p = (t ? t.dayNames : null) || this._defaults.dayNames, f = (t ? t.monthNamesShort : null) || this._defaults.monthNamesShort, g = (t ? t.monthNames : null) || this._defaults.monthNames, m = -1, _ = -1, k = -1, y = -1, D = !1, v = 0; v < e.length; v++) if (D) "'" !== e.charAt(v) || r("'") ? s() : D = !1;else switch (e.charAt(v)) {
        case "d":
          k = a("d");
          break;

        case "D":
          i("D", h, p);
          break;

        case "o":
          y = a("o");
          break;

        case "m":
          _ = a("m");
          break;

        case "M":
          _ = i("M", f, g);
          break;

        case "y":
          m = a("y");
          break;

        case "@":
          m = (l = new Date(a("@"))).getFullYear(), _ = l.getMonth() + 1, k = l.getDate();
          break;

        case "!":
          m = (l = new Date((a("!") - this._ticksTo1970) / 1e4)).getFullYear(), _ = l.getMonth() + 1, k = l.getDate();
          break;

        case "'":
          r("'") ? s() : D = !0;
          break;

        default:
          s();
      }

      if (d < n.length && (c = n.substr(d), !/^\s+/.test(c))) throw "Extra/unparsed characters found in date: " + c;
      if (-1 === m ? m = new Date().getFullYear() : m < 100 && (m += new Date().getFullYear() - new Date().getFullYear() % 100 + (m <= u ? 0 : -100)), -1 < y) for (_ = 1, k = y;;) {
        if (k <= (o = this._getDaysInMonth(m, _ - 1))) break;
        _++, k -= o;
      }
      if ((l = this._daylightSavingAdjust(new Date(m, _ - 1, k))).getFullYear() !== m || l.getMonth() + 1 !== _ || l.getDate() !== k) throw "Invalid date";
      return l;
    },
    ATOM: "yy-mm-dd",
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y",
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd",
    _ticksTo1970: 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 60 * 60 * 1e7,
    formatDate: function (e, t, a) {
      if (!t) return "";

      function n(t) {
        return (t = s + 1 < e.length && e.charAt(s + 1) === t) && s++, t;
      }

      function i(t, e, a) {
        var i = "" + e;
        if (n(t)) for (; i.length < a;) i = "0" + i;
        return i;
      }

      function r(t, e, a, i) {
        return (n(t) ? i : a)[e];
      }

      var s,
          o = (a ? a.dayNamesShort : null) || this._defaults.dayNamesShort,
          c = (a ? a.dayNames : null) || this._defaults.dayNames,
          l = (a ? a.monthNamesShort : null) || this._defaults.monthNamesShort,
          d = (a ? a.monthNames : null) || this._defaults.monthNames,
          u = "",
          h = !1;
      if (t) for (s = 0; s < e.length; s++) if (h) "'" !== e.charAt(s) || n("'") ? u += e.charAt(s) : h = !1;else switch (e.charAt(s)) {
        case "d":
          u += i("d", t.getDate(), 2);
          break;

        case "D":
          u += r("D", t.getDay(), o, c);
          break;

        case "o":
          u += i("o", Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - new Date(t.getFullYear(), 0, 0).getTime()) / 864e5), 3);
          break;

        case "m":
          u += i("m", t.getMonth() + 1, 2);
          break;

        case "M":
          u += r("M", t.getMonth(), l, d);
          break;

        case "y":
          u += n("y") ? t.getFullYear() : (t.getFullYear() % 100 < 10 ? "0" : "") + t.getFullYear() % 100;
          break;

        case "@":
          u += t.getTime();
          break;

        case "!":
          u += 1e4 * t.getTime() + this._ticksTo1970;
          break;

        case "'":
          n("'") ? u += "'" : h = !0;
          break;

        default:
          u += e.charAt(s);
      }
      return u;
    },
    _possibleChars: function (e) {
      function t(t) {
        return (t = n + 1 < e.length && e.charAt(n + 1) === t) && n++, t;
      }

      for (var a = "", i = !1, n = 0; n < e.length; n++) if (i) "'" !== e.charAt(n) || t("'") ? a += e.charAt(n) : i = !1;else switch (e.charAt(n)) {
        case "d":
        case "m":
        case "y":
        case "@":
          a += "0123456789";
          break;

        case "D":
        case "M":
          return null;

        case "'":
          t("'") ? a += "'" : i = !0;
          break;

        default:
          a += e.charAt(n);
      }

      return a;
    },
    _get: function (t, e) {
      return (void 0 !== t.settings[e] ? t.settings : this._defaults)[e];
    },
    _setDateFromField: function (t, e) {
      if (t.input.val() !== t.lastVal) {
        var a = this._get(t, "dateFormat"),
            i = t.lastVal = t.input ? t.input.val() : null,
            n = this._getDefaultDate(t),
            r = n,
            s = this._getFormatConfig(t);

        try {
          r = this.parseDate(a, i, s) || n;
        } catch (t) {
          i = e ? "" : i;
        }

        t.selectedDay = r.getDate(), t.drawMonth = t.selectedMonth = r.getMonth(), t.drawYear = t.selectedYear = r.getFullYear(), t.currentDay = i ? r.getDate() : 0, t.currentMonth = i ? r.getMonth() : 0, t.currentYear = i ? r.getFullYear() : 0, this._adjustInstDate(t);
      }
    },
    _getDefaultDate: function (t) {
      return this._restrictMinMax(t, this._determineDate(t, this._get(t, "defaultDate"), new Date()));
    },
    _determineDate: function (o, t, e) {
      var a,
          i,
          t = null == t || "" === t ? e : "string" == typeof t ? function (t) {
        try {
          return b.datepicker.parseDate(b.datepicker._get(o, "dateFormat"), t, b.datepicker._getFormatConfig(o));
        } catch (t) {}

        for (var e = (t.toLowerCase().match(/^c/) ? b.datepicker._getDate(o) : null) || new Date(), a = e.getFullYear(), i = e.getMonth(), n = e.getDate(), r = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, s = r.exec(t); s;) {
          switch (s[2] || "d") {
            case "d":
            case "D":
              n += parseInt(s[1], 10);
              break;

            case "w":
            case "W":
              n += 7 * parseInt(s[1], 10);
              break;

            case "m":
            case "M":
              i += parseInt(s[1], 10), n = Math.min(n, b.datepicker._getDaysInMonth(a, i));
              break;

            case "y":
            case "Y":
              a += parseInt(s[1], 10), n = Math.min(n, b.datepicker._getDaysInMonth(a, i));
          }

          s = r.exec(t);
        }

        return new Date(a, i, n);
      }(t) : "number" == typeof t ? isNaN(t) ? e : (a = t, (i = new Date()).setDate(i.getDate() + a), i) : new Date(t.getTime());
      return (t = t && "Invalid Date" === t.toString() ? e : t) && (t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0)), this._daylightSavingAdjust(t);
    },
    _daylightSavingAdjust: function (t) {
      return t ? (t.setHours(12 < t.getHours() ? t.getHours() + 2 : 0), t) : null;
    },
    _setDate: function (t, e, a) {
      var i = !e,
          n = t.selectedMonth,
          r = t.selectedYear,
          e = this._restrictMinMax(t, this._determineDate(t, e, new Date()));

      t.selectedDay = t.currentDay = e.getDate(), t.drawMonth = t.selectedMonth = t.currentMonth = e.getMonth(), t.drawYear = t.selectedYear = t.currentYear = e.getFullYear(), n === t.selectedMonth && r === t.selectedYear || a || this._notifyChange(t), this._adjustInstDate(t), t.input && t.input.val(i ? "" : this._formatDate(t));
    },
    _getDate: function (t) {
      return !t.currentYear || t.input && "" === t.input.val() ? null : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay));
    },
    _attachHandlers: function (t) {
      var e = this._get(t, "stepMonths"),
          a = "#" + t.id.replace(/\\\\/g, "\\");

      t.dpDiv.find("[data-handler]").map(function () {
        var t = {
          prev: function () {
            b.datepicker._adjustDate(a, -e, "M");
          },
          next: function () {
            b.datepicker._adjustDate(a, +e, "M");
          },
          hide: function () {
            b.datepicker._hideDatepicker();
          },
          today: function () {
            b.datepicker._gotoToday(a);
          },
          selectDay: function () {
            return b.datepicker._selectDay(a, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1;
          },
          selectMonth: function () {
            return b.datepicker._selectMonthYear(a, this, "M"), !1;
          },
          selectYear: function () {
            return b.datepicker._selectMonthYear(a, this, "Y"), !1;
          }
        };
        b(this).on(this.getAttribute("data-event"), t[this.getAttribute("data-handler")]);
      });
    },
    _generateHTML: function (t) {
      var e,
          a,
          i,
          n,
          r,
          s,
          o,
          c,
          l,
          d,
          u,
          h,
          p,
          f,
          g,
          m,
          _,
          k,
          y,
          D,
          v,
          b,
          M,
          w,
          x,
          C,
          I,
          S,
          F,
          N,
          T,
          Y = new Date(),
          A = this._daylightSavingAdjust(new Date(Y.getFullYear(), Y.getMonth(), Y.getDate())),
          j = this._get(t, "isRTL"),
          O = this._get(t, "showButtonPanel"),
          K = this._get(t, "hideIfNoPrevNext"),
          R = this._get(t, "navigationAsDateFormat"),
          E = this._getNumberOfMonths(t),
          W = this._get(t, "showCurrentAtPos"),
          Y = this._get(t, "stepMonths"),
          H = 1 !== E[0] || 1 !== E[1],
          L = this._daylightSavingAdjust(t.currentDay ? new Date(t.currentYear, t.currentMonth, t.currentDay) : new Date(9999, 9, 9)),
          P = this._getMinMaxDate(t, "min"),
          B = this._getMinMaxDate(t, "max"),
          U = t.drawMonth - W,
          z = t.drawYear;

      if (U < 0 && (U += 12, z--), B) for (e = this._daylightSavingAdjust(new Date(B.getFullYear(), B.getMonth() - E[0] * E[1] + 1, B.getDate())), e = P && e < P ? P : e; this._daylightSavingAdjust(new Date(z, U, 1)) > e;) --U < 0 && (U = 11, z--);

      for (t.drawMonth = U, t.drawYear = z, W = this._get(t, "prevText"), W = R ? this.formatDate(W, this._daylightSavingAdjust(new Date(z, U - Y, 1)), this._getFormatConfig(t)) : W, a = this._canAdjustMonth(t, -1, z, U) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + W + "'><span class='ui-icon ui-icon-circle-triangle-" + (j ? "e" : "w") + "'>" + W + "</span></a>" : K ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + W + "'><span class='ui-icon ui-icon-circle-triangle-" + (j ? "e" : "w") + "'>" + W + "</span></a>", W = this._get(t, "nextText"), W = R ? this.formatDate(W, this._daylightSavingAdjust(new Date(z, U + Y, 1)), this._getFormatConfig(t)) : W, i = this._canAdjustMonth(t, 1, z, U) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + W + "'><span class='ui-icon ui-icon-circle-triangle-" + (j ? "w" : "e") + "'>" + W + "</span></a>" : K ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + W + "'><span class='ui-icon ui-icon-circle-triangle-" + (j ? "w" : "e") + "'>" + W + "</span></a>", K = this._get(t, "currentText"), W = this._get(t, "gotoCurrent") && t.currentDay ? L : A, K = R ? this.formatDate(K, W, this._getFormatConfig(t)) : K, R = t.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(t, "closeText") + "</button>", R = O ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (j ? R : "") + (this._isInRange(t, W) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + K + "</button>" : "") + (j ? "" : R) + "</div>" : "", n = parseInt(this._get(t, "firstDay"), 10), n = isNaN(n) ? 0 : n, r = this._get(t, "showWeek"), s = this._get(t, "dayNames"), o = this._get(t, "dayNamesMin"), c = this._get(t, "monthNames"), l = this._get(t, "monthNamesShort"), d = this._get(t, "beforeShowDay"), u = this._get(t, "showOtherMonths"), h = this._get(t, "selectOtherMonths"), p = this._getDefaultDate(t), f = "", m = 0; m < E[0]; m++) {
        for (_ = "", this.maxRows = 4, k = 0; k < E[1]; k++) {
          if (y = this._daylightSavingAdjust(new Date(z, U, t.selectedDay)), M = " ui-corner-all", D = "", H) {
            if (D += "<div class='ui-datepicker-group", 1 < E[1]) switch (k) {
              case 0:
                D += " ui-datepicker-group-first", M = " ui-corner-" + (j ? "right" : "left");
                break;

              case E[1] - 1:
                D += " ui-datepicker-group-last", M = " ui-corner-" + (j ? "left" : "right");
                break;

              default:
                D += " ui-datepicker-group-middle", M = "";
            }
            D += "'>";
          }

          for (D += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + M + "'>" + (/all|left/.test(M) && 0 === m ? j ? i : a : "") + (/all|right/.test(M) && 0 === m ? j ? a : i : "") + this._generateMonthYearHeader(t, U, z, P, B, 0 < m || 0 < k, c, l) + "</div><table class='ui-datepicker-calendar'><thead><tr>", v = r ? "<th class='ui-datepicker-week-col'>" + this._get(t, "weekHeader") + "</th>" : "", g = 0; g < 7; g++) v += "<th scope='col'" + (5 <= (g + n + 6) % 7 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + s[b = (g + n) % 7] + "'>" + o[b] + "</span></th>";

          for (D += v + "</tr></thead><tbody>", w = this._getDaysInMonth(z, U), z === t.selectedYear && U === t.selectedMonth && (t.selectedDay = Math.min(t.selectedDay, w)), M = (this._getFirstDayOfMonth(z, U) - n + 7) % 7, w = Math.ceil((M + w) / 7), x = H && this.maxRows > w ? this.maxRows : w, this.maxRows = x, C = this._daylightSavingAdjust(new Date(z, U, 1 - M)), I = 0; I < x; I++) {
            for (D += "<tr>", S = r ? "<td class='ui-datepicker-week-col'>" + this._get(t, "calculateWeek")(C) + "</td>" : "", g = 0; g < 7; g++) F = d ? d.apply(t.input ? t.input[0] : null, [C]) : [!0, ""], T = (N = C.getMonth() !== U) && !h || !F[0] || P && C < P || B && B < C, S += "<td class='" + (5 <= (g + n + 6) % 7 ? " ui-datepicker-week-end" : "") + (N ? " ui-datepicker-other-month" : "") + (C.getTime() === y.getTime() && U === t.selectedMonth && t._keyEvent || p.getTime() === C.getTime() && p.getTime() === y.getTime() ? " " + this._dayOverClass : "") + (T ? " " + this._unselectableClass + " ui-state-disabled" : "") + (N && !u ? "" : " " + F[1] + (C.getTime() === L.getTime() ? " " + this._currentClass : "") + (C.getTime() === A.getTime() ? " ui-datepicker-today" : "")) + "'" + (N && !u || !F[2] ? "" : " title='" + F[2].replace(/'/g, "&#39;") + "'") + (T ? "" : " data-handler='selectDay' data-event='click' data-month='" + C.getMonth() + "' data-year='" + C.getFullYear() + "'") + ">" + (N && !u ? "&#xa0;" : T ? "<span class='ui-state-default'>" + C.getDate() + "</span>" : "<a class='ui-state-default" + (C.getTime() === A.getTime() ? " ui-state-highlight" : "") + (C.getTime() === L.getTime() ? " ui-state-active" : "") + (N ? " ui-priority-secondary" : "") + "' href='#'>" + C.getDate() + "</a>") + "</td>", C.setDate(C.getDate() + 1), C = this._daylightSavingAdjust(C);

            D += S + "</tr>";
          }

          11 < ++U && (U = 0, z++), _ += D += "</tbody></table>" + (H ? "</div>" + (0 < E[0] && k === E[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
        }

        f += _;
      }

      return f += R, t._keyEvent = !1, f;
    },
    _generateMonthYearHeader: function (t, e, a, i, n, r, s, o) {
      var c,
          l,
          d,
          u,
          h,
          p,
          f,
          g = this._get(t, "changeMonth"),
          m = this._get(t, "changeYear"),
          _ = this._get(t, "showMonthAfterYear"),
          k = "<div class='ui-datepicker-title'>",
          y = "";

      if (r || !g) y += "<span class='ui-datepicker-month'>" + s[e] + "</span>";else {
        for (c = i && i.getFullYear() === a, l = n && n.getFullYear() === a, y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", d = 0; d < 12; d++) (!c || d >= i.getMonth()) && (!l || d <= n.getMonth()) && (y += "<option value='" + d + "'" + (d === e ? " selected='selected'" : "") + ">" + o[d] + "</option>");

        y += "</select>";
      }
      if (_ || (k += y + (!r && g && m ? "" : "&#xa0;")), !t.yearshtml) if (t.yearshtml = "", r || !m) k += "<span class='ui-datepicker-year'>" + a + "</span>";else {
        for (u = this._get(t, "yearRange").split(":"), h = new Date().getFullYear(), p = (s = function (t) {
          t = t.match(/c[+\-].*/) ? a + parseInt(t.substring(1), 10) : t.match(/[+\-].*/) ? h + parseInt(t, 10) : parseInt(t, 10);
          return isNaN(t) ? h : t;
        })(u[0]), f = Math.max(p, s(u[1] || "")), p = i ? Math.max(p, i.getFullYear()) : p, f = n ? Math.min(f, n.getFullYear()) : f, t.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; p <= f; p++) t.yearshtml += "<option value='" + p + "'" + (p === a ? " selected='selected'" : "") + ">" + p + "</option>";

        t.yearshtml += "</select>", k += t.yearshtml, t.yearshtml = null;
      }
      return k += this._get(t, "yearSuffix"), _ && (k += (!r && g && m ? "" : "&#xa0;") + y), k += "</div>";
    },
    _adjustInstDate: function (t, e, a) {
      var i = t.selectedYear + ("Y" === a ? e : 0),
          n = t.selectedMonth + ("M" === a ? e : 0),
          e = Math.min(t.selectedDay, this._getDaysInMonth(i, n)) + ("D" === a ? e : 0),
          e = this._restrictMinMax(t, this._daylightSavingAdjust(new Date(i, n, e)));

      t.selectedDay = e.getDate(), t.drawMonth = t.selectedMonth = e.getMonth(), t.drawYear = t.selectedYear = e.getFullYear(), "M" !== a && "Y" !== a || this._notifyChange(t);
    },
    _restrictMinMax: function (t, e) {
      var a = this._getMinMaxDate(t, "min"),
          t = this._getMinMaxDate(t, "max"),
          e = a && e < a ? a : e;

      return t && t < e ? t : e;
    },
    _notifyChange: function (t) {
      var e = this._get(t, "onChangeMonthYear");

      e && e.apply(t.input ? t.input[0] : null, [t.selectedYear, t.selectedMonth + 1, t]);
    },
    _getNumberOfMonths: function (t) {
      t = this._get(t, "numberOfMonths");
      return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t;
    },
    _getMinMaxDate: function (t, e) {
      return this._determineDate(t, this._get(t, e + "Date"), null);
    },
    _getDaysInMonth: function (t, e) {
      return 32 - this._daylightSavingAdjust(new Date(t, e, 32)).getDate();
    },
    _getFirstDayOfMonth: function (t, e) {
      return new Date(t, e, 1).getDay();
    },
    _canAdjustMonth: function (t, e, a, i) {
      var n = this._getNumberOfMonths(t),
          n = this._daylightSavingAdjust(new Date(a, i + (e < 0 ? e : n[0] * n[1]), 1));

      return e < 0 && n.setDate(this._getDaysInMonth(n.getFullYear(), n.getMonth())), this._isInRange(t, n);
    },
    _isInRange: function (t, e) {
      var a = this._getMinMaxDate(t, "min"),
          i = this._getMinMaxDate(t, "max"),
          n = null,
          r = null,
          s = this._get(t, "yearRange");

      return s && (t = s.split(":"), s = new Date().getFullYear(), n = parseInt(t[0], 10), r = parseInt(t[1], 10), t[0].match(/[+\-].*/) && (n += s), t[1].match(/[+\-].*/) && (r += s)), (!a || e.getTime() >= a.getTime()) && (!i || e.getTime() <= i.getTime()) && (!n || e.getFullYear() >= n) && (!r || e.getFullYear() <= r);
    },
    _getFormatConfig: function (t) {
      var e = this._get(t, "shortYearCutoff");

      return {
        shortYearCutoff: e = "string" != typeof e ? e : new Date().getFullYear() % 100 + parseInt(e, 10),
        dayNamesShort: this._get(t, "dayNamesShort"),
        dayNames: this._get(t, "dayNames"),
        monthNamesShort: this._get(t, "monthNamesShort"),
        monthNames: this._get(t, "monthNames")
      };
    },
    _formatDate: function (t, e, a, i) {
      e || (t.currentDay = t.selectedDay, t.currentMonth = t.selectedMonth, t.currentYear = t.selectedYear);
      e = e ? "object" == typeof e ? e : this._daylightSavingAdjust(new Date(i, a, e)) : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay));
      return this.formatDate(this._get(t, "dateFormat"), e, this._getFormatConfig(t));
    }
  }), b.fn.datepicker = function (t) {
    if (!this.length) return this;
    b.datepicker.initialized || (b(document).on("mousedown", b.datepicker._checkExternalClick), b.datepicker.initialized = !0), 0 === b("#" + b.datepicker._mainDivId).length && b("body").append(b.datepicker.dpDiv);
    var e = Array.prototype.slice.call(arguments, 1);
    return "string" == typeof t && ("isDisabled" === t || "getDate" === t || "widget" === t) || "option" === t && 2 === arguments.length && "string" == typeof arguments[1] ? b.datepicker["_" + t + "Datepicker"].apply(b.datepicker, [this[0]].concat(e)) : this.each(function () {
      "string" == typeof t ? b.datepicker["_" + t + "Datepicker"].apply(b.datepicker, [this].concat(e)) : b.datepicker._attachDatepicker(this, t);
    });
  }, b.datepicker = new t(), b.datepicker.initialized = !1, b.datepicker.uuid = new Date().getTime(), b.datepicker.version = "1.12.1";
  b.datepicker;

  var d,
      u,
      o,
      h,
      e,
      p,
      f,
      g,
      l,
      i,
      m,
      _,
      n,
      k,
      y,
      D,
      v,
      M,
      w,
      x,
      C,
      I = "ui-effects-",
      S = "ui-effects-style",
      F = "ui-effects-animated",
      N = b;

  function T(t, e, a) {
    var i = g[e.type] || {};
    return null == t ? a || !e.def ? null : e.def : (t = i.floor ? ~~t : parseFloat(t), isNaN(t) ? e.def : i.mod ? (t + i.mod) % i.mod : t < 0 ? 0 : i.max < t ? i.max : t);
  }

  function Y(i) {
    var n = p(),
        r = n._rgba = [];
    return i = i.toLowerCase(), m(e, function (t, e) {
      var a = e.re.exec(i),
          a = a && e.parse(a),
          e = e.space || "rgba";
      if (a) return a = n[e](a), n[f[e].cache] = a[f[e].cache], r = n._rgba = a._rgba, !1;
    }), r.length ? ("0,0,0,0" === r.join() && d.extend(r, o.transparent), n) : o[i];
  }

  function A(t, e, a) {
    return 6 * (a = (a + 1) % 1) < 1 ? t + (e - t) * a * 6 : 2 * a < 1 ? e : 3 * a < 2 ? t + (e - t) * (2 / 3 - a) * 6 : t;
  }

  function j(t) {
    var e,
        a,
        i = t.ownerDocument.defaultView ? t.ownerDocument.defaultView.getComputedStyle(t, null) : t.currentStyle,
        n = {};
    if (i && i.length && i[0] && i[i[0]]) for (a = i.length; a--;) "string" == typeof i[e = i[a]] && (n[b.camelCase(e)] = i[e]);else for (e in i) "string" == typeof i[e] && (n[e] = i[e]);
    return n;
  }

  function O(t, e, a, i) {
    return b.isPlainObject(t) && (t = (e = t).effect), t = {
      effect: t
    }, null == e && (e = {}), b.isFunction(e) && (i = e, a = null, e = {}), "number" != typeof e && !b.fx.speeds[e] || (i = a, a = e, e = {}), b.isFunction(a) && (i = a, a = null), e && b.extend(t, e), a = a || e.duration, t.duration = b.fx.off ? 0 : "number" == typeof a ? a : a in b.fx.speeds ? b.fx.speeds[a] : b.fx.speeds._default, t.complete = i || e.complete, t;
  }

  function K(t) {
    return !t || "number" == typeof t || b.fx.speeds[t] || "string" == typeof t && !b.effects.effect[t] || b.isFunction(t) || "object" == typeof t && !t.effect;
  }

  function R(t, e) {
    var a = e.outerWidth(),
        e = e.outerHeight(),
        t = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/.exec(t) || ["", 0, a, e, 0];
    return {
      top: parseFloat(t[1]) || 0,
      right: "auto" === t[2] ? a : parseFloat(t[2]),
      bottom: "auto" === t[3] ? e : parseFloat(t[3]),
      left: parseFloat(t[4]) || 0
    };
  }

  b.effects = {
    effect: {}
  }, h = /^([\-+])=\s*(\d+\.?\d*)/, e = [{
    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
    parse: function (t) {
      return [t[1], t[2], t[3], t[4]];
    }
  }, {
    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
    parse: function (t) {
      return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]];
    }
  }, {
    re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
    parse: function (t) {
      return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)];
    }
  }, {
    re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
    parse: function (t) {
      return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)];
    }
  }, {
    re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
    space: "hsla",
    parse: function (t) {
      return [t[1], t[2] / 100, t[3] / 100, t[4]];
    }
  }], p = (d = N).Color = function (t, e, a, i) {
    return new d.Color.fn.parse(t, e, a, i);
  }, f = {
    rgba: {
      props: {
        red: {
          idx: 0,
          type: "byte"
        },
        green: {
          idx: 1,
          type: "byte"
        },
        blue: {
          idx: 2,
          type: "byte"
        }
      }
    },
    hsla: {
      props: {
        hue: {
          idx: 0,
          type: "degrees"
        },
        saturation: {
          idx: 1,
          type: "percent"
        },
        lightness: {
          idx: 2,
          type: "percent"
        }
      }
    }
  }, g = {
    byte: {
      floor: !0,
      max: 255
    },
    percent: {
      max: 1
    },
    degrees: {
      mod: 360,
      floor: !0
    }
  }, l = p.support = {}, i = d("<p>")[0], m = d.each, i.style.cssText = "background-color:rgba(1,1,1,.5)", l.rgba = -1 < i.style.backgroundColor.indexOf("rgba"), m(f, function (t, e) {
    e.cache = "_" + t, e.props.alpha = {
      idx: 3,
      type: "percent",
      def: 1
    };
  }), p.fn = d.extend(p.prototype, {
    parse: function (n, t, e, a) {
      if (n === u) return this._rgba = [null, null, null, null], this;
      (n.jquery || n.nodeType) && (n = d(n).css(t), t = u);
      var r = this,
          i = d.type(n),
          s = this._rgba = [];
      return t !== u && (n = [n, t, e, a], i = "array"), "string" === i ? this.parse(Y(n) || o._default) : "array" === i ? (m(f.rgba.props, function (t, e) {
        s[e.idx] = T(n[e.idx], e);
      }), this) : "object" === i ? (m(f, n instanceof p ? function (t, e) {
        n[e.cache] && (r[e.cache] = n[e.cache].slice());
      } : function (t, a) {
        var i = a.cache;
        m(a.props, function (t, e) {
          if (!r[i] && a.to) {
            if ("alpha" === t || null == n[t]) return;
            r[i] = a.to(r._rgba);
          }

          r[i][e.idx] = T(n[t], e, !0);
        }), r[i] && d.inArray(null, r[i].slice(0, 3)) < 0 && (r[i][3] = 1, a.from && (r._rgba = a.from(r[i])));
      }), this) : void 0;
    },
    is: function (t) {
      var n = p(t),
          r = !0,
          s = this;
      return m(f, function (t, e) {
        var a,
            i = n[e.cache];
        return i && (a = s[e.cache] || e.to && e.to(s._rgba) || [], m(e.props, function (t, e) {
          if (null != i[e.idx]) return r = i[e.idx] === a[e.idx];
        })), r;
      }), r;
    },
    _space: function () {
      var a = [],
          i = this;
      return m(f, function (t, e) {
        i[e.cache] && a.push(t);
      }), a.pop();
    },
    transition: function (t, s) {
      var e = (l = p(t))._space(),
          a = f[e],
          t = 0 === this.alpha() ? p("transparent") : this,
          o = t[a.cache] || a.to(t._rgba),
          c = o.slice(),
          l = l[a.cache];

      return m(a.props, function (t, e) {
        var a = e.idx,
            i = o[a],
            n = l[a],
            r = g[e.type] || {};
        null !== n && (null === i ? c[a] = n : (r.mod && (r.mod / 2 < n - i ? i += r.mod : r.mod / 2 < i - n && (i -= r.mod)), c[a] = T((n - i) * s + i, e)));
      }), this[e](c);
    },
    blend: function (t) {
      if (1 === this._rgba[3]) return this;

      var e = this._rgba.slice(),
          a = e.pop(),
          i = p(t)._rgba;

      return p(d.map(e, function (t, e) {
        return (1 - a) * i[e] + a * t;
      }));
    },
    toRgbaString: function () {
      var t = "rgba(",
          e = d.map(this._rgba, function (t, e) {
        return null == t ? 2 < e ? 1 : 0 : t;
      });
      return 1 === e[3] && (e.pop(), t = "rgb("), t + e.join() + ")";
    },
    toHslaString: function () {
      var t = "hsla(",
          e = d.map(this.hsla(), function (t, e) {
        return null == t && (t = 2 < e ? 1 : 0), e && e < 3 && (t = Math.round(100 * t) + "%"), t;
      });
      return 1 === e[3] && (e.pop(), t = "hsl("), t + e.join() + ")";
    },
    toHexString: function (t) {
      var e = this._rgba.slice(),
          a = e.pop();

      return t && e.push(~~(255 * a)), "#" + d.map(e, function (t) {
        return 1 === (t = (t || 0).toString(16)).length ? "0" + t : t;
      }).join("");
    },
    toString: function () {
      return 0 === this._rgba[3] ? "transparent" : this.toRgbaString();
    }
  }), p.fn.parse.prototype = p.fn, f.hsla.to = function (t) {
    if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
    var e = t[0] / 255,
        a = t[1] / 255,
        i = t[2] / 255,
        n = t[3],
        r = Math.max(e, a, i),
        s = Math.min(e, a, i),
        o = r - s,
        c = r + s,
        t = .5 * c,
        a = s === r ? 0 : e === r ? 60 * (a - i) / o + 360 : a === r ? 60 * (i - e) / o + 120 : 60 * (e - a) / o + 240,
        c = 0 == o ? 0 : t <= .5 ? o / c : o / (2 - c);
    return [Math.round(a) % 360, c, t, null == n ? 1 : n];
  }, f.hsla.from = function (t) {
    if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
    var e = t[0] / 360,
        a = t[1],
        i = t[2],
        t = t[3],
        a = i <= .5 ? i * (1 + a) : i + a - i * a,
        i = 2 * i - a;
    return [Math.round(255 * A(i, a, e + 1 / 3)), Math.round(255 * A(i, a, e)), Math.round(255 * A(i, a, e - 1 / 3)), t];
  }, m(f, function (c, t) {
    var r = t.props,
        s = t.cache,
        o = t.to,
        l = t.from;
    p.fn[c] = function (t) {
      if (o && !this[s] && (this[s] = o(this._rgba)), t === u) return this[s].slice();
      var e,
          a = d.type(t),
          i = "array" === a || "object" === a ? t : arguments,
          n = this[s].slice();
      return m(r, function (t, e) {
        t = i["object" === a ? t : e.idx];
        null == t && (t = n[e.idx]), n[e.idx] = T(t, e);
      }), l ? ((e = p(l(n)))[s] = n, e) : p(n);
    }, m(r, function (s, o) {
      p.fn[s] || (p.fn[s] = function (t) {
        var e,
            a = d.type(t),
            i = "alpha" === s ? this._hsla ? "hsla" : "rgba" : c,
            n = this[i](),
            r = n[o.idx];
        return "undefined" === a ? r : ("function" === a && (t = t.call(this, r), a = d.type(t)), null == t && o.empty ? this : ("string" === a && (e = h.exec(t)) && (t = r + parseFloat(e[2]) * ("+" === e[1] ? 1 : -1)), n[o.idx] = t, this[i](n)));
      });
    });
  }), p.hook = function (t) {
    t = t.split(" ");
    m(t, function (t, r) {
      d.cssHooks[r] = {
        set: function (t, e) {
          var a,
              i,
              n = "";

          if ("transparent" !== e && ("string" !== d.type(e) || (a = Y(e)))) {
            if (e = p(a || e), !l.rgba && 1 !== e._rgba[3]) {
              for (i = "backgroundColor" === r ? t.parentNode : t; ("" === n || "transparent" === n) && i && i.style;) try {
                n = d.css(i, "backgroundColor"), i = i.parentNode;
              } catch (t) {}

              e = e.blend(n && "transparent" !== n ? n : "_default");
            }

            e = e.toRgbaString();
          }

          try {
            t.style[r] = e;
          } catch (t) {}
        }
      }, d.fx.step[r] = function (t) {
        t.colorInit || (t.start = p(t.elem, r), t.end = p(t.end), t.colorInit = !0), d.cssHooks[r].set(t.elem, t.start.transition(t.end, t.pos));
      };
    });
  }, p.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor"), d.cssHooks.borderColor = {
    expand: function (a) {
      var i = {};
      return m(["Top", "Right", "Bottom", "Left"], function (t, e) {
        i["border" + e + "Color"] = a;
      }), i;
    }
  }, o = d.Color.names = {
    aqua: "#00ffff",
    black: "#000000",
    blue: "#0000ff",
    fuchsia: "#ff00ff",
    gray: "#808080",
    green: "#008000",
    lime: "#00ff00",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    purple: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    teal: "#008080",
    white: "#ffffff",
    yellow: "#ffff00",
    transparent: [null, null, null, 0],
    _default: "#ffffff"
  }, y = ["add", "remove", "toggle"], D = {
    border: 1,
    borderBottom: 1,
    borderColor: 1,
    borderLeft: 1,
    borderRight: 1,
    borderTop: 1,
    borderWidth: 1,
    margin: 1,
    padding: 1
  }, b.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (t, e) {
    b.fx.step[e] = function (t) {
      ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (N.style(t.elem, e, t.end), t.setAttr = !0);
    };
  }), b.fn.addBack || (b.fn.addBack = function (t) {
    return this.add(null == t ? this.prevObject : this.prevObject.filter(t));
  }), b.effects.animateClass = function (n, t, e, a) {
    var r = b.speed(t, e, a);
    return this.queue(function () {
      var a = b(this),
          t = a.attr("class") || "",
          e = (e = r.children ? a.find("*").addBack() : a).map(function () {
        return {
          el: b(this),
          start: j(this)
        };
      }),
          i = function () {
        b.each(y, function (t, e) {
          n[e] && a[e + "Class"](n[e]);
        });
      };

      i(), e = e.map(function () {
        return this.end = j(this.el[0]), this.diff = function (t, e) {
          var a,
              i,
              n = {};

          for (a in e) i = e[a], t[a] !== i && (D[a] || !b.fx.step[a] && isNaN(parseFloat(i)) || (n[a] = i));

          return n;
        }(this.start, this.end), this;
      }), a.attr("class", t), e = e.map(function () {
        var t = this,
            e = b.Deferred(),
            a = b.extend({}, r, {
          queue: !1,
          complete: function () {
            e.resolve(t);
          }
        });
        return this.el.animate(this.diff, a), e.promise();
      }), b.when.apply(b, e.get()).done(function () {
        i(), b.each(arguments, function () {
          var e = this.el;
          b.each(this.diff, function (t) {
            e.css(t, "");
          });
        }), r.complete.call(a[0]);
      });
    });
  }, b.fn.extend({
    addClass: (k = b.fn.addClass, function (t, e, a, i) {
      return e ? b.effects.animateClass.call(this, {
        add: t
      }, e, a, i) : k.apply(this, arguments);
    }),
    removeClass: (n = b.fn.removeClass, function (t, e, a, i) {
      return 1 < arguments.length ? b.effects.animateClass.call(this, {
        remove: t
      }, e, a, i) : n.apply(this, arguments);
    }),
    toggleClass: (_ = b.fn.toggleClass, function (t, e, a, i, n) {
      return "boolean" == typeof e || void 0 === e ? a ? b.effects.animateClass.call(this, e ? {
        add: t
      } : {
        remove: t
      }, a, i, n) : _.apply(this, arguments) : b.effects.animateClass.call(this, {
        toggle: t
      }, e, a, i);
    }),
    switchClass: function (t, e, a, i, n) {
      return b.effects.animateClass.call(this, {
        add: e,
        remove: t
      }, a, i, n);
    }
  }), b.expr && b.expr.filters && b.expr.filters.animated && (b.expr.filters.animated = (v = b.expr.filters.animated, function (t) {
    return !!b(t).data(F) || v(t);
  })), !1 !== b.uiBackCompat && b.extend(b.effects, {
    save: function (t, e) {
      for (var a = 0, i = e.length; a < i; a++) null !== e[a] && t.data(I + e[a], t[0].style[e[a]]);
    },
    restore: function (t, e) {
      for (var a, i = 0, n = e.length; i < n; i++) null !== e[i] && (a = t.data(I + e[i]), t.css(e[i], a));
    },
    setMode: function (t, e) {
      return "toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e;
    },
    createWrapper: function (a) {
      if (a.parent().is(".ui-effects-wrapper")) return a.parent();
      var i = {
        width: a.outerWidth(!0),
        height: a.outerHeight(!0),
        float: a.css("float")
      },
          t = b("<div></div>").addClass("ui-effects-wrapper").css({
        fontSize: "100%",
        background: "transparent",
        border: "none",
        margin: 0,
        padding: 0
      }),
          e = {
        width: a.width(),
        height: a.height()
      },
          n = document.activeElement;

      try {
        n.id;
      } catch (t) {
        n = document.body;
      }

      return a.wrap(t), a[0] !== n && !b.contains(a[0], n) || b(n).trigger("focus"), t = a.parent(), "static" === a.css("position") ? (t.css({
        position: "relative"
      }), a.css({
        position: "relative"
      })) : (b.extend(i, {
        position: a.css("position"),
        zIndex: a.css("z-index")
      }), b.each(["top", "left", "bottom", "right"], function (t, e) {
        i[e] = a.css(e), isNaN(parseInt(i[e], 10)) && (i[e] = "auto");
      }), a.css({
        position: "relative",
        top: 0,
        left: 0,
        right: "auto",
        bottom: "auto"
      })), a.css(e), t.css(i).show();
    },
    removeWrapper: function (t) {
      var e = document.activeElement;
      return t.parent().is(".ui-effects-wrapper") && (t.parent().replaceWith(t), t[0] !== e && !b.contains(t[0], e) || b(e).trigger("focus")), t;
    }
  }), b.extend(b.effects, {
    version: "1.12.1",
    define: function (t, e, a) {
      return a || (a = e, e = "effect"), b.effects.effect[t] = a, b.effects.effect[t].mode = e, a;
    },
    scaledDimensions: function (t, e, a) {
      if (0 === e) return {
        height: 0,
        width: 0,
        outerHeight: 0,
        outerWidth: 0
      };
      var i = "horizontal" !== a ? (e || 100) / 100 : 1,
          e = "vertical" !== a ? (e || 100) / 100 : 1;
      return {
        height: t.height() * e,
        width: t.width() * i,
        outerHeight: t.outerHeight() * e,
        outerWidth: t.outerWidth() * i
      };
    },
    clipToBox: function (t) {
      return {
        width: t.clip.right - t.clip.left,
        height: t.clip.bottom - t.clip.top,
        left: t.clip.left,
        top: t.clip.top
      };
    },
    unshift: function (t, e, a) {
      var i = t.queue();
      1 < e && i.splice.apply(i, [1, 0].concat(i.splice(e, a))), t.dequeue();
    },
    saveStyle: function (t) {
      t.data(S, t[0].style.cssText);
    },
    restoreStyle: function (t) {
      t[0].style.cssText = t.data(S) || "", t.removeData(S);
    },
    mode: function (t, e) {
      t = t.is(":hidden");
      return "toggle" === e && (e = t ? "show" : "hide"), (t ? "hide" === e : "show" === e) && (e = "none"), e;
    },
    getBaseline: function (t, e) {
      var a, i;

      switch (t[0]) {
        case "top":
          a = 0;
          break;

        case "middle":
          a = .5;
          break;

        case "bottom":
          a = 1;
          break;

        default:
          a = t[0] / e.height;
      }

      switch (t[1]) {
        case "left":
          i = 0;
          break;

        case "center":
          i = .5;
          break;

        case "right":
          i = 1;
          break;

        default:
          i = t[1] / e.width;
      }

      return {
        x: i,
        y: a
      };
    },
    createPlaceholder: function (t) {
      var e,
          a = t.css("position"),
          i = t.position();
      return t.css({
        marginTop: t.css("marginTop"),
        marginBottom: t.css("marginBottom"),
        marginLeft: t.css("marginLeft"),
        marginRight: t.css("marginRight")
      }).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()), /^(static|relative)/.test(a) && (a = "absolute", e = b("<" + t[0].nodeName + ">").insertAfter(t).css({
        display: /^(inline|ruby)/.test(t.css("display")) ? "inline-block" : "block",
        visibility: "hidden",
        marginTop: t.css("marginTop"),
        marginBottom: t.css("marginBottom"),
        marginLeft: t.css("marginLeft"),
        marginRight: t.css("marginRight"),
        float: t.css("float")
      }).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).addClass("ui-effects-placeholder"), t.data(I + "placeholder", e)), t.css({
        position: a,
        left: i.left,
        top: i.top
      }), e;
    },
    removePlaceholder: function (t) {
      var e = I + "placeholder",
          a = t.data(e);
      a && (a.remove(), t.removeData(e));
    },
    cleanUp: function (t) {
      b.effects.restoreStyle(t), b.effects.removePlaceholder(t);
    },
    setTransition: function (i, t, n, r) {
      return r = r || {}, b.each(t, function (t, e) {
        var a = i.cssUnit(e);
        0 < a[0] && (r[e] = a[0] * n + a[1]);
      }), r;
    }
  }), b.fn.extend({
    effect: function () {
      function t(t) {
        var e = b(this),
            a = b.effects.mode(e, o) || r;
        e.data(F, !0), c.push(a), r && ("show" === a || a === r && "hide" === a) && e.show(), r && "none" === a || b.effects.saveStyle(e), b.isFunction(t) && t();
      }

      var i = O.apply(this, arguments),
          n = b.effects.effect[i.effect],
          r = n.mode,
          e = i.queue,
          a = e || "fx",
          s = i.complete,
          o = i.mode,
          c = [];
      return b.fx.off || !n ? o ? this[o](i.duration, s) : this.each(function () {
        s && s.call(this);
      }) : !1 === e ? this.each(t).each(l) : this.queue(a, t).queue(a, l);

      function l(t) {
        var e = b(this);

        function a() {
          b.isFunction(s) && s.call(e[0]), b.isFunction(t) && t();
        }

        i.mode = c.shift(), !1 === b.uiBackCompat || r ? "none" === i.mode ? (e[o](), a()) : n.call(e[0], i, function () {
          e.removeData(F), b.effects.cleanUp(e), "hide" === i.mode && e.hide(), a();
        }) : (e.is(":hidden") ? "hide" === o : "show" === o) ? (e[o](), a()) : n.call(e[0], i, a);
      }
    },
    show: (x = b.fn.show, function (t) {
      if (K(t)) return x.apply(this, arguments);
      var e = O.apply(this, arguments);
      return e.mode = "show", this.effect.call(this, e);
    }),
    hide: (w = b.fn.hide, function (t) {
      if (K(t)) return w.apply(this, arguments);
      var e = O.apply(this, arguments);
      return e.mode = "hide", this.effect.call(this, e);
    }),
    toggle: (M = b.fn.toggle, function (t) {
      if (K(t) || "boolean" == typeof t) return M.apply(this, arguments);
      var e = O.apply(this, arguments);
      return e.mode = "toggle", this.effect.call(this, e);
    }),
    cssUnit: function (t) {
      var a = this.css(t),
          i = [];
      return b.each(["em", "px", "%", "pt"], function (t, e) {
        0 < a.indexOf(e) && (i = [parseFloat(a), e]);
      }), i;
    },
    cssClip: function (t) {
      return t ? this.css("clip", "rect(" + t.top + "px " + t.right + "px " + t.bottom + "px " + t.left + "px)") : R(this.css("clip"), this);
    },
    transfer: function (t, e) {
      var a = b(this),
          i = b(t.to),
          n = "fixed" === i.css("position"),
          r = b("body"),
          s = n ? r.scrollTop() : 0,
          o = n ? r.scrollLeft() : 0,
          r = i.offset(),
          r = {
        top: r.top - s,
        left: r.left - o,
        height: i.innerHeight(),
        width: i.innerWidth()
      },
          i = a.offset(),
          c = b("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(t.className).css({
        top: i.top - s,
        left: i.left - o,
        height: a.innerHeight(),
        width: a.innerWidth(),
        position: n ? "fixed" : "absolute"
      }).animate(r, t.duration, t.easing, function () {
        c.remove(), b.isFunction(e) && e();
      });
    }
  }), b.fx.step.clip = function (t) {
    t.clipInit || (t.start = b(t.elem).cssClip(), "string" == typeof t.end && (t.end = R(t.end, t.elem)), t.clipInit = !0), b(t.elem).cssClip({
      top: t.pos * (t.end.top - t.start.top) + t.start.top,
      right: t.pos * (t.end.right - t.start.right) + t.start.right,
      bottom: t.pos * (t.end.bottom - t.start.bottom) + t.start.bottom,
      left: t.pos * (t.end.left - t.start.left) + t.start.left
    });
  }, C = {}, b.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (e, t) {
    C[t] = function (t) {
      return Math.pow(t, e + 2);
    };
  }), b.extend(C, {
    Sine: function (t) {
      return 1 - Math.cos(t * Math.PI / 2);
    },
    Circ: function (t) {
      return 1 - Math.sqrt(1 - t * t);
    },
    Elastic: function (t) {
      return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15);
    },
    Back: function (t) {
      return t * t * (3 * t - 2);
    },
    Bounce: function (t) {
      for (var e, a = 4; t < ((e = Math.pow(2, --a)) - 1) / 11;);

      return 1 / Math.pow(4, 3 - a) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2);
    }
  }), b.each(C, function (t, e) {
    b.easing["easeIn" + t] = e, b.easing["easeOut" + t] = function (t) {
      return 1 - e(1 - t);
    }, b.easing["easeInOut" + t] = function (t) {
      return t < .5 ? e(2 * t) / 2 : 1 - e(-2 * t + 2) / 2;
    };
  });
  b.effects, b.effects.define("fade", "toggle", function (t, e) {
    var a = "show" === t.mode;
    b(this).css("opacity", a ? 0 : 1).animate({
      opacity: a ? 1 : 0
    }, {
      queue: !1,
      duration: t.duration,
      easing: t.easing,
      complete: e
    });
  });
});
+function ($) {
  'use strict'; // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';

  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.4.1';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null;
    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = {
        relatedTarget: this
      };
      if (!$parent.hasClass('open')) return;
      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));
      if (e.isDefaultPrevented()) return;
      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);
    if ($this.is('.disabled, :disabled')) return;
    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');
    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = {
        relatedTarget: this
      };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
      if (e.isDefaultPrevented()) return;
      $this.trigger('focus').attr('aria-expanded', 'true');
      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;
    var $this = $(this);
    e.preventDefault();
    e.stopPropagation();
    if ($this.is('.disabled, :disabled')) return;
    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);
    if (!$items.length) return;
    var index = $items.index(e.target);
    if (e.which == 38 && index > 0) index--; // up

    if (e.which == 40 && index < $items.length - 1) index++; // down

    if (!~index) index = 0;
    $items.eq(index).trigger('focus');
  }; // DROPDOWN PLUGIN DEFINITION
  // ==========================


  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');
      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;
  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown; // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  }; // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================


  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);
/*!
 * Bootstrap-select v1.13.9 (https://developer.snapappointments.com/bootstrap-select)
 *
 * Copyright 2012-2019 SnapAppointments, LLC
 * Licensed under MIT (https://github.com/snapappointments/bootstrap-select/blob/master/LICENSE)
 */
!function (e, t) {
  void 0 === e && void 0 !== window && (e = window), "function" == typeof define && define.amd ? define(["jquery"], function (e) {
    return t(e);
  }) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(e.jQuery);
}(this, function (e) {
  !function (z) {
    "use strict";

    var d = ["sanitize", "whiteList", "sanitizeFn"],
        l = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
        e = {
      "*": ["class", "dir", "id", "lang", "role", "tabindex", "style", /^aria-[\w-]*$/i],
      a: ["target", "href", "title", "rel"],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      div: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ["src", "alt", "title", "width", "height"],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    },
        r = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,
        a = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

    function v(e, t) {
      var i = e.nodeName.toLowerCase();
      if (-1 !== z.inArray(i, t)) return -1 === z.inArray(i, l) || Boolean(e.nodeValue.match(r) || e.nodeValue.match(a));

      for (var s = z(t).filter(function (e, t) {
        return t instanceof RegExp;
      }), n = 0, o = s.length; n < o; n++) if (i.match(s[n])) return !0;

      return !1;
    }

    function B(e, t, i) {
      if (i && "function" == typeof i) return i(e);

      for (var s = Object.keys(t), n = 0, o = e.length; n < o; n++) for (var l = e[n].querySelectorAll("*"), r = 0, a = l.length; r < a; r++) {
        var c = l[r],
            d = c.nodeName.toLowerCase();
        if (-1 !== s.indexOf(d)) for (var h = [].slice.call(c.attributes), p = [].concat(t["*"] || [], t[d] || []), u = 0, f = h.length; u < f; u++) {
          var m = h[u];
          v(m, p) || c.removeAttribute(m.nodeName);
        } else c.parentNode.removeChild(c);
      }
    }

    "classList" in document.createElement("_") || function (e) {
      if ("Element" in e) {
        var t = "classList",
            i = "prototype",
            s = e.Element[i],
            n = Object,
            o = function () {
          var i = z(this);
          return {
            add: function (e) {
              return e = Array.prototype.slice.call(arguments).join(" "), i.addClass(e);
            },
            remove: function (e) {
              return e = Array.prototype.slice.call(arguments).join(" "), i.removeClass(e);
            },
            toggle: function (e, t) {
              return i.toggleClass(e, t);
            },
            contains: function (e) {
              return i.hasClass(e);
            }
          };
        };

        if (n.defineProperty) {
          var l = {
            get: o,
            enumerable: !0,
            configurable: !0
          };

          try {
            n.defineProperty(s, t, l);
          } catch (e) {
            void 0 !== e.number && -2146823252 !== e.number || (l.enumerable = !1, n.defineProperty(s, t, l));
          }
        } else n[i].__defineGetter__ && s.__defineGetter__(t, o);
      }
    }(window);
    var t,
        c,
        i,
        s = document.createElement("_");

    if (s.classList.add("c1", "c2"), !s.classList.contains("c2")) {
      var n = DOMTokenList.prototype.add,
          o = DOMTokenList.prototype.remove;
      DOMTokenList.prototype.add = function () {
        Array.prototype.forEach.call(arguments, n.bind(this));
      }, DOMTokenList.prototype.remove = function () {
        Array.prototype.forEach.call(arguments, o.bind(this));
      };
    }

    if (s.classList.toggle("c3", !1), s.classList.contains("c3")) {
      var h = DOMTokenList.prototype.toggle;

      DOMTokenList.prototype.toggle = function (e, t) {
        return 1 in arguments && !this.contains(e) == !t ? t : h.call(this, e);
      };
    }

    function E(e) {
      var t,
          i = [],
          s = e.selectedOptions;
      if (e.multiple) for (var n = 0, o = s.length; n < o; n++) t = s[n], i.push(t.value || t.text);else i = e.value;
      return i;
    }

    s = null, String.prototype.startsWith || (t = function () {
      try {
        var e = {},
            t = Object.defineProperty,
            i = t(e, e, e) && t;
      } catch (e) {}

      return i;
    }(), c = {}.toString, i = function (e) {
      if (null == this) throw new TypeError();
      var t = String(this);
      if (e && "[object RegExp]" == c.call(e)) throw new TypeError();
      var i = t.length,
          s = String(e),
          n = s.length,
          o = 1 < arguments.length ? arguments[1] : void 0,
          l = o ? Number(o) : 0;
      l != l && (l = 0);
      var r = Math.min(Math.max(l, 0), i);
      if (i < n + r) return !1;

      for (var a = -1; ++a < n;) if (t.charCodeAt(r + a) != s.charCodeAt(a)) return !1;

      return !0;
    }, t ? t(String.prototype, "startsWith", {
      value: i,
      configurable: !0,
      writable: !0
    }) : String.prototype.startsWith = i), Object.keys || (Object.keys = function (e, t, i) {
      for (t in i = [], e) i.hasOwnProperty.call(e, t) && i.push(t);

      return i;
    }), HTMLSelectElement && !HTMLSelectElement.prototype.hasOwnProperty("selectedOptions") && Object.defineProperty(HTMLSelectElement.prototype, "selectedOptions", {
      get: function () {
        return this.querySelectorAll(":checked");
      }
    });
    var p = {
      useDefault: !1,
      _set: z.valHooks.select.set
    };

    z.valHooks.select.set = function (e, t) {
      return t && !p.useDefault && z(e).data("selected", !0), p._set.apply(this, arguments);
    };

    var C = null,
        u = function () {
      try {
        return new Event("change"), !0;
      } catch (e) {
        return !1;
      }
    }();

    function $(e, t, i, s) {
      for (var n = ["display", "subtext", "tokens"], o = !1, l = 0; l < n.length; l++) {
        var r = n[l],
            a = e[r];
        if (a && (a = a.toString(), "display" === r && (a = a.replace(/<[^>]+>/g, "")), s && (a = w(a)), a = a.toUpperCase(), o = "contains" === i ? 0 <= a.indexOf(t) : a.startsWith(t))) break;
      }

      return o;
    }

    function L(e) {
      return parseInt(e, 10) || 0;
    }

    z.fn.triggerNative = function (e) {
      var t,
          i = this[0];
      i.dispatchEvent ? (u ? t = new Event(e, {
        bubbles: !0
      }) : (t = document.createEvent("Event")).initEvent(e, !0, !1), i.dispatchEvent(t)) : i.fireEvent ? ((t = document.createEventObject()).eventType = e, i.fireEvent("on" + e, t)) : this.trigger(e);
    };

    var f = {
      "\xc0": "A",
      "\xc1": "A",
      "\xc2": "A",
      "\xc3": "A",
      "\xc4": "A",
      "\xc5": "A",
      "\xe0": "a",
      "\xe1": "a",
      "\xe2": "a",
      "\xe3": "a",
      "\xe4": "a",
      "\xe5": "a",
      "\xc7": "C",
      "\xe7": "c",
      "\xd0": "D",
      "\xf0": "d",
      "\xc8": "E",
      "\xc9": "E",
      "\xca": "E",
      "\xcb": "E",
      "\xe8": "e",
      "\xe9": "e",
      "\xea": "e",
      "\xeb": "e",
      "\xcc": "I",
      "\xcd": "I",
      "\xce": "I",
      "\xcf": "I",
      "\xec": "i",
      "\xed": "i",
      "\xee": "i",
      "\xef": "i",
      "\xd1": "N",
      "\xf1": "n",
      "\xd2": "O",
      "\xd3": "O",
      "\xd4": "O",
      "\xd5": "O",
      "\xd6": "O",
      "\xd8": "O",
      "\xf2": "o",
      "\xf3": "o",
      "\xf4": "o",
      "\xf5": "o",
      "\xf6": "o",
      "\xf8": "o",
      "\xd9": "U",
      "\xda": "U",
      "\xdb": "U",
      "\xdc": "U",
      "\xf9": "u",
      "\xfa": "u",
      "\xfb": "u",
      "\xfc": "u",
      "\xdd": "Y",
      "\xfd": "y",
      "\xff": "y",
      "\xc6": "Ae",
      "\xe6": "ae",
      "\xde": "Th",
      "\xfe": "th",
      "\xdf": "ss",
      "\u0100": "A",
      "\u0102": "A",
      "\u0104": "A",
      "\u0101": "a",
      "\u0103": "a",
      "\u0105": "a",
      "\u0106": "C",
      "\u0108": "C",
      "\u010a": "C",
      "\u010c": "C",
      "\u0107": "c",
      "\u0109": "c",
      "\u010b": "c",
      "\u010d": "c",
      "\u010e": "D",
      "\u0110": "D",
      "\u010f": "d",
      "\u0111": "d",
      "\u0112": "E",
      "\u0114": "E",
      "\u0116": "E",
      "\u0118": "E",
      "\u011a": "E",
      "\u0113": "e",
      "\u0115": "e",
      "\u0117": "e",
      "\u0119": "e",
      "\u011b": "e",
      "\u011c": "G",
      "\u011e": "G",
      "\u0120": "G",
      "\u0122": "G",
      "\u011d": "g",
      "\u011f": "g",
      "\u0121": "g",
      "\u0123": "g",
      "\u0124": "H",
      "\u0126": "H",
      "\u0125": "h",
      "\u0127": "h",
      "\u0128": "I",
      "\u012a": "I",
      "\u012c": "I",
      "\u012e": "I",
      "\u0130": "I",
      "\u0129": "i",
      "\u012b": "i",
      "\u012d": "i",
      "\u012f": "i",
      "\u0131": "i",
      "\u0134": "J",
      "\u0135": "j",
      "\u0136": "K",
      "\u0137": "k",
      "\u0138": "k",
      "\u0139": "L",
      "\u013b": "L",
      "\u013d": "L",
      "\u013f": "L",
      "\u0141": "L",
      "\u013a": "l",
      "\u013c": "l",
      "\u013e": "l",
      "\u0140": "l",
      "\u0142": "l",
      "\u0143": "N",
      "\u0145": "N",
      "\u0147": "N",
      "\u014a": "N",
      "\u0144": "n",
      "\u0146": "n",
      "\u0148": "n",
      "\u014b": "n",
      "\u014c": "O",
      "\u014e": "O",
      "\u0150": "O",
      "\u014d": "o",
      "\u014f": "o",
      "\u0151": "o",
      "\u0154": "R",
      "\u0156": "R",
      "\u0158": "R",
      "\u0155": "r",
      "\u0157": "r",
      "\u0159": "r",
      "\u015a": "S",
      "\u015c": "S",
      "\u015e": "S",
      "\u0160": "S",
      "\u015b": "s",
      "\u015d": "s",
      "\u015f": "s",
      "\u0161": "s",
      "\u0162": "T",
      "\u0164": "T",
      "\u0166": "T",
      "\u0163": "t",
      "\u0165": "t",
      "\u0167": "t",
      "\u0168": "U",
      "\u016a": "U",
      "\u016c": "U",
      "\u016e": "U",
      "\u0170": "U",
      "\u0172": "U",
      "\u0169": "u",
      "\u016b": "u",
      "\u016d": "u",
      "\u016f": "u",
      "\u0171": "u",
      "\u0173": "u",
      "\u0174": "W",
      "\u0175": "w",
      "\u0176": "Y",
      "\u0177": "y",
      "\u0178": "Y",
      "\u0179": "Z",
      "\u017b": "Z",
      "\u017d": "Z",
      "\u017a": "z",
      "\u017c": "z",
      "\u017e": "z",
      "\u0132": "IJ",
      "\u0133": "ij",
      "\u0152": "Oe",
      "\u0153": "oe",
      "\u0149": "'n",
      "\u017f": "s"
    },
        m = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
        g = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\u1ab0-\\u1aff\\u1dc0-\\u1dff]", "g");

    function b(e) {
      return f[e];
    }

    function w(e) {
      return (e = e.toString()) && e.replace(m, b).replace(g, "");
    }

    var x,
        I,
        k,
        y,
        S,
        O = (x = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    }, I = function (e) {
      return x[e];
    }, k = "(?:" + Object.keys(x).join("|") + ")", y = RegExp(k), S = RegExp(k, "g"), function (e) {
      return e = null == e ? "" : "" + e, y.test(e) ? e.replace(S, I) : e;
    }),
        T = {
      32: " ",
      48: "0",
      49: "1",
      50: "2",
      51: "3",
      52: "4",
      53: "5",
      54: "6",
      55: "7",
      56: "8",
      57: "9",
      59: ";",
      65: "A",
      66: "B",
      67: "C",
      68: "D",
      69: "E",
      70: "F",
      71: "G",
      72: "H",
      73: "I",
      74: "J",
      75: "K",
      76: "L",
      77: "M",
      78: "N",
      79: "O",
      80: "P",
      81: "Q",
      82: "R",
      83: "S",
      84: "T",
      85: "U",
      86: "V",
      87: "W",
      88: "X",
      89: "Y",
      90: "Z",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9"
    },
        A = 27,
        N = 13,
        D = 32,
        H = 9,
        P = 38,
        W = 40,
        M = {
      success: !1,
      major: "3"
    };

    try {
      M.full = (z.fn.dropdown.Constructor.VERSION || "").split(" ")[0].split("."), M.major = M.full[0], M.success = !0;
    } catch (e) {}

    var R = 0,
        U = ".bs.select",
        j = {
      DISABLED: "disabled",
      DIVIDER: "divider",
      SHOW: "open",
      DROPUP: "dropup",
      MENU: "dropdown-menu",
      MENURIGHT: "dropdown-menu-right",
      MENULEFT: "dropdown-menu-left",
      BUTTONCLASS: "btn-default",
      POPOVERHEADER: "popover-title",
      ICONBASE: "glyphicon",
      TICKICON: "glyphicon-ok"
    },
        V = {
      MENU: "." + j.MENU
    },
        F = {
      span: document.createElement("span"),
      i: document.createElement("i"),
      subtext: document.createElement("small"),
      a: document.createElement("a"),
      li: document.createElement("li"),
      whitespace: document.createTextNode("\xa0"),
      fragment: document.createDocumentFragment()
    };
    F.a.setAttribute("role", "option"), F.subtext.className = "text-muted", F.text = F.span.cloneNode(!1), F.text.className = "text", F.checkMark = F.span.cloneNode(!1);

    var _ = new RegExp(P + "|" + W),
        q = new RegExp("^" + H + "$|" + A),
        G = function (e, t, i) {
      var s = F.li.cloneNode(!1);
      return e && (1 === e.nodeType || 11 === e.nodeType ? s.appendChild(e) : s.innerHTML = e), void 0 !== t && "" !== t && (s.className = t), null != i && s.classList.add("optgroup-" + i), s;
    },
        K = function (e, t, i) {
      var s = F.a.cloneNode(!0);
      return e && (11 === e.nodeType ? s.appendChild(e) : s.insertAdjacentHTML("beforeend", e)), void 0 !== t && "" !== t && (s.className = t), "4" === M.major && s.classList.add("dropdown-item"), i && s.setAttribute("style", i), s;
    },
        Y = function (e, t) {
      var i,
          s,
          n = F.text.cloneNode(!1);
      if (e.content) n.innerHTML = e.content;else {
        if (n.textContent = e.text, e.icon) {
          var o = F.whitespace.cloneNode(!1);
          (s = (!0 === t ? F.i : F.span).cloneNode(!1)).className = e.iconBase + " " + e.icon, F.fragment.appendChild(s), F.fragment.appendChild(o);
        }

        e.subtext && ((i = F.subtext.cloneNode(!1)).textContent = e.subtext, n.appendChild(i));
      }
      if (!0 === t) for (; 0 < n.childNodes.length;) F.fragment.appendChild(n.childNodes[0]);else F.fragment.appendChild(n);
      return F.fragment;
    },
        Z = function (e) {
      var t,
          i,
          s = F.text.cloneNode(!1);

      if (s.innerHTML = e.label, e.icon) {
        var n = F.whitespace.cloneNode(!1);
        (i = F.span.cloneNode(!1)).className = e.iconBase + " " + e.icon, F.fragment.appendChild(i), F.fragment.appendChild(n);
      }

      return e.subtext && ((t = F.subtext.cloneNode(!1)).textContent = e.subtext, s.appendChild(t)), F.fragment.appendChild(s), F.fragment;
    },
        J = function (e, t) {
      var i = this;
      p.useDefault || (z.valHooks.select.set = p._set, p.useDefault = !0), this.$element = z(e), this.$newElement = null, this.$button = null, this.$menu = null, this.options = t, this.selectpicker = {
        main: {},
        current: {},
        search: {},
        view: {},
        keydown: {
          keyHistory: "",
          resetKeyHistory: {
            start: function () {
              return setTimeout(function () {
                i.selectpicker.keydown.keyHistory = "";
              }, 800);
            }
          }
        }
      }, null === this.options.title && (this.options.title = this.$element.attr("title"));
      var s = this.options.windowPadding;
      "number" == typeof s && (this.options.windowPadding = [s, s, s, s]), this.val = J.prototype.val, this.render = J.prototype.render, this.refresh = J.prototype.refresh, this.setStyle = J.prototype.setStyle, this.selectAll = J.prototype.selectAll, this.deselectAll = J.prototype.deselectAll, this.destroy = J.prototype.destroy, this.remove = J.prototype.remove, this.show = J.prototype.show, this.hide = J.prototype.hide, this.init();
    };

    function Q(e) {
      var r,
          a = arguments,
          c = e;

      if ([].shift.apply(a), !M.success) {
        try {
          M.full = (z.fn.dropdown.Constructor.VERSION || "").split(" ")[0].split(".");
        } catch (e) {
          J.BootstrapVersion ? M.full = J.BootstrapVersion.split(" ")[0].split(".") : (M.full = [M.major, "0", "0"], console.warn("There was an issue retrieving Bootstrap's version. Ensure Bootstrap is being loaded before bootstrap-select and there is no namespace collision. If loading Bootstrap asynchronously, the version may need to be manually specified via $.fn.selectpicker.Constructor.BootstrapVersion.", e));
        }

        M.major = M.full[0], M.success = !0;
      }

      if ("4" === M.major) {
        var t = [];
        J.DEFAULTS.style === j.BUTTONCLASS && t.push({
          name: "style",
          className: "BUTTONCLASS"
        }), J.DEFAULTS.iconBase === j.ICONBASE && t.push({
          name: "iconBase",
          className: "ICONBASE"
        }), J.DEFAULTS.tickIcon === j.TICKICON && t.push({
          name: "tickIcon",
          className: "TICKICON"
        }), j.DIVIDER = "dropdown-divider", j.SHOW = "show", j.BUTTONCLASS = "btn-light", j.POPOVERHEADER = "popover-header", j.ICONBASE = "", j.TICKICON = "bs-ok-default";

        for (var i = 0; i < t.length; i++) {
          e = t[i];
          J.DEFAULTS[e.name] = j[e.className];
        }
      }

      var s = this.each(function () {
        var e = z(this);

        if (e.is("select")) {
          var t = e.data("selectpicker"),
              i = "object" == typeof c && c;

          if (t) {
            if (i) for (var s in i) i.hasOwnProperty(s) && (t.options[s] = i[s]);
          } else {
            var n = e.data();

            for (var o in n) n.hasOwnProperty(o) && -1 !== z.inArray(o, d) && delete n[o];

            var l = z.extend({}, J.DEFAULTS, z.fn.selectpicker.defaults || {}, n, i);
            l.template = z.extend({}, J.DEFAULTS.template, z.fn.selectpicker.defaults ? z.fn.selectpicker.defaults.template : {}, n.template, i.template), e.data("selectpicker", t = new J(this, l));
          }

          "string" == typeof c && (r = t[c] instanceof Function ? t[c].apply(t, a) : t.options[c]);
        }
      });
      return void 0 !== r ? r : s;
    }

    J.VERSION = "1.13.9", J.DEFAULTS = {
      noneSelectedText: "Nothing selected",
      noneResultsText: "No results matched {0}",
      countSelectedText: function (e, t) {
        return 1 == e ? "{0} item selected" : "{0} items selected";
      },
      maxOptionsText: function (e, t) {
        return [1 == e ? "Limit reached ({n} item max)" : "Limit reached ({n} items max)", 1 == t ? "Group limit reached ({n} item max)" : "Group limit reached ({n} items max)"];
      },
      selectAllText: "Select All",
      deselectAllText: "Deselect All",
      doneButton: !1,
      doneButtonText: "Close",
      multipleSeparator: ", ",
      styleBase: "btn",
      style: j.BUTTONCLASS,
      size: "auto",
      title: null,
      selectedTextFormat: "values",
      width: !1,
      container: !1,
      hideDisabled: !1,
      showSubtext: !1,
      showIcon: !0,
      showContent: !0,
      dropupAuto: !0,
      header: !1,
      liveSearch: !1,
      liveSearchPlaceholder: null,
      liveSearchNormalize: !1,
      liveSearchStyle: "contains",
      actionsBox: !1,
      iconBase: j.ICONBASE,
      tickIcon: j.TICKICON,
      showTick: !1,
      template: {
        caret: '<span class="caret"></span>'
      },
      maxOptions: !1,
      mobile: !1,
      selectOnTab: !1,
      dropdownAlignRight: !1,
      windowPadding: 0,
      virtualScroll: 600,
      display: !1,
      sanitize: !0,
      sanitizeFn: null,
      whiteList: e
    }, J.prototype = {
      constructor: J,
      init: function () {
        var i = this,
            e = this.$element.attr("id");
        this.selectId = R++, this.$element[0].classList.add("bs-select-hidden"), this.multiple = this.$element.prop("multiple"), this.autofocus = this.$element.prop("autofocus"), this.options.showTick = this.$element[0].classList.contains("show-tick"), this.$newElement = this.createDropdown(), this.$element.after(this.$newElement).prependTo(this.$newElement), this.$button = this.$newElement.children("button"), this.$menu = this.$newElement.children(V.MENU), this.$menuInner = this.$menu.children(".inner"), this.$searchbox = this.$menu.find("input"), this.$element[0].classList.remove("bs-select-hidden"), !0 === this.options.dropdownAlignRight && this.$menu[0].classList.add(j.MENURIGHT), void 0 !== e && this.$button.attr("data-id", e), this.checkDisabled(), this.clickListener(), this.options.liveSearch && this.liveSearchListener(), this.setStyle(), this.render(), this.setWidth(), this.options.container ? this.selectPosition() : this.$element.on("hide" + U, function () {
          if (i.isVirtual()) {
            var e = i.$menuInner[0],
                t = e.firstChild.cloneNode(!1);
            e.replaceChild(t, e.firstChild), e.scrollTop = 0;
          }
        }), this.$menu.data("this", this), this.$newElement.data("this", this), this.options.mobile && this.mobile(), this.$newElement.on({
          "hide.bs.dropdown": function (e) {
            i.$menuInner.attr("aria-expanded", !1), i.$element.trigger("hide" + U, e);
          },
          "hidden.bs.dropdown": function (e) {
            i.$element.trigger("hidden" + U, e);
          },
          "show.bs.dropdown": function (e) {
            i.$menuInner.attr("aria-expanded", !0), i.$element.trigger("show" + U, e);
          },
          "shown.bs.dropdown": function (e) {
            i.$element.trigger("shown" + U, e);
          }
        }), i.$element[0].hasAttribute("required") && this.$element.on("invalid" + U, function () {
          i.$button[0].classList.add("bs-invalid"), i.$element.on("shown" + U + ".invalid", function () {
            i.$element.val(i.$element.val()).off("shown" + U + ".invalid");
          }).on("rendered" + U, function () {
            this.validity.valid && i.$button[0].classList.remove("bs-invalid"), i.$element.off("rendered" + U);
          }), i.$button.on("blur" + U, function () {
            i.$element.trigger("focus").trigger("blur"), i.$button.off("blur" + U);
          });
        }), setTimeout(function () {
          i.createLi(), i.$element.trigger("loaded" + U);
        });
      },
      createDropdown: function () {
        var e = this.multiple || this.options.showTick ? " show-tick" : "",
            t = "",
            i = this.autofocus ? " autofocus" : "";
        M.major < 4 && this.$element.parent().hasClass("input-group") && (t = " input-group-btn");
        var s,
            n = "",
            o = "",
            l = "",
            r = "";
        return this.options.header && (n = '<div class="' + j.POPOVERHEADER + '"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + "</div>"), this.options.liveSearch && (o = '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? "" : ' placeholder="' + O(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search"></div>'), this.multiple && this.options.actionsBox && (l = '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn ' + j.BUTTONCLASS + '">' + this.options.selectAllText + '</button><button type="button" class="actions-btn bs-deselect-all btn ' + j.BUTTONCLASS + '">' + this.options.deselectAllText + "</button></div></div>"), this.multiple && this.options.doneButton && (r = '<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm ' + j.BUTTONCLASS + '">' + this.options.doneButtonText + "</button></div></div>"), s = '<div class="dropdown bootstrap-select' + e + t + '"><button type="button" class="' + this.options.styleBase + ' dropdown-toggle" ' + ("static" === this.options.display ? 'data-display="static"' : "") + 'data-toggle="dropdown"' + i + ' role="button"><div class="filter-option"><div class="filter-option-inner"><div class="filter-option-inner-inner"></div></div> </div>' + ("4" === M.major ? "" : '<span class="bs-caret">' + this.options.template.caret + "</span>") + '</button><div class="' + j.MENU + " " + ("4" === M.major ? "" : j.SHOW) + '" role="combobox">' + n + o + l + '<div class="inner ' + j.SHOW + '" role="listbox" aria-expanded="false" tabindex="-1"><ul class="' + j.MENU + " inner " + ("4" === M.major ? j.SHOW : "") + '"></ul></div>' + r + "</div></div>", z(s);
      },
      setPositionData: function () {
        this.selectpicker.view.canHighlight = [];

        for (var e = 0; e < this.selectpicker.current.data.length; e++) {
          var t = this.selectpicker.current.data[e],
              i = !0;
          "divider" === t.type ? (i = !1, t.height = this.sizeInfo.dividerHeight) : "optgroup-label" === t.type ? (i = !1, t.height = this.sizeInfo.dropdownHeaderHeight) : t.height = this.sizeInfo.liHeight, t.disabled && (i = !1), this.selectpicker.view.canHighlight.push(i), t.position = (0 === e ? 0 : this.selectpicker.current.data[e - 1].position) + t.height;
        }
      },
      isVirtual: function () {
        return !1 !== this.options.virtualScroll && this.selectpicker.main.elements.length >= this.options.virtualScroll || !0 === this.options.virtualScroll;
      },
      createView: function (T, e) {
        e = e || 0;
        var A = this;
        this.selectpicker.current = T ? this.selectpicker.search : this.selectpicker.main;
        var N,
            D,
            H = [];

        function i(e, t) {
          var i,
              s,
              n,
              o,
              l,
              r,
              a,
              c,
              d,
              h,
              p = A.selectpicker.current.elements.length,
              u = [],
              f = !0,
              m = A.isVirtual();
          A.selectpicker.view.scrollTop = e, !0 === m && A.sizeInfo.hasScrollBar && A.$menu[0].offsetWidth > A.sizeInfo.totalMenuWidth && (A.sizeInfo.menuWidth = A.$menu[0].offsetWidth, A.sizeInfo.totalMenuWidth = A.sizeInfo.menuWidth + A.sizeInfo.scrollBarWidth, A.$menu.css("min-width", A.sizeInfo.menuWidth)), i = Math.ceil(A.sizeInfo.menuInnerHeight / A.sizeInfo.liHeight * 1.5), s = Math.round(p / i) || 1;

          for (var v = 0; v < s; v++) {
            var g = (v + 1) * i;
            if (v === s - 1 && (g = p), u[v] = [v * i + (v ? 1 : 0), g], !p) break;
            void 0 === l && e <= A.selectpicker.current.data[g - 1].position - A.sizeInfo.menuInnerHeight && (l = v);
          }

          if (void 0 === l && (l = 0), r = [A.selectpicker.view.position0, A.selectpicker.view.position1], n = Math.max(0, l - 1), o = Math.min(s - 1, l + 1), A.selectpicker.view.position0 = !1 === m ? 0 : Math.max(0, u[n][0]) || 0, A.selectpicker.view.position1 = !1 === m ? p : Math.min(p, u[o][1]) || 0, a = r[0] !== A.selectpicker.view.position0 || r[1] !== A.selectpicker.view.position1, void 0 !== A.activeIndex && (D = A.selectpicker.main.elements[A.prevActiveIndex], H = A.selectpicker.main.elements[A.activeIndex], N = A.selectpicker.main.elements[A.selectedIndex], t && (A.activeIndex !== A.selectedIndex && H && H.length && (H.classList.remove("active"), H.firstChild && H.firstChild.classList.remove("active")), A.activeIndex = void 0), A.activeIndex && A.activeIndex !== A.selectedIndex && N && N.length && (N.classList.remove("active"), N.firstChild && N.firstChild.classList.remove("active"))), void 0 !== A.prevActiveIndex && A.prevActiveIndex !== A.activeIndex && A.prevActiveIndex !== A.selectedIndex && D && D.length && (D.classList.remove("active"), D.firstChild && D.firstChild.classList.remove("active")), (t || a) && (c = A.selectpicker.view.visibleElements ? A.selectpicker.view.visibleElements.slice() : [], A.selectpicker.view.visibleElements = !1 === m ? A.selectpicker.current.elements : A.selectpicker.current.elements.slice(A.selectpicker.view.position0, A.selectpicker.view.position1), A.setOptionStatus(), (T || !1 === m && t) && (d = c, h = A.selectpicker.view.visibleElements, f = !(d.length === h.length && d.every(function (e, t) {
            return e === h[t];
          }))), (t || !0 === m) && f)) {
            var b,
                w,
                x = A.$menuInner[0],
                I = document.createDocumentFragment(),
                k = x.firstChild.cloneNode(!1),
                $ = A.selectpicker.view.visibleElements,
                y = [];
            x.replaceChild(k, x.firstChild);
            v = 0;

            for (var S = $.length; v < S; v++) {
              var E,
                  C,
                  O = $[v];
              A.options.sanitize && (E = O.lastChild) && (C = A.selectpicker.current.data[v + A.selectpicker.view.position0]) && C.content && !C.sanitized && (y.push(E), C.sanitized = !0), I.appendChild(O);
            }

            A.options.sanitize && y.length && B(y, A.options.whiteList, A.options.sanitizeFn), !0 === m && (b = 0 === A.selectpicker.view.position0 ? 0 : A.selectpicker.current.data[A.selectpicker.view.position0 - 1].position, w = A.selectpicker.view.position1 > p - 1 ? 0 : A.selectpicker.current.data[p - 1].position - A.selectpicker.current.data[A.selectpicker.view.position1 - 1].position, x.firstChild.style.marginTop = b + "px", x.firstChild.style.marginBottom = w + "px"), x.firstChild.appendChild(I);
          }

          if (A.prevActiveIndex = A.activeIndex, A.options.liveSearch) {
            if (T && t) {
              var z,
                  L = 0;
              A.selectpicker.view.canHighlight[L] || (L = 1 + A.selectpicker.view.canHighlight.slice(1).indexOf(!0)), z = A.selectpicker.view.visibleElements[L], A.selectpicker.view.currentActive && (A.selectpicker.view.currentActive.classList.remove("active"), A.selectpicker.view.currentActive.firstChild && A.selectpicker.view.currentActive.firstChild.classList.remove("active")), z && (z.classList.add("active"), z.firstChild && z.firstChild.classList.add("active")), A.activeIndex = (A.selectpicker.current.data[L] || {}).index;
            }
          } else A.$menuInner.trigger("focus");
        }

        this.setPositionData(), i(e, !0), this.$menuInner.off("scroll.createView").on("scroll.createView", function (e, t) {
          A.noScroll || i(this.scrollTop, t), A.noScroll = !1;
        }), z(window).off("resize" + U + "." + this.selectId + ".createView").on("resize" + U + "." + this.selectId + ".createView", function () {
          A.$newElement.hasClass(j.SHOW) && i(A.$menuInner[0].scrollTop);
        });
      },
      setPlaceholder: function () {
        var e = !1;

        if (this.options.title && !this.multiple) {
          this.selectpicker.view.titleOption || (this.selectpicker.view.titleOption = document.createElement("option")), e = !0;
          var t = this.$element[0],
              i = !1,
              s = !this.selectpicker.view.titleOption.parentNode;
          if (s) this.selectpicker.view.titleOption.className = "bs-title-option", this.selectpicker.view.titleOption.value = "", i = void 0 === z(t.options[t.selectedIndex]).attr("selected") && void 0 === this.$element.data("selected");
          (s || 0 !== this.selectpicker.view.titleOption.index) && t.insertBefore(this.selectpicker.view.titleOption, t.firstChild), i && (t.selectedIndex = 0);
        }

        return e;
      },
      createLi: function () {
        var a = this,
            f = this.options.iconBase,
            m = ':not([hidden]):not([data-hidden="true"])',
            v = [],
            g = [],
            c = 0,
            b = 0,
            e = this.setPlaceholder() ? 1 : 0;
        this.options.hideDisabled && (m += ":not(:disabled)"), !a.options.showTick && !a.multiple || F.checkMark.parentNode || (F.checkMark.className = f + " " + a.options.tickIcon + " check-mark", F.a.appendChild(F.checkMark));
        var t = this.$element[0].querySelectorAll("select > *" + m);

        function w(e) {
          var t = g[g.length - 1];
          t && "divider" === t.type && (t.optID || e.optID) || ((e = e || {}).type = "divider", v.push(G(!1, j.DIVIDER, e.optID ? e.optID + "div" : void 0)), g.push(e));
        }

        function x(e, t) {
          if ((t = t || {}).divider = "true" === e.getAttribute("data-divider"), t.divider) w({
            optID: t.optID
          });else {
            var i = g.length,
                s = e.style.cssText,
                n = s ? O(s) : "",
                o = (e.className || "") + (t.optgroupClass || "");
            t.optID && (o = "opt " + o), t.text = e.textContent, t.content = e.getAttribute("data-content"), t.tokens = e.getAttribute("data-tokens"), t.subtext = e.getAttribute("data-subtext"), t.icon = e.getAttribute("data-icon"), t.iconBase = f;
            var l = Y(t);
            v.push(G(K(l, o, n), "", t.optID)), e.liIndex = i, t.display = t.content || t.text, t.type = "option", t.index = i, t.option = e, t.disabled = t.disabled || e.disabled, g.push(t);
            var r = 0;
            t.display && (r += t.display.length), t.subtext && (r += t.subtext.length), t.icon && (r += 1), c < r && (c = r, a.selectpicker.view.widestOption = v[v.length - 1]);
          }
        }

        function i(e, t) {
          var i = t[e],
              s = t[e - 1],
              n = t[e + 1],
              o = i.querySelectorAll("option" + m);

          if (o.length) {
            var l,
                r,
                a = {
              label: O(i.label),
              subtext: i.getAttribute("data-subtext"),
              icon: i.getAttribute("data-icon"),
              iconBase: f
            },
                c = " " + (i.className || "");
            b++, s && w({
              optID: b
            });
            var d = Z(a);
            v.push(G(d, "dropdown-header" + c, b)), g.push({
              display: a.label,
              subtext: a.subtext,
              type: "optgroup-label",
              optID: b
            });

            for (var h = 0, p = o.length; h < p; h++) {
              var u = o[h];
              0 === h && (r = (l = g.length - 1) + p), x(u, {
                headerIndex: l,
                lastIndex: r,
                optID: b,
                optgroupClass: c,
                disabled: i.disabled
              });
            }

            n && w({
              optID: b
            });
          }
        }

        for (var s = t.length; e < s; e++) {
          var n = t[e];
          "OPTGROUP" !== n.tagName ? x(n, {}) : i(e, t);
        }

        this.selectpicker.main.elements = v, this.selectpicker.main.data = g, this.selectpicker.current = this.selectpicker.main;
      },
      findLis: function () {
        return this.$menuInner.find(".inner > li");
      },
      render: function () {
        this.setPlaceholder();
        var e,
            t,
            i = this,
            s = this.$element[0].selectedOptions,
            n = s.length,
            o = this.$button[0],
            l = o.querySelector(".filter-option-inner-inner"),
            r = document.createTextNode(this.options.multipleSeparator),
            a = F.fragment.cloneNode(!1),
            c = !1;
        if (this.togglePlaceholder(), this.tabIndex(), "static" === this.options.selectedTextFormat) a = Y({
          text: this.options.title
        }, !0);else if ((e = this.multiple && -1 !== this.options.selectedTextFormat.indexOf("count") && 1 < n) && (e = 1 < (t = this.options.selectedTextFormat.split(">")).length && n > t[1] || 1 === t.length && 2 <= n), !1 === e) {
          for (var d = 0; d < n && d < 50; d++) {
            var h = s[d],
                p = {},
                u = {
              content: h.getAttribute("data-content"),
              subtext: h.getAttribute("data-subtext"),
              icon: h.getAttribute("data-icon")
            };
            this.multiple && 0 < d && a.appendChild(r.cloneNode(!1)), h.title ? p.text = h.title : u.content && i.options.showContent ? (p.content = u.content.toString(), c = !0) : (i.options.showIcon && (p.icon = u.icon, p.iconBase = this.options.iconBase), i.options.showSubtext && !i.multiple && u.subtext && (p.subtext = " " + u.subtext), p.text = h.textContent.trim()), a.appendChild(Y(p, !0));
          }

          49 < n && a.appendChild(document.createTextNode("..."));
        } else {
          var f = ':not([hidden]):not([data-hidden="true"]):not([data-divider="true"])';
          this.options.hideDisabled && (f += ":not(:disabled)");
          var m = this.$element[0].querySelectorAll("select > option" + f + ", optgroup" + f + " option" + f).length,
              v = "function" == typeof this.options.countSelectedText ? this.options.countSelectedText(n, m) : this.options.countSelectedText;
          a = Y({
            text: v.replace("{0}", n.toString()).replace("{1}", m.toString())
          }, !0);
        }

        if (null == this.options.title && (this.options.title = this.$element.attr("title")), a.childNodes.length || (a = Y({
          text: void 0 !== this.options.title ? this.options.title : this.options.noneSelectedText
        }, !0)), o.title = a.textContent.replace(/<[^>]*>?/g, "").trim(), this.options.sanitize && c && B([a], i.options.whiteList, i.options.sanitizeFn), l.innerHTML = "", l.appendChild(a), M.major < 4 && this.$newElement[0].classList.contains("bs3-has-addon")) {
          var g = o.querySelector(".filter-expand"),
              b = l.cloneNode(!0);
          b.className = "filter-expand", g ? o.replaceChild(b, g) : o.appendChild(b);
        }

        this.$element.trigger("rendered" + U);
      },
      setStyle: function (e, t) {
        var i,
            s = this.$button[0],
            n = this.$newElement[0],
            o = this.options.style.trim();
        this.$element.attr("class") && this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, "")), M.major < 4 && (n.classList.add("bs3"), n.parentNode.classList.contains("input-group") && (n.previousElementSibling || n.nextElementSibling) && (n.previousElementSibling || n.nextElementSibling).classList.contains("input-group-addon") && n.classList.add("bs3-has-addon")), i = e ? e.trim() : o, "add" == t ? i && s.classList.add.apply(s.classList, i.split(" ")) : "remove" == t ? i && s.classList.remove.apply(s.classList, i.split(" ")) : (o && s.classList.remove.apply(s.classList, o.split(" ")), i && s.classList.add.apply(s.classList, i.split(" ")));
      },
      liHeight: function (e) {
        if (e || !1 !== this.options.size && !this.sizeInfo) {
          this.sizeInfo || (this.sizeInfo = {});
          var t = document.createElement("div"),
              i = document.createElement("div"),
              s = document.createElement("div"),
              n = document.createElement("ul"),
              o = document.createElement("li"),
              l = document.createElement("li"),
              r = document.createElement("li"),
              a = document.createElement("a"),
              c = document.createElement("span"),
              d = this.options.header && 0 < this.$menu.find("." + j.POPOVERHEADER).length ? this.$menu.find("." + j.POPOVERHEADER)[0].cloneNode(!0) : null,
              h = this.options.liveSearch ? document.createElement("div") : null,
              p = this.options.actionsBox && this.multiple && 0 < this.$menu.find(".bs-actionsbox").length ? this.$menu.find(".bs-actionsbox")[0].cloneNode(!0) : null,
              u = this.options.doneButton && this.multiple && 0 < this.$menu.find(".bs-donebutton").length ? this.$menu.find(".bs-donebutton")[0].cloneNode(!0) : null,
              f = this.$element.find("option")[0];

          if (this.sizeInfo.selectWidth = this.$newElement[0].offsetWidth, c.className = "text", a.className = "dropdown-item " + (f ? f.className : ""), t.className = this.$menu[0].parentNode.className + " " + j.SHOW, t.style.width = this.sizeInfo.selectWidth + "px", "auto" === this.options.width && (i.style.minWidth = 0), i.className = j.MENU + " " + j.SHOW, s.className = "inner " + j.SHOW, n.className = j.MENU + " inner " + ("4" === M.major ? j.SHOW : ""), o.className = j.DIVIDER, l.className = "dropdown-header", c.appendChild(document.createTextNode("\u200b")), a.appendChild(c), r.appendChild(a), l.appendChild(c.cloneNode(!0)), this.selectpicker.view.widestOption && n.appendChild(this.selectpicker.view.widestOption.cloneNode(!0)), n.appendChild(r), n.appendChild(o), n.appendChild(l), d && i.appendChild(d), h) {
            var m = document.createElement("input");
            h.className = "bs-searchbox", m.className = "form-control", h.appendChild(m), i.appendChild(h);
          }

          p && i.appendChild(p), s.appendChild(n), i.appendChild(s), u && i.appendChild(u), t.appendChild(i), document.body.appendChild(t);
          var v,
              g = r.offsetHeight,
              b = l ? l.offsetHeight : 0,
              w = d ? d.offsetHeight : 0,
              x = h ? h.offsetHeight : 0,
              I = p ? p.offsetHeight : 0,
              k = u ? u.offsetHeight : 0,
              $ = z(o).outerHeight(!0),
              y = !!window.getComputedStyle && window.getComputedStyle(i),
              S = i.offsetWidth,
              E = y ? null : z(i),
              C = {
            vert: L(y ? y.paddingTop : E.css("paddingTop")) + L(y ? y.paddingBottom : E.css("paddingBottom")) + L(y ? y.borderTopWidth : E.css("borderTopWidth")) + L(y ? y.borderBottomWidth : E.css("borderBottomWidth")),
            horiz: L(y ? y.paddingLeft : E.css("paddingLeft")) + L(y ? y.paddingRight : E.css("paddingRight")) + L(y ? y.borderLeftWidth : E.css("borderLeftWidth")) + L(y ? y.borderRightWidth : E.css("borderRightWidth"))
          },
              O = {
            vert: C.vert + L(y ? y.marginTop : E.css("marginTop")) + L(y ? y.marginBottom : E.css("marginBottom")) + 2,
            horiz: C.horiz + L(y ? y.marginLeft : E.css("marginLeft")) + L(y ? y.marginRight : E.css("marginRight")) + 2
          };
          s.style.overflowY = "scroll", v = i.offsetWidth - S, document.body.removeChild(t), this.sizeInfo.liHeight = g, this.sizeInfo.dropdownHeaderHeight = b, this.sizeInfo.headerHeight = w, this.sizeInfo.searchHeight = x, this.sizeInfo.actionsHeight = I, this.sizeInfo.doneButtonHeight = k, this.sizeInfo.dividerHeight = $, this.sizeInfo.menuPadding = C, this.sizeInfo.menuExtras = O, this.sizeInfo.menuWidth = S, this.sizeInfo.totalMenuWidth = this.sizeInfo.menuWidth, this.sizeInfo.scrollBarWidth = v, this.sizeInfo.selectHeight = this.$newElement[0].offsetHeight, this.setPositionData();
        }
      },
      getSelectPosition: function () {
        var e,
            t = z(window),
            i = this.$newElement.offset(),
            s = z(this.options.container);
        this.options.container && s.length && !s.is("body") ? ((e = s.offset()).top += parseInt(s.css("borderTopWidth")), e.left += parseInt(s.css("borderLeftWidth"))) : e = {
          top: 0,
          left: 0
        };
        var n = this.options.windowPadding;
        this.sizeInfo.selectOffsetTop = i.top - e.top - t.scrollTop(), this.sizeInfo.selectOffsetBot = t.height() - this.sizeInfo.selectOffsetTop - this.sizeInfo.selectHeight - e.top - n[2], this.sizeInfo.selectOffsetLeft = i.left - e.left - t.scrollLeft(), this.sizeInfo.selectOffsetRight = t.width() - this.sizeInfo.selectOffsetLeft - this.sizeInfo.selectWidth - e.left - n[1], this.sizeInfo.selectOffsetTop -= n[0], this.sizeInfo.selectOffsetLeft -= n[3];
      },
      setMenuSize: function (e) {
        this.getSelectPosition();
        var t,
            i,
            s,
            n,
            o,
            l,
            r,
            a = this.sizeInfo.selectWidth,
            c = this.sizeInfo.liHeight,
            d = this.sizeInfo.headerHeight,
            h = this.sizeInfo.searchHeight,
            p = this.sizeInfo.actionsHeight,
            u = this.sizeInfo.doneButtonHeight,
            f = this.sizeInfo.dividerHeight,
            m = this.sizeInfo.menuPadding,
            v = 0;
        if (this.options.dropupAuto && (r = c * this.selectpicker.current.elements.length + m.vert, this.$newElement.toggleClass(j.DROPUP, this.sizeInfo.selectOffsetTop - this.sizeInfo.selectOffsetBot > this.sizeInfo.menuExtras.vert && r + this.sizeInfo.menuExtras.vert + 50 > this.sizeInfo.selectOffsetBot)), "auto" === this.options.size) n = 3 < this.selectpicker.current.elements.length ? 3 * this.sizeInfo.liHeight + this.sizeInfo.menuExtras.vert - 2 : 0, i = this.sizeInfo.selectOffsetBot - this.sizeInfo.menuExtras.vert, s = n + d + h + p + u, l = Math.max(n - m.vert, 0), this.$newElement.hasClass(j.DROPUP) && (i = this.sizeInfo.selectOffsetTop - this.sizeInfo.menuExtras.vert), t = (o = i) - d - h - p - u - m.vert;else if (this.options.size && "auto" != this.options.size && this.selectpicker.current.elements.length > this.options.size) {
          for (var g = 0; g < this.options.size; g++) "divider" === this.selectpicker.current.data[g].type && v++;

          t = (i = c * this.options.size + v * f + m.vert) - m.vert, o = i + d + h + p + u, s = l = "";
        }
        "auto" === this.options.dropdownAlignRight && this.$menu.toggleClass(j.MENURIGHT, this.sizeInfo.selectOffsetLeft > this.sizeInfo.selectOffsetRight && this.sizeInfo.selectOffsetRight < this.sizeInfo.totalMenuWidth - a), this.$menu.css({
          "max-height": o + "px",
          overflow: "hidden",
          "min-height": s + "px"
        }), this.$menuInner.css({
          "max-height": t + "px",
          "overflow-y": "auto",
          "min-height": l + "px"
        }), this.sizeInfo.menuInnerHeight = Math.max(t, 1), this.selectpicker.current.data.length && this.selectpicker.current.data[this.selectpicker.current.data.length - 1].position > this.sizeInfo.menuInnerHeight && (this.sizeInfo.hasScrollBar = !0, this.sizeInfo.totalMenuWidth = this.sizeInfo.menuWidth + this.sizeInfo.scrollBarWidth, this.$menu.css("min-width", this.sizeInfo.totalMenuWidth)), this.dropdown && this.dropdown._popper && this.dropdown._popper.update();
      },
      setSize: function (e) {
        if (this.liHeight(e), this.options.header && this.$menu.css("padding-top", 0), !1 !== this.options.size) {
          var t,
              i = this,
              s = z(window),
              n = 0;
          if (this.setMenuSize(), this.options.liveSearch && this.$searchbox.off("input.setMenuSize propertychange.setMenuSize").on("input.setMenuSize propertychange.setMenuSize", function () {
            return i.setMenuSize();
          }), "auto" === this.options.size ? s.off("resize" + U + "." + this.selectId + ".setMenuSize scroll" + U + "." + this.selectId + ".setMenuSize").on("resize" + U + "." + this.selectId + ".setMenuSize scroll" + U + "." + this.selectId + ".setMenuSize", function () {
            return i.setMenuSize();
          }) : this.options.size && "auto" != this.options.size && this.selectpicker.current.elements.length > this.options.size && s.off("resize" + U + "." + this.selectId + ".setMenuSize scroll" + U + "." + this.selectId + ".setMenuSize"), e) n = this.$menuInner[0].scrollTop;else if (!i.multiple) {
            var o = i.$element[0];
            "number" == typeof (t = (o.options[o.selectedIndex] || {}).liIndex) && !1 !== i.options.size && (n = (n = i.sizeInfo.liHeight * t) - i.sizeInfo.menuInnerHeight / 2 + i.sizeInfo.liHeight / 2);
          }
          i.createView(!1, n);
        }
      },
      setWidth: function () {
        var i = this;
        "auto" === this.options.width ? requestAnimationFrame(function () {
          i.$menu.css("min-width", "0"), i.$element.on("loaded" + U, function () {
            i.liHeight(), i.setMenuSize();
            var e = i.$newElement.clone().appendTo("body"),
                t = e.css("width", "auto").children("button").outerWidth();
            e.remove(), i.sizeInfo.selectWidth = Math.max(i.sizeInfo.totalMenuWidth, t), i.$newElement.css("width", i.sizeInfo.selectWidth + "px");
          });
        }) : "fit" === this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", "").addClass("fit-width")) : this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", this.options.width)) : (this.$menu.css("min-width", ""), this.$newElement.css("width", "")), this.$newElement.hasClass("fit-width") && "fit" !== this.options.width && this.$newElement[0].classList.remove("fit-width");
      },
      selectPosition: function () {
        this.$bsContainer = z('<div class="bs-container" />');

        var s,
            n,
            o,
            l = this,
            r = z(this.options.container),
            e = function (e) {
          var t = {},
              i = l.options.display || !!z.fn.dropdown.Constructor.Default && z.fn.dropdown.Constructor.Default.display;
          l.$bsContainer.addClass(e.attr("class").replace(/form-control|fit-width/gi, "")).toggleClass(j.DROPUP, e.hasClass(j.DROPUP)), s = e.offset(), r.is("body") ? n = {
            top: 0,
            left: 0
          } : ((n = r.offset()).top += parseInt(r.css("borderTopWidth")) - r.scrollTop(), n.left += parseInt(r.css("borderLeftWidth")) - r.scrollLeft()), o = e.hasClass(j.DROPUP) ? 0 : e[0].offsetHeight, (M.major < 4 || "static" === i) && (t.top = s.top - n.top + o, t.left = s.left - n.left), t.width = e[0].offsetWidth, l.$bsContainer.css(t);
        };

        this.$button.on("click.bs.dropdown.data-api", function () {
          l.isDisabled() || (e(l.$newElement), l.$bsContainer.appendTo(l.options.container).toggleClass(j.SHOW, !l.$button.hasClass(j.SHOW)).append(l.$menu));
        }), z(window).off("resize" + U + "." + this.selectId + " scroll" + U + "." + this.selectId).on("resize" + U + "." + this.selectId + " scroll" + U + "." + this.selectId, function () {
          l.$newElement.hasClass(j.SHOW) && e(l.$newElement);
        }), this.$element.on("hide" + U, function () {
          l.$menu.data("height", l.$menu.height()), l.$bsContainer.detach();
        });
      },
      setOptionStatus: function () {
        var e = this;
        if (e.noScroll = !1, e.selectpicker.view.visibleElements && e.selectpicker.view.visibleElements.length) for (var t = 0; t < e.selectpicker.view.visibleElements.length; t++) {
          var i = e.selectpicker.current.data[t + e.selectpicker.view.position0],
              s = i.option;
          s && (e.setDisabled(i.index, i.disabled), e.setSelected(i.index, s.selected));
        }
      },
      setSelected: function (e, t) {
        var i,
            s,
            n = this.selectpicker.main.elements[e],
            o = this.selectpicker.main.data[e],
            l = void 0 !== this.activeIndex,
            r = this.activeIndex === e || t && !this.multiple && !l;
        o.selected = t, s = n.firstChild, t && (this.selectedIndex = e), n.classList.toggle("selected", t), n.classList.toggle("active", r), r && (this.selectpicker.view.currentActive = n, this.activeIndex = e), s && (s.classList.toggle("selected", t), s.classList.toggle("active", r), s.setAttribute("aria-selected", t)), r || !l && t && void 0 !== this.prevActiveIndex && ((i = this.selectpicker.main.elements[this.prevActiveIndex]).classList.remove("active"), i.firstChild && i.firstChild.classList.remove("active"));
      },
      setDisabled: function (e, t) {
        var i,
            s = this.selectpicker.main.elements[e];
        this.selectpicker.main.data[e].disabled = t, i = s.firstChild, s.classList.toggle(j.DISABLED, t), i && ("4" === M.major && i.classList.toggle(j.DISABLED, t), i.setAttribute("aria-disabled", t), t ? i.setAttribute("tabindex", -1) : i.setAttribute("tabindex", 0));
      },
      isDisabled: function () {
        return this.$element[0].disabled;
      },
      checkDisabled: function () {
        var e = this;
        this.isDisabled() ? (this.$newElement[0].classList.add(j.DISABLED), this.$button.addClass(j.DISABLED).attr("tabindex", -1).attr("aria-disabled", !0)) : (this.$button[0].classList.contains(j.DISABLED) && (this.$newElement[0].classList.remove(j.DISABLED), this.$button.removeClass(j.DISABLED).attr("aria-disabled", !1)), -1 != this.$button.attr("tabindex") || this.$element.data("tabindex") || this.$button.removeAttr("tabindex")), this.$button.on("click", function () {
          return !e.isDisabled();
        });
      },
      togglePlaceholder: function () {
        var e = this.$element[0],
            t = e.selectedIndex,
            i = -1 === t;
        i || e.options[t].value || (i = !0), this.$button.toggleClass("bs-placeholder", i);
      },
      tabIndex: function () {
        this.$element.data("tabindex") !== this.$element.attr("tabindex") && -98 !== this.$element.attr("tabindex") && "-98" !== this.$element.attr("tabindex") && (this.$element.data("tabindex", this.$element.attr("tabindex")), this.$button.attr("tabindex", this.$element.data("tabindex"))), this.$element.attr("tabindex", -98);
      },
      clickListener: function () {
        var S = this,
            t = z(document);

        function e() {
          S.options.liveSearch ? S.$searchbox.trigger("focus") : S.$menuInner.trigger("focus");
        }

        function i() {
          S.dropdown && S.dropdown._popper && S.dropdown._popper.state.isCreated ? e() : requestAnimationFrame(i);
        }

        t.data("spaceSelect", !1), this.$button.on("keyup", function (e) {
          /(32)/.test(e.keyCode.toString(10)) && t.data("spaceSelect") && (e.preventDefault(), t.data("spaceSelect", !1));
        }), this.$newElement.on("show.bs.dropdown", function () {
          3 < M.major && !S.dropdown && (S.dropdown = S.$button.data("bs.dropdown"), S.dropdown._menu = S.$menu[0]);
        }), this.$button.on("click.bs.dropdown.data-api", function () {
          S.$newElement.hasClass(j.SHOW) || S.setSize();
        }), this.$element.on("shown" + U, function () {
          S.$menuInner[0].scrollTop !== S.selectpicker.view.scrollTop && (S.$menuInner[0].scrollTop = S.selectpicker.view.scrollTop), 3 < M.major ? requestAnimationFrame(i) : e();
        }), this.$menuInner.on("click", "li a", function (e, t) {
          var i = z(this),
              s = S.isVirtual() ? S.selectpicker.view.position0 : 0,
              n = S.selectpicker.current.data[i.parent().index() + s],
              o = n.index,
              l = E(S.$element[0]),
              r = S.$element.prop("selectedIndex"),
              a = !0;

          if (S.multiple && 1 !== S.options.maxOptions && e.stopPropagation(), e.preventDefault(), !S.isDisabled() && !i.parent().hasClass(j.DISABLED)) {
            var c = S.$element.find("option"),
                d = n.option,
                h = z(d),
                p = d.selected,
                u = h.parent("optgroup"),
                f = u.find("option"),
                m = S.options.maxOptions,
                v = u.data("maxOptions") || !1;

            if (o === S.activeIndex && (t = !0), t || (S.prevActiveIndex = S.activeIndex, S.activeIndex = void 0), S.multiple) {
              if (d.selected = !p, S.setSelected(o, !p), i.trigger("blur"), !1 !== m || !1 !== v) {
                var g = m < c.filter(":selected").length,
                    b = v < u.find("option:selected").length;
                if (m && g || v && b) if (m && 1 == m) {
                  c.prop("selected", !1), h.prop("selected", !0);

                  for (var w = 0; w < c.length; w++) S.setSelected(w, !1);

                  S.setSelected(o, !0);
                } else if (v && 1 == v) {
                  u.find("option:selected").prop("selected", !1), h.prop("selected", !0);

                  for (w = 0; w < f.length; w++) {
                    d = f[w];
                    S.setSelected(c.index(d), !1);
                  }

                  S.setSelected(o, !0);
                } else {
                  var x = "string" == typeof S.options.maxOptionsText ? [S.options.maxOptionsText, S.options.maxOptionsText] : S.options.maxOptionsText,
                      I = "function" == typeof x ? x(m, v) : x,
                      k = I[0].replace("{n}", m),
                      $ = I[1].replace("{n}", v),
                      y = z('<div class="notify"></div>');
                  I[2] && (k = k.replace("{var}", I[2][1 < m ? 0 : 1]), $ = $.replace("{var}", I[2][1 < v ? 0 : 1])), h.prop("selected", !1), S.$menu.append(y), m && g && (y.append(z("<div>" + k + "</div>")), a = !1, S.$element.trigger("maxReached" + U)), v && b && (y.append(z("<div>" + $ + "</div>")), a = !1, S.$element.trigger("maxReachedGrp" + U)), setTimeout(function () {
                    S.setSelected(o, !1);
                  }, 10), y.delay(750).fadeOut(300, function () {
                    z(this).remove();
                  });
                }
              }
            } else c.prop("selected", !1), d.selected = !0, S.setSelected(o, !0);

            !S.multiple || S.multiple && 1 === S.options.maxOptions ? S.$button.trigger("focus") : S.options.liveSearch && S.$searchbox.trigger("focus"), a && (l != E(S.$element[0]) && S.multiple || r != S.$element.prop("selectedIndex") && !S.multiple) && (C = [d.index, h.prop("selected"), l], S.$element.triggerNative("change"));
          }
        }), this.$menu.on("click", "li." + j.DISABLED + " a, ." + j.POPOVERHEADER + ", ." + j.POPOVERHEADER + " :not(.close)", function (e) {
          e.currentTarget == this && (e.preventDefault(), e.stopPropagation(), S.options.liveSearch && !z(e.target).hasClass("close") ? S.$searchbox.trigger("focus") : S.$button.trigger("focus"));
        }), this.$menuInner.on("click", ".divider, .dropdown-header", function (e) {
          e.preventDefault(), e.stopPropagation(), S.options.liveSearch ? S.$searchbox.trigger("focus") : S.$button.trigger("focus");
        }), this.$menu.on("click", "." + j.POPOVERHEADER + " .close", function () {
          S.$button.trigger("click");
        }), this.$searchbox.on("click", function (e) {
          e.stopPropagation();
        }), this.$menu.on("click", ".actions-btn", function (e) {
          S.options.liveSearch ? S.$searchbox.trigger("focus") : S.$button.trigger("focus"), e.preventDefault(), e.stopPropagation(), z(this).hasClass("bs-select-all") ? S.selectAll() : S.deselectAll();
        }), this.$element.on("change" + U, function () {
          S.render(), S.$element.trigger("changed" + U, C), C = null;
        }).on("focus" + U, function () {
          S.options.mobile || S.$button.trigger("focus");
        });
      },
      liveSearchListener: function () {
        var u = this,
            f = document.createElement("li");
        this.$button.on("click.bs.dropdown.data-api", function () {
          u.$searchbox.val() && u.$searchbox.val("");
        }), this.$searchbox.on("click.bs.dropdown.data-api focus.bs.dropdown.data-api touchend.bs.dropdown.data-api", function (e) {
          e.stopPropagation();
        }), this.$searchbox.on("input propertychange", function () {
          var e = u.$searchbox.val();

          if (u.selectpicker.search.elements = [], u.selectpicker.search.data = [], e) {
            var t = [],
                i = e.toUpperCase(),
                s = {},
                n = [],
                o = u._searchStyle(),
                l = u.options.liveSearchNormalize;

            l && (i = w(i)), u._$lisSelected = u.$menuInner.find(".selected");

            for (var r = 0; r < u.selectpicker.main.data.length; r++) {
              var a = u.selectpicker.main.data[r];
              s[r] || (s[r] = $(a, i, o, l)), s[r] && void 0 !== a.headerIndex && -1 === n.indexOf(a.headerIndex) && (0 < a.headerIndex && (s[a.headerIndex - 1] = !0, n.push(a.headerIndex - 1)), s[a.headerIndex] = !0, n.push(a.headerIndex), s[a.lastIndex + 1] = !0), s[r] && "optgroup-label" !== a.type && n.push(r);
            }

            r = 0;

            for (var c = n.length; r < c; r++) {
              var d = n[r],
                  h = n[r - 1],
                  p = (a = u.selectpicker.main.data[d], u.selectpicker.main.data[h]);
              ("divider" !== a.type || "divider" === a.type && p && "divider" !== p.type && c - 1 !== r) && (u.selectpicker.search.data.push(a), t.push(u.selectpicker.main.elements[d]));
            }

            u.activeIndex = void 0, u.noScroll = !0, u.$menuInner.scrollTop(0), u.selectpicker.search.elements = t, u.createView(!0), t.length || (f.className = "no-results", f.innerHTML = u.options.noneResultsText.replace("{0}", '"' + O(e) + '"'), u.$menuInner[0].firstChild.appendChild(f));
          } else u.$menuInner.scrollTop(0), u.createView(!1);
        });
      },
      _searchStyle: function () {
        return this.options.liveSearchStyle || "contains";
      },
      val: function (e) {
        if (void 0 === e) return this.$element.val();
        var t = E(this.$element[0]);
        return C = [null, null, t], this.$element.val(e).trigger("changed" + U, C), this.render(), C = null, this.$element;
      },
      changeAll: function (e) {
        if (this.multiple) {
          void 0 === e && (e = !0);
          var t = this.$element[0],
              i = 0,
              s = 0,
              n = E(t);
          t.classList.add("bs-select-hidden");

          for (var o = 0, l = this.selectpicker.current.elements.length; o < l; o++) {
            var r = this.selectpicker.current.data[o],
                a = r.option;
            a && !r.disabled && "divider" !== r.type && (r.selected && i++, (a.selected = e) && s++);
          }

          t.classList.remove("bs-select-hidden"), i !== s && (this.setOptionStatus(), this.togglePlaceholder(), C = [null, null, n], this.$element.triggerNative("change"));
        }
      },
      selectAll: function () {
        return this.changeAll(!0);
      },
      deselectAll: function () {
        return this.changeAll(!1);
      },
      toggle: function (e) {
        (e = e || window.event) && e.stopPropagation(), this.$button.trigger("click.bs.dropdown.data-api");
      },
      keydown: function (e) {
        var t,
            i,
            s,
            n,
            o,
            l = z(this),
            r = l.hasClass("dropdown-toggle"),
            a = (r ? l.closest(".dropdown") : l.closest(V.MENU)).data("this"),
            c = a.findLis(),
            d = !1,
            h = e.which === H && !r && !a.options.selectOnTab,
            p = _.test(e.which) || h,
            u = a.$menuInner[0].scrollTop,
            f = a.isVirtual(),
            m = !0 === f ? a.selectpicker.view.position0 : 0;
        if (!(i = a.$newElement.hasClass(j.SHOW)) && (p || 48 <= e.which && e.which <= 57 || 96 <= e.which && e.which <= 105 || 65 <= e.which && e.which <= 90) && (a.$button.trigger("click.bs.dropdown.data-api"), a.options.liveSearch)) a.$searchbox.trigger("focus");else {
          if (e.which === A && i && (e.preventDefault(), a.$button.trigger("click.bs.dropdown.data-api").trigger("focus")), p) {
            if (!c.length) return;
            void 0 === (t = !0 === f ? c.index(c.filter(".active")) : a.activeIndex) && (t = -1), -1 !== t && ((s = a.selectpicker.current.elements[t + m]).classList.remove("active"), s.firstChild && s.firstChild.classList.remove("active")), e.which === P ? (-1 !== t && t--, t + m < 0 && (t += c.length), a.selectpicker.view.canHighlight[t + m] || -1 === (t = a.selectpicker.view.canHighlight.slice(0, t + m).lastIndexOf(!0) - m) && (t = c.length - 1)) : (e.which === W || h) && (++t + m >= a.selectpicker.view.canHighlight.length && (t = 0), a.selectpicker.view.canHighlight[t + m] || (t = t + 1 + a.selectpicker.view.canHighlight.slice(t + m + 1).indexOf(!0))), e.preventDefault();
            var v = m + t;
            e.which === P ? 0 === m && t === c.length - 1 ? (a.$menuInner[0].scrollTop = a.$menuInner[0].scrollHeight, v = a.selectpicker.current.elements.length - 1) : d = (o = (n = a.selectpicker.current.data[v]).position - n.height) < u : (e.which === W || h) && (0 === t ? v = a.$menuInner[0].scrollTop = 0 : d = u < (o = (n = a.selectpicker.current.data[v]).position - a.sizeInfo.menuInnerHeight)), (s = a.selectpicker.current.elements[v]) && (s.classList.add("active"), s.firstChild && s.firstChild.classList.add("active")), a.activeIndex = a.selectpicker.current.data[v].index, a.selectpicker.view.currentActive = s, d && (a.$menuInner[0].scrollTop = o), a.options.liveSearch ? a.$searchbox.trigger("focus") : l.trigger("focus");
          } else if (!l.is("input") && !q.test(e.which) || e.which === D && a.selectpicker.keydown.keyHistory) {
            var g,
                b,
                w = [];
            e.preventDefault(), a.selectpicker.keydown.keyHistory += T[e.which], a.selectpicker.keydown.resetKeyHistory.cancel && clearTimeout(a.selectpicker.keydown.resetKeyHistory.cancel), a.selectpicker.keydown.resetKeyHistory.cancel = a.selectpicker.keydown.resetKeyHistory.start(), b = a.selectpicker.keydown.keyHistory, /^(.)\1+$/.test(b) && (b = b.charAt(0));

            for (var x = 0; x < a.selectpicker.current.data.length; x++) {
              var I = a.selectpicker.current.data[x];
              $(I, b, "startsWith", !0) && a.selectpicker.view.canHighlight[x] && w.push(I.index);
            }

            if (w.length) {
              var k = 0;
              c.removeClass("active").find("a").removeClass("active"), 1 === b.length && (-1 === (k = w.indexOf(a.activeIndex)) || k === w.length - 1 ? k = 0 : k++), g = w[k], d = 0 < u - (n = a.selectpicker.main.data[g]).position ? (o = n.position - n.height, !0) : (o = n.position - a.sizeInfo.menuInnerHeight, n.position > u + a.sizeInfo.menuInnerHeight), (s = a.selectpicker.main.elements[g]).classList.add("active"), s.firstChild && s.firstChild.classList.add("active"), a.activeIndex = w[k], s.firstChild.focus(), d && (a.$menuInner[0].scrollTop = o), l.trigger("focus");
            }
          }

          i && (e.which === D && !a.selectpicker.keydown.keyHistory || e.which === N || e.which === H && a.options.selectOnTab) && (e.which !== D && e.preventDefault(), a.options.liveSearch && e.which === D || (a.$menuInner.find(".active a").trigger("click", !0), l.trigger("focus"), a.options.liveSearch || (e.preventDefault(), z(document).data("spaceSelect", !0))));
        }
      },
      mobile: function () {
        this.$element[0].classList.add("mobile-device");
      },
      refresh: function () {
        var e = z.extend({}, this.options, this.$element.data());
        this.options = e, this.checkDisabled(), this.setStyle(), this.render(), this.createLi(), this.setWidth(), this.setSize(!0), this.$element.trigger("refreshed" + U);
      },
      hide: function () {
        this.$newElement.hide();
      },
      show: function () {
        this.$newElement.show();
      },
      remove: function () {
        this.$newElement.remove(), this.$element.remove();
      },
      destroy: function () {
        this.$newElement.before(this.$element).remove(), this.$bsContainer ? this.$bsContainer.remove() : this.$menu.remove(), this.$element.off(U).removeData("selectpicker").removeClass("bs-select-hidden selectpicker"), z(window).off(U + "." + this.selectId);
      }
    };
    var X = z.fn.selectpicker;
    z.fn.selectpicker = Q, z.fn.selectpicker.Constructor = J, z.fn.selectpicker.noConflict = function () {
      return z.fn.selectpicker = X, this;
    }, z(document).off("keydown.bs.dropdown.data-api").on("keydown" + U, '.bootstrap-select [data-toggle="dropdown"], .bootstrap-select [role="listbox"], .bootstrap-select .bs-searchbox input', J.prototype.keydown).on("focusin.modal", '.bootstrap-select [data-toggle="dropdown"], .bootstrap-select [role="listbox"], .bootstrap-select .bs-searchbox input', function (e) {
      e.stopPropagation();
    }), z(window).on("load" + U + ".data-api", function () {
      z(".selectpicker").each(function () {
        var e = z(this);
        Q.call(e, e.data());
      });
    });
  }(e);
});
/*! =========================================================
 * Sliding Menu v0.2.0
 * http://github.danielcardoso.net/sliding-menu/
 * ==========================================================
 * Copyright (c) 2014-2015 DanielCardoso.net.
 * Licensed under MIT.
 * ======================================================== */
if (typeof jQuery === 'undefined') {
  throw new Error('Sliding Menu requires jQuery');
}

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  var slidingMenuUsedIds, SlidingMenu;
  slidingMenuUsedIds = [];

  SlidingMenu = function (element, options) {
    this.options = undefined;
    this.$el = undefined;
    this.currentPanel = undefined;
    this.init(element, options);
  };

  SlidingMenu.NAME = 'Sliding Menu';
  SlidingMenu.VERSION = '0.2.0';
  SlidingMenu.MAIN_CLASS = 'sliding-menu';
  SlidingMenu.PANEL_CLASS = SlidingMenu.MAIN_CLASS + '-panel';
  SlidingMenu.ICON_CLASS = SlidingMenu.MAIN_CLASS + '-icon';
  SlidingMenu.NAVIGATION_CLASS = SlidingMenu.MAIN_CLASS + '-nav';
  SlidingMenu.SET_ICON_CLASS = 'sm-set-icon';
  SlidingMenu.DEFAULTS = {
    // Adicional class for menu element
    className: '',
    // Default slide animation speed
    transitionDuration: 250,
    // A JSON object to build the menu from. Check our JSON example.
    dataJSON: false,
    // The link to the selected panel. Set to false to use the root panel
    initHref: false,
    // Label for the back button. Set to true to use the link's own label
    backLabel: 'Back'
  };

  SlidingMenu.prototype.init = function (element, options) {
    this.$el = $(element);

    if (this.$el.hasClass(SlidingMenu.MAIN_CLASS)) {
      return;
    }

    this.options = this.getOptions(options);
    this.events();
    this.process();
  };

  SlidingMenu.prototype.$ = function (selector) {
    return this.$el.find(selector);
  };

  SlidingMenu.prototype.events = function () {
    this.$el.on('click', 'a', $.proxy(this._onClickItem, this));
  };

  SlidingMenu.prototype._onClickItem = function (event) {
    var linker, targetPanel, movePanelTo;
    linker = $(event.currentTarget);

    if (linker.attr('data-id') !== undefined) {
      event.preventDefault();
      movePanelTo = linker.hasClass(SlidingMenu.MAIN_CLASS + '-back');
      targetPanel = this.$('.' + SlidingMenu.PANEL_CLASS + '[data-id="' + linker.attr('data-id') + '"]');

      if (this.currentPanel.attr('data-id') !== targetPanel.attr('data-id')) {
        this.currentPanel.stop(true, true).animate({
          left: movePanelTo ? '100%' : '-100%'
        }, this.options.transitionDuration);
        targetPanel.stop(true, true).css('left', movePanelTo ? '-100%' : '100%').animate({
          left: 0
        }, this.options.transitionDuration);
        this.$el.stop(true, true).animate({
          height: targetPanel.height()
        }, this.options.transitionDuration);
      } else {
        targetPanel.css({
          'left': 0
        });
        this.$el.height(targetPanel.height());
      }

      this.currentPanel = targetPanel;
    }

    if (!linker.hasClass(SlidingMenu.NAVIGATION_CLASS)) {
      this.$('li.active').removeClass('active');
      linker.closest('li').addClass('active');
    }
  };

  SlidingMenu.prototype.process = function () {
    var data;

    if (this.options.dataJSON) {
      data = this.processJSON(this.options.dataJSON);
    } else {
      data = this.processHTML();
    }

    this.setMenuContent(data);
  };

  SlidingMenu.prototype.setMenuContent = function (json) {
    var rootPanel;
    this.$el.empty().addClass(SlidingMenu.MAIN_CLASS + ' ' + this.options.className);
    $(json).each($.proxy(function (index, item) {
      var panel;
      panel = $('<ul/>');

      if (item.root) {
        rootPanel = '.' + SlidingMenu.PANEL_CLASS + '[data-id="' + item.id + '"]';
      } // panel.attr('id', item.id);


      panel.attr('data-id', item.id);
      panel.addClass(SlidingMenu.PANEL_CLASS);
      $(item.children).each(function (index, item) {
        var li, link, icon;
        li = $('<li/>');

        if (item.separator !== true) {
          link = $('<a/>');
          link.attr({
            'class': item.styleClass,
            'href': item.href
          });

          if (item.panelId) {
            link.attr('data-id', item.panelId);
          }

          link.text(item.label);

          if (item.icon) {
            icon = $('<i/>');
            icon.addClass(SlidingMenu.ICON_CLASS + ' ' + item.icon);
            link.prepend(icon);
          }

          li.append(link);
        } else {
          li.addClass(SlidingMenu.MAIN_CLASS + '-separator');
        }

        panel.append(li);
      });
      this.$el.append(panel);
    }, this));
    rootPanel = this.$(rootPanel);
    rootPanel.addClass(SlidingMenu.PANEL_CLASS + '-root');
    this.currentPanel = rootPanel;

    if (this.options.initHref !== false) {
      this.changeVisiblePanel();
    } else {
      this.currentPanel.css('left', 0);
    }

    this.$el.height(this.currentPanel.height());
  };

  SlidingMenu.prototype.changeVisiblePanel = function () {
    var selectedLink, selectedPanel;
    selectedLink = this.getHyperlinkByHref(this.options.initHref);

    if (selectedLink.length !== 0) {
      selectedLink.closest('li').addClass('active');
      selectedPanel = this.getPanelByHref(this.options.initHref);
      this.currentPanel = selectedPanel;
    } else {
      console.warn(SlidingMenu.NAME + ': the link "' + this.options.initHref + '" does not exists. Please ' + 'check the ' + (this.options.dataJSON !== false ? 'JSON object' : 'HTML structure') + '.');
    }

    this.options.initHref = false;
    this.currentPanel.css('left', 0);
  };

  SlidingMenu.prototype.processHTML = function (parentElem, parentObj, backLabel) {
    var root, panels;
    root = {
      id: SlidingMenu.PANEL_CLASS + '-' + this.getNewId(),
      root: parentElem ? false : true,
      children: []
    };
    panels = [];

    if (parentElem !== undefined) {
      root.children.push({
        panelId: parentObj.id,
        href: parentObj.id,
        label: this.options.backLabel === true ? backLabel : this.options.backLabel,
        styleClass: SlidingMenu.MAIN_CLASS + '-back ' + SlidingMenu.NAVIGATION_CLASS
      });
    } else {
      parentElem = this.$el.children('ul');
    }

    parentElem.children('li').each($.proxy(function (key, item) {
      var itemObj, itemLabel, panel, subPanel;
      item = $(item);

      if (!item.hasClass('separator')) {
        itemLabel = item.children('a');
        itemObj = {
          icon: itemLabel.find('.' + SlidingMenu.SET_ICON_CLASS).attr('class') || undefined,
          href: itemLabel.attr('href'),
          label: this.trimWhiteSpaces(itemLabel.text())
        };

        if (itemObj.icon !== undefined) {
          itemObj.icon = itemObj.icon.replace(SlidingMenu.SET_ICON_CLASS, '');
        }

        subPanel = item.children('ul');

        if (subPanel.length !== 0) {
          panel = this.processHTML(subPanel, root, itemObj.label);
          itemObj.panelId = panel[0].id;
          itemObj.styleClass = SlidingMenu.NAVIGATION_CLASS;
          panels = panels.concat(panel);
        }
      } else {
        itemObj = {
          separator: true
        };
      }

      root.children.push(itemObj);
    }, this));
    return [root].concat(panels);
  };

  SlidingMenu.prototype.processJSON = function (data, parent, backLabel) {
    var root, panels;
    root = {
      id: SlidingMenu.PANEL_CLASS + '-' + this.getNewId(),
      root: parent ? false : true,
      children: []
    };
    panels = [];

    if (parent) {
      root.children.push({
        panelId: parent.id,
        href: parent.id,
        label: this.options.backLabel === true ? backLabel : this.options.backLabel,
        styleClass: SlidingMenu.MAIN_CLASS + '-back ' + SlidingMenu.NAVIGATION_CLASS
      });
    }

    $(data).each($.proxy(function (index, item) {
      var panel;
      root.children.push(item);

      if (item.children) {
        panel = this.processJSON(item.children, root, item.label);
        item.panelId = panel[0].id;
        item.styleClass = SlidingMenu.NAVIGATION_CLASS;
        panels = panels.concat(panel); // Delete all childrens

        delete item.children;
      }
    }, this));
    return [root].concat(panels);
  };

  SlidingMenu.prototype.trimWhiteSpaces = function (text) {
    return text.trim();
  };

  SlidingMenu.prototype.getDefaults = function () {
    return SlidingMenu.DEFAULTS;
  };

  SlidingMenu.prototype.getOptions = function (options) {
    return $.extend({}, this.getDefaults(), this.$el.data(), options);
  };

  SlidingMenu.prototype.getHyperlinkByHref = function (href) {
    return this.$('a[href="' + href + '"]') || undefined;
  };

  SlidingMenu.prototype.getPanelByHref = function (href) {
    var linkElement = this.getHyperlinkByHref(href);
    return linkElement !== undefined ? linkElement.closest('ul') : undefined;
  };
  /**
   * Create a new ID
   * @return {Number} New id generated
   */


  SlidingMenu.prototype.getNewId = function () {
    var id;

    do {
      id = Math.random().toString(36).substring(2, 9);
    } while (slidingMenuUsedIds.indexOf(id) >= 0);

    slidingMenuUsedIds.push(id);
    return id;
  }; // PLUGIN DEFINITION
  // =======================
  //


  function Plugin(option) {
    return this.each(function () {
      var $this, data, options;
      $this = $(this);
      data = $this.data('dc.slidingMenu');
      options = typeof option === 'object' && option;

      if (!data && /destroy|hide/.test(option)) {
        return;
      }

      if (!data) {
        $this.data('dc.slidingMenu', data = new SlidingMenu(this, options));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  }

  var old = $.fn.slidingMenu;
  $.fn.slidingMenu = Plugin;
  $.fn.slidingMenu.Constructor = SlidingMenu; // SLIDINGMENU NO CONFLICT
  // =================

  $.fn.slidingMenu.noConflict = function () {
    $.fn.slidingMenu = old;
    return this;
  };
});
// ==================================================
// fancyBox v3.5.7
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2019 fancyApps
//
// ==================================================
!function (t, e, n, o) {
  "use strict";

  function i(t, e) {
    var o,
        i,
        a,
        s = [],
        r = 0;
    t && t.isDefaultPrevented() || (t.preventDefault(), e = e || {}, t && t.data && (e = h(t.data.options, e)), o = e.$target || n(t.currentTarget).trigger("blur"), (a = n.fancybox.getInstance()) && a.$trigger && a.$trigger.is(o) || (e.selector ? s = n(e.selector) : (i = o.attr("data-fancybox") || "", i ? (s = t.data ? t.data.items : [], s = s.length ? s.filter('[data-fancybox="' + i + '"]') : n('[data-fancybox="' + i + '"]')) : s = [o]), r = n(s).index(o), r < 0 && (r = 0), a = n.fancybox.open(s, e, r), a.$trigger = o));
  }

  if (t.console = t.console || {
    info: function (t) {}
  }, n) {
    if (n.fn.fancybox) return void console.info("fancyBox already initialized");

    var a = {
      closeExisting: !1,
      loop: !1,
      gutter: 50,
      keyboard: !0,
      preventCaptionOverlap: !0,
      arrows: !0,
      infobar: !0,
      smallBtn: "auto",
      toolbar: "auto",
      buttons: ["zoom", "slideShow", "thumbs", "close"],
      idleTime: 3,
      protect: !1,
      modal: !1,
      image: {
        preload: !1
      },
      ajax: {
        settings: {
          data: {
            fancybox: !0
          }
        }
      },
      iframe: {
        tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
        preload: !0,
        css: {},
        attr: {
          scrolling: "auto"
        }
      },
      video: {
        tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',
        format: "",
        autoStart: !0
      },
      defaultType: "image",
      animationEffect: "zoom",
      animationDuration: 366,
      zoomOpacity: "auto",
      transitionEffect: "fade",
      transitionDuration: 366,
      slideClass: "",
      baseClass: "",
      baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"><div class="fancybox-caption__body"></div></div></div></div>',
      spinnerTpl: '<div class="fancybox-loading"></div>',
      errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
      btnTpl: {
        download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',
        zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',
        close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',
        arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',
        arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',
        smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'
      },
      parentEl: "body",
      hideScrollbar: !0,
      autoFocus: !0,
      backFocus: !0,
      trapFocus: !0,
      fullScreen: {
        autoStart: !1
      },
      touch: {
        vertical: !0,
        momentum: !0
      },
      hash: null,
      media: {},
      slideShow: {
        autoStart: !1,
        speed: 3e3
      },
      thumbs: {
        autoStart: !1,
        hideOnClose: !0,
        parentEl: ".fancybox-container",
        axis: "y"
      },
      wheel: "auto",
      onInit: n.noop,
      beforeLoad: n.noop,
      afterLoad: n.noop,
      beforeShow: n.noop,
      afterShow: n.noop,
      beforeClose: n.noop,
      afterClose: n.noop,
      onActivate: n.noop,
      onDeactivate: n.noop,
      clickContent: function (t, e) {
        return "image" === t.type && "zoom";
      },
      clickSlide: "close",
      clickOutside: "close",
      dblclickContent: !1,
      dblclickSlide: !1,
      dblclickOutside: !1,
      mobile: {
        preventCaptionOverlap: !1,
        idleTime: !1,
        clickContent: function (t, e) {
          return "image" === t.type && "toggleControls";
        },
        clickSlide: function (t, e) {
          return "image" === t.type ? "toggleControls" : "close";
        },
        dblclickContent: function (t, e) {
          return "image" === t.type && "zoom";
        },
        dblclickSlide: function (t, e) {
          return "image" === t.type && "zoom";
        }
      },
      lang: "en",
      i18n: {
        en: {
          CLOSE: "Close",
          NEXT: "Next",
          PREV: "Previous",
          ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
          PLAY_START: "Start slideshow",
          PLAY_STOP: "Pause slideshow",
          FULL_SCREEN: "Full screen",
          THUMBS: "Thumbnails",
          DOWNLOAD: "Download",
          SHARE: "Share",
          ZOOM: "Zoom"
        },
        de: {
          CLOSE: "Schlie&szlig;en",
          NEXT: "Weiter",
          PREV: "Zur&uuml;ck",
          ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
          PLAY_START: "Diaschau starten",
          PLAY_STOP: "Diaschau beenden",
          FULL_SCREEN: "Vollbild",
          THUMBS: "Vorschaubilder",
          DOWNLOAD: "Herunterladen",
          SHARE: "Teilen",
          ZOOM: "Vergr&ouml;&szlig;ern"
        }
      }
    },
        s = n(t),
        r = n(e),
        c = 0,
        l = function (t) {
      return t && t.hasOwnProperty && t instanceof n;
    },
        d = function () {
      return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function (e) {
        return t.setTimeout(e, 1e3 / 60);
      };
    }(),
        u = function () {
      return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function (e) {
        t.clearTimeout(e);
      };
    }(),
        f = function () {
      var t,
          n = e.createElement("fakeelement"),
          o = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
      };

      for (t in o) if (void 0 !== n.style[t]) return o[t];

      return "transitionend";
    }(),
        p = function (t) {
      return t && t.length && t[0].offsetHeight;
    },
        h = function (t, e) {
      var o = n.extend(!0, {}, t, e);
      return n.each(e, function (t, e) {
        n.isArray(e) && (o[t] = e);
      }), o;
    },
        g = function (t) {
      var o, i;
      return !(!t || t.ownerDocument !== e) && (n(".fancybox-container").css("pointer-events", "none"), o = {
        x: t.getBoundingClientRect().left + t.offsetWidth / 2,
        y: t.getBoundingClientRect().top + t.offsetHeight / 2
      }, i = e.elementFromPoint(o.x, o.y) === t, n(".fancybox-container").css("pointer-events", ""), i);
    },
        b = function (t, e, o) {
      var i = this;
      i.opts = h({
        index: o
      }, n.fancybox.defaults), n.isPlainObject(e) && (i.opts = h(i.opts, e)), n.fancybox.isMobile && (i.opts = h(i.opts, i.opts.mobile)), i.id = i.opts.id || ++c, i.currIndex = parseInt(i.opts.index, 10) || 0, i.prevIndex = null, i.prevPos = null, i.currPos = 0, i.firstRun = !0, i.group = [], i.slides = {}, i.addContent(t), i.group.length && i.init();
    };

    n.extend(b.prototype, {
      init: function () {
        var o,
            i,
            a = this,
            s = a.group[a.currIndex],
            r = s.opts;
        r.closeExisting && n.fancybox.close(!0), n("body").addClass("fancybox-active"), !n.fancybox.getInstance() && !1 !== r.hideScrollbar && !n.fancybox.isMobile && e.body.scrollHeight > t.innerHeight && (n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (t.innerWidth - e.documentElement.clientWidth) + "px;}</style>"), n("body").addClass("compensate-for-scrollbar")), i = "", n.each(r.buttons, function (t, e) {
          i += r.btnTpl[e] || "";
        }), o = n(a.translate(a, r.baseTpl.replace("{{buttons}}", i).replace("{{arrows}}", r.btnTpl.arrowLeft + r.btnTpl.arrowRight))).attr("id", "fancybox-container-" + a.id).addClass(r.baseClass).data("FancyBox", a).appendTo(r.parentEl), a.$refs = {
          container: o
        }, ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function (t) {
          a.$refs[t] = o.find(".fancybox-" + t);
        }), a.trigger("onInit"), a.activate(), a.jumpTo(a.currIndex);
      },
      translate: function (t, e) {
        var n = t.opts.i18n[t.opts.lang] || t.opts.i18n.en;
        return e.replace(/\{\{(\w+)\}\}/g, function (t, e) {
          return void 0 === n[e] ? t : n[e];
        });
      },
      addContent: function (t) {
        var e,
            o = this,
            i = n.makeArray(t);
        n.each(i, function (t, e) {
          var i,
              a,
              s,
              r,
              c,
              l = {},
              d = {};
          n.isPlainObject(e) ? (l = e, d = e.opts || e) : "object" === n.type(e) && n(e).length ? (i = n(e), d = i.data() || {}, d = n.extend(!0, {}, d, d.options), d.$orig = i, l.src = o.opts.src || d.src || i.attr("href"), l.type || l.src || (l.type = "inline", l.src = e)) : l = {
            type: "html",
            src: e + ""
          }, l.opts = n.extend(!0, {}, o.opts, d), n.isArray(d.buttons) && (l.opts.buttons = d.buttons), n.fancybox.isMobile && l.opts.mobile && (l.opts = h(l.opts, l.opts.mobile)), a = l.type || l.opts.type, r = l.src || "", !a && r && ((s = r.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (a = "video", l.opts.video.format || (l.opts.video.format = "video/" + ("ogv" === s[1] ? "ogg" : s[1]))) : r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? a = "image" : r.match(/\.(pdf)((\?|#).*)?$/i) ? (a = "iframe", l = n.extend(!0, l, {
            contentType: "pdf",
            opts: {
              iframe: {
                preload: !1
              }
            }
          })) : "#" === r.charAt(0) && (a = "inline")), a ? l.type = a : o.trigger("objectNeedsType", l), l.contentType || (l.contentType = n.inArray(l.type, ["html", "inline", "ajax"]) > -1 ? "html" : l.type), l.index = o.group.length, "auto" == l.opts.smallBtn && (l.opts.smallBtn = n.inArray(l.type, ["html", "inline", "ajax"]) > -1), "auto" === l.opts.toolbar && (l.opts.toolbar = !l.opts.smallBtn), l.$thumb = l.opts.$thumb || null, l.opts.$trigger && l.index === o.opts.index && (l.$thumb = l.opts.$trigger.find("img:first"), l.$thumb.length && (l.opts.$orig = l.opts.$trigger)), l.$thumb && l.$thumb.length || !l.opts.$orig || (l.$thumb = l.opts.$orig.find("img:first")), l.$thumb && !l.$thumb.length && (l.$thumb = null), l.thumb = l.opts.thumb || (l.$thumb ? l.$thumb[0].src : null), "function" === n.type(l.opts.caption) && (l.opts.caption = l.opts.caption.apply(e, [o, l])), "function" === n.type(o.opts.caption) && (l.opts.caption = o.opts.caption.apply(e, [o, l])), l.opts.caption instanceof n || (l.opts.caption = void 0 === l.opts.caption ? "" : l.opts.caption + ""), "ajax" === l.type && (c = r.split(/\s+/, 2), c.length > 1 && (l.src = c.shift(), l.opts.filter = c.shift())), l.opts.modal && (l.opts = n.extend(!0, l.opts, {
            trapFocus: !0,
            infobar: 0,
            toolbar: 0,
            smallBtn: 0,
            keyboard: 0,
            slideShow: 0,
            fullScreen: 0,
            thumbs: 0,
            touch: 0,
            clickContent: !1,
            clickSlide: !1,
            clickOutside: !1,
            dblclickContent: !1,
            dblclickSlide: !1,
            dblclickOutside: !1
          })), o.group.push(l);
        }), Object.keys(o.slides).length && (o.updateControls(), (e = o.Thumbs) && e.isActive && (e.create(), e.focus()));
      },
      addEvents: function () {
        var e = this;
        e.removeEvents(), e.$refs.container.on("click.fb-close", "[data-fancybox-close]", function (t) {
          t.stopPropagation(), t.preventDefault(), e.close(t);
        }).on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function (t) {
          t.stopPropagation(), t.preventDefault(), e.previous();
        }).on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function (t) {
          t.stopPropagation(), t.preventDefault(), e.next();
        }).on("click.fb", "[data-fancybox-zoom]", function (t) {
          e[e.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
        }), s.on("orientationchange.fb resize.fb", function (t) {
          t && t.originalEvent && "resize" === t.originalEvent.type ? (e.requestId && u(e.requestId), e.requestId = d(function () {
            e.update(t);
          })) : (e.current && "iframe" === e.current.type && e.$refs.stage.hide(), setTimeout(function () {
            e.$refs.stage.show(), e.update(t);
          }, n.fancybox.isMobile ? 600 : 250));
        }), r.on("keydown.fb", function (t) {
          var o = n.fancybox ? n.fancybox.getInstance() : null,
              i = o.current,
              a = t.keyCode || t.which;
          if (9 == a) return void (i.opts.trapFocus && e.focus(t));
          if (!(!i.opts.keyboard || t.ctrlKey || t.altKey || t.shiftKey || n(t.target).is("input,textarea,video,audio,select"))) return 8 === a || 27 === a ? (t.preventDefault(), void e.close(t)) : 37 === a || 38 === a ? (t.preventDefault(), void e.previous()) : 39 === a || 40 === a ? (t.preventDefault(), void e.next()) : void e.trigger("afterKeydown", t, a);
        }), e.group[e.currIndex].opts.idleTime && (e.idleSecondsCounter = 0, r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function (t) {
          e.idleSecondsCounter = 0, e.isIdle && e.showControls(), e.isIdle = !1;
        }), e.idleInterval = t.setInterval(function () {
          ++e.idleSecondsCounter >= e.group[e.currIndex].opts.idleTime && !e.isDragging && (e.isIdle = !0, e.idleSecondsCounter = 0, e.hideControls());
        }, 1e3));
      },
      removeEvents: function () {
        var e = this;
        s.off("orientationchange.fb resize.fb"), r.off("keydown.fb .fb-idle"), this.$refs.container.off(".fb-close .fb-prev .fb-next"), e.idleInterval && (t.clearInterval(e.idleInterval), e.idleInterval = null);
      },
      previous: function (t) {
        return this.jumpTo(this.currPos - 1, t);
      },
      next: function (t) {
        return this.jumpTo(this.currPos + 1, t);
      },
      jumpTo: function (t, e) {
        var o,
            i,
            a,
            s,
            r,
            c,
            l,
            d,
            u,
            f = this,
            h = f.group.length;

        if (!(f.isDragging || f.isClosing || f.isAnimating && f.firstRun)) {
          if (t = parseInt(t, 10), !(a = f.current ? f.current.opts.loop : f.opts.loop) && (t < 0 || t >= h)) return !1;
          if (o = f.firstRun = !Object.keys(f.slides).length, r = f.current, f.prevIndex = f.currIndex, f.prevPos = f.currPos, s = f.createSlide(t), h > 1 && ((a || s.index < h - 1) && f.createSlide(t + 1), (a || s.index > 0) && f.createSlide(t - 1)), f.current = s, f.currIndex = s.index, f.currPos = s.pos, f.trigger("beforeShow", o), f.updateControls(), s.forcedDuration = void 0, n.isNumeric(e) ? s.forcedDuration = e : e = s.opts[o ? "animationDuration" : "transitionDuration"], e = parseInt(e, 10), i = f.isMoved(s), s.$slide.addClass("fancybox-slide--current"), o) return s.opts.animationEffect && e && f.$refs.container.css("transition-duration", e + "ms"), f.$refs.container.addClass("fancybox-is-open").trigger("focus"), f.loadSlide(s), void f.preload("image");
          c = n.fancybox.getTranslate(r.$slide), l = n.fancybox.getTranslate(f.$refs.stage), n.each(f.slides, function (t, e) {
            n.fancybox.stop(e.$slide, !0);
          }), r.pos !== s.pos && (r.isComplete = !1), r.$slide.removeClass("fancybox-slide--complete fancybox-slide--current"), i ? (u = c.left - (r.pos * c.width + r.pos * r.opts.gutter), n.each(f.slides, function (t, o) {
            o.$slide.removeClass("fancybox-animated").removeClass(function (t, e) {
              return (e.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
            });
            var i = o.pos * c.width + o.pos * o.opts.gutter;
            n.fancybox.setTranslate(o.$slide, {
              top: 0,
              left: i - l.left + u
            }), o.pos !== s.pos && o.$slide.addClass("fancybox-slide--" + (o.pos > s.pos ? "next" : "previous")), p(o.$slide), n.fancybox.animate(o.$slide, {
              top: 0,
              left: (o.pos - s.pos) * c.width + (o.pos - s.pos) * o.opts.gutter
            }, e, function () {
              o.$slide.css({
                transform: "",
                opacity: ""
              }).removeClass("fancybox-slide--next fancybox-slide--previous"), o.pos === f.currPos && f.complete();
            });
          })) : e && s.opts.transitionEffect && (d = "fancybox-animated fancybox-fx-" + s.opts.transitionEffect, r.$slide.addClass("fancybox-slide--" + (r.pos > s.pos ? "next" : "previous")), n.fancybox.animate(r.$slide, d, e, function () {
            r.$slide.removeClass(d).removeClass("fancybox-slide--next fancybox-slide--previous");
          }, !1)), s.isLoaded ? f.revealContent(s) : f.loadSlide(s), f.preload("image");
        }
      },
      createSlide: function (t) {
        var e,
            o,
            i = this;
        return o = t % i.group.length, o = o < 0 ? i.group.length + o : o, !i.slides[t] && i.group[o] && (e = n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage), i.slides[t] = n.extend(!0, {}, i.group[o], {
          pos: t,
          $slide: e,
          isLoaded: !1
        }), i.updateSlide(i.slides[t])), i.slides[t];
      },
      scaleToActual: function (t, e, o) {
        var i,
            a,
            s,
            r,
            c,
            l = this,
            d = l.current,
            u = d.$content,
            f = n.fancybox.getTranslate(d.$slide).width,
            p = n.fancybox.getTranslate(d.$slide).height,
            h = d.width,
            g = d.height;
        l.isAnimating || l.isMoved() || !u || "image" != d.type || !d.isLoaded || d.hasError || (l.isAnimating = !0, n.fancybox.stop(u), t = void 0 === t ? .5 * f : t, e = void 0 === e ? .5 * p : e, i = n.fancybox.getTranslate(u), i.top -= n.fancybox.getTranslate(d.$slide).top, i.left -= n.fancybox.getTranslate(d.$slide).left, r = h / i.width, c = g / i.height, a = .5 * f - .5 * h, s = .5 * p - .5 * g, h > f && (a = i.left * r - (t * r - t), a > 0 && (a = 0), a < f - h && (a = f - h)), g > p && (s = i.top * c - (e * c - e), s > 0 && (s = 0), s < p - g && (s = p - g)), l.updateCursor(h, g), n.fancybox.animate(u, {
          top: s,
          left: a,
          scaleX: r,
          scaleY: c
        }, o || 366, function () {
          l.isAnimating = !1;
        }), l.SlideShow && l.SlideShow.isActive && l.SlideShow.stop());
      },
      scaleToFit: function (t) {
        var e,
            o = this,
            i = o.current,
            a = i.$content;
        o.isAnimating || o.isMoved() || !a || "image" != i.type || !i.isLoaded || i.hasError || (o.isAnimating = !0, n.fancybox.stop(a), e = o.getFitPos(i), o.updateCursor(e.width, e.height), n.fancybox.animate(a, {
          top: e.top,
          left: e.left,
          scaleX: e.width / a.width(),
          scaleY: e.height / a.height()
        }, t || 366, function () {
          o.isAnimating = !1;
        }));
      },
      getFitPos: function (t) {
        var e,
            o,
            i,
            a,
            s = this,
            r = t.$content,
            c = t.$slide,
            l = t.width || t.opts.width,
            d = t.height || t.opts.height,
            u = {};
        return !!(t.isLoaded && r && r.length) && (e = n.fancybox.getTranslate(s.$refs.stage).width, o = n.fancybox.getTranslate(s.$refs.stage).height, e -= parseFloat(c.css("paddingLeft")) + parseFloat(c.css("paddingRight")) + parseFloat(r.css("marginLeft")) + parseFloat(r.css("marginRight")), o -= parseFloat(c.css("paddingTop")) + parseFloat(c.css("paddingBottom")) + parseFloat(r.css("marginTop")) + parseFloat(r.css("marginBottom")), l && d || (l = e, d = o), i = Math.min(1, e / l, o / d), l *= i, d *= i, l > e - .5 && (l = e), d > o - .5 && (d = o), "image" === t.type ? (u.top = Math.floor(.5 * (o - d)) + parseFloat(c.css("paddingTop")), u.left = Math.floor(.5 * (e - l)) + parseFloat(c.css("paddingLeft"))) : "video" === t.contentType && (a = t.opts.width && t.opts.height ? l / d : t.opts.ratio || 16 / 9, d > l / a ? d = l / a : l > d * a && (l = d * a)), u.width = l, u.height = d, u);
      },
      update: function (t) {
        var e = this;
        n.each(e.slides, function (n, o) {
          e.updateSlide(o, t);
        });
      },
      updateSlide: function (t, e) {
        var o = this,
            i = t && t.$content,
            a = t.width || t.opts.width,
            s = t.height || t.opts.height,
            r = t.$slide;
        o.adjustCaption(t), i && (a || s || "video" === t.contentType) && !t.hasError && (n.fancybox.stop(i), n.fancybox.setTranslate(i, o.getFitPos(t)), t.pos === o.currPos && (o.isAnimating = !1, o.updateCursor())), o.adjustLayout(t), r.length && (r.trigger("refresh"), t.pos === o.currPos && o.$refs.toolbar.add(o.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar", r.get(0).scrollHeight > r.get(0).clientHeight)), o.trigger("onUpdate", t, e);
      },
      centerSlide: function (t) {
        var e = this,
            o = e.current,
            i = o.$slide;
        !e.isClosing && o && (i.siblings().css({
          transform: "",
          opacity: ""
        }), i.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next"), n.fancybox.animate(i, {
          top: 0,
          left: 0,
          opacity: 1
        }, void 0 === t ? 0 : t, function () {
          i.css({
            transform: "",
            opacity: ""
          }), o.isComplete || e.complete();
        }, !1));
      },
      isMoved: function (t) {
        var e,
            o,
            i = t || this.current;
        return !!i && (o = n.fancybox.getTranslate(this.$refs.stage), e = n.fancybox.getTranslate(i.$slide), !i.$slide.hasClass("fancybox-animated") && (Math.abs(e.top - o.top) > .5 || Math.abs(e.left - o.left) > .5));
      },
      updateCursor: function (t, e) {
        var o,
            i,
            a = this,
            s = a.current,
            r = a.$refs.container;
        s && !a.isClosing && a.Guestures && (r.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"), o = a.canPan(t, e), i = !!o || a.isZoomable(), r.toggleClass("fancybox-is-zoomable", i), n("[data-fancybox-zoom]").prop("disabled", !i), o ? r.addClass("fancybox-can-pan") : i && ("zoom" === s.opts.clickContent || n.isFunction(s.opts.clickContent) && "zoom" == s.opts.clickContent(s)) ? r.addClass("fancybox-can-zoomIn") : s.opts.touch && (s.opts.touch.vertical || a.group.length > 1) && "video" !== s.contentType && r.addClass("fancybox-can-swipe"));
      },
      isZoomable: function () {
        var t,
            e = this,
            n = e.current;

        if (n && !e.isClosing && "image" === n.type && !n.hasError) {
          if (!n.isLoaded) return !0;
          if ((t = e.getFitPos(n)) && (n.width > t.width || n.height > t.height)) return !0;
        }

        return !1;
      },
      isScaledDown: function (t, e) {
        var o = this,
            i = !1,
            a = o.current,
            s = a.$content;
        return void 0 !== t && void 0 !== e ? i = t < a.width && e < a.height : s && (i = n.fancybox.getTranslate(s), i = i.width < a.width && i.height < a.height), i;
      },
      canPan: function (t, e) {
        var o = this,
            i = o.current,
            a = null,
            s = !1;
        return "image" === i.type && (i.isComplete || t && e) && !i.hasError && (s = o.getFitPos(i), void 0 !== t && void 0 !== e ? a = {
          width: t,
          height: e
        } : i.isComplete && (a = n.fancybox.getTranslate(i.$content)), a && s && (s = Math.abs(a.width - s.width) > 1.5 || Math.abs(a.height - s.height) > 1.5)), s;
      },
      loadSlide: function (t) {
        var e,
            o,
            i,
            a = this;

        if (!t.isLoading && !t.isLoaded) {
          if (t.isLoading = !0, !1 === a.trigger("beforeLoad", t)) return t.isLoading = !1, !1;

          switch (e = t.type, o = t.$slide, o.off("refresh").trigger("onReset").addClass(t.opts.slideClass), e) {
            case "image":
              a.setImage(t);
              break;

            case "iframe":
              a.setIframe(t);
              break;

            case "html":
              a.setContent(t, t.src || t.content);
              break;

            case "video":
              a.setContent(t, t.opts.video.tpl.replace(/\{\{src\}\}/gi, t.src).replace("{{format}}", t.opts.videoFormat || t.opts.video.format || "").replace("{{poster}}", t.thumb || ""));
              break;

            case "inline":
              n(t.src).length ? a.setContent(t, n(t.src)) : a.setError(t);
              break;

            case "ajax":
              a.showLoading(t), i = n.ajax(n.extend({}, t.opts.ajax.settings, {
                url: t.src,
                success: function (e, n) {
                  "success" === n && a.setContent(t, e);
                },
                error: function (e, n) {
                  e && "abort" !== n && a.setError(t);
                }
              })), o.one("onReset", function () {
                i.abort();
              });
              break;

            default:
              a.setError(t);
          }

          return !0;
        }
      },
      setImage: function (t) {
        var o,
            i = this;
        setTimeout(function () {
          var e = t.$image;
          i.isClosing || !t.isLoading || e && e.length && e[0].complete || t.hasError || i.showLoading(t);
        }, 50), i.checkSrcset(t), t.$content = n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(t.$slide.addClass("fancybox-slide--image")), !1 !== t.opts.preload && t.opts.width && t.opts.height && t.thumb && (t.width = t.opts.width, t.height = t.opts.height, o = e.createElement("img"), o.onerror = function () {
          n(this).remove(), t.$ghost = null;
        }, o.onload = function () {
          i.afterLoad(t);
        }, t.$ghost = n(o).addClass("fancybox-image").appendTo(t.$content).attr("src", t.thumb)), i.setBigImage(t);
      },
      checkSrcset: function (e) {
        var n,
            o,
            i,
            a,
            s = e.opts.srcset || e.opts.image.srcset;

        if (s) {
          i = t.devicePixelRatio || 1, a = t.innerWidth * i, o = s.split(",").map(function (t) {
            var e = {};
            return t.trim().split(/\s+/).forEach(function (t, n) {
              var o = parseInt(t.substring(0, t.length - 1), 10);
              if (0 === n) return e.url = t;
              o && (e.value = o, e.postfix = t[t.length - 1]);
            }), e;
          }), o.sort(function (t, e) {
            return t.value - e.value;
          });

          for (var r = 0; r < o.length; r++) {
            var c = o[r];

            if ("w" === c.postfix && c.value >= a || "x" === c.postfix && c.value >= i) {
              n = c;
              break;
            }
          }

          !n && o.length && (n = o[o.length - 1]), n && (e.src = n.url, e.width && e.height && "w" == n.postfix && (e.height = e.width / e.height * n.value, e.width = n.value), e.opts.srcset = s);
        }
      },
      setBigImage: function (t) {
        var o = this,
            i = e.createElement("img"),
            a = n(i);
        t.$image = a.one("error", function () {
          o.setError(t);
        }).one("load", function () {
          var e;
          t.$ghost || (o.resolveImageSlideSize(t, this.naturalWidth, this.naturalHeight), o.afterLoad(t)), o.isClosing || (t.opts.srcset && (e = t.opts.sizes, e && "auto" !== e || (e = (t.width / t.height > 1 && s.width() / s.height() > 1 ? "100" : Math.round(t.width / t.height * 100)) + "vw"), a.attr("sizes", e).attr("srcset", t.opts.srcset)), t.$ghost && setTimeout(function () {
            t.$ghost && !o.isClosing && t.$ghost.hide();
          }, Math.min(300, Math.max(1e3, t.height / 1600))), o.hideLoading(t));
        }).addClass("fancybox-image").attr("src", t.src).appendTo(t.$content), (i.complete || "complete" == i.readyState) && a.naturalWidth && a.naturalHeight ? a.trigger("load") : i.error && a.trigger("error");
      },
      resolveImageSlideSize: function (t, e, n) {
        var o = parseInt(t.opts.width, 10),
            i = parseInt(t.opts.height, 10);
        t.width = e, t.height = n, o > 0 && (t.width = o, t.height = Math.floor(o * n / e)), i > 0 && (t.width = Math.floor(i * e / n), t.height = i);
      },
      setIframe: function (t) {
        var e,
            o = this,
            i = t.opts.iframe,
            a = t.$slide;
        t.$content = n('<div class="fancybox-content' + (i.preload ? " fancybox-is-hidden" : "") + '"></div>').css(i.css).appendTo(a), a.addClass("fancybox-slide--" + t.contentType), t.$iframe = e = n(i.tpl.replace(/\{rnd\}/g, new Date().getTime())).attr(i.attr).appendTo(t.$content), i.preload ? (o.showLoading(t), e.on("load.fb error.fb", function (e) {
          this.isReady = 1, t.$slide.trigger("refresh"), o.afterLoad(t);
        }), a.on("refresh.fb", function () {
          var n,
              o,
              s = t.$content,
              r = i.css.width,
              c = i.css.height;

          if (1 === e[0].isReady) {
            try {
              n = e.contents(), o = n.find("body");
            } catch (t) {}

            o && o.length && o.children().length && (a.css("overflow", "visible"), s.css({
              width: "100%",
              "max-width": "100%",
              height: "9999px"
            }), void 0 === r && (r = Math.ceil(Math.max(o[0].clientWidth, o.outerWidth(!0)))), s.css("width", r || "").css("max-width", ""), void 0 === c && (c = Math.ceil(Math.max(o[0].clientHeight, o.outerHeight(!0)))), s.css("height", c || ""), a.css("overflow", "auto")), s.removeClass("fancybox-is-hidden");
          }
        })) : o.afterLoad(t), e.attr("src", t.src), a.one("onReset", function () {
          try {
            n(this).find("iframe").hide().unbind().attr("src", "//about:blank");
          } catch (t) {}

          n(this).off("refresh.fb").empty(), t.isLoaded = !1, t.isRevealed = !1;
        });
      },
      setContent: function (t, e) {
        var o = this;
        o.isClosing || (o.hideLoading(t), t.$content && n.fancybox.stop(t.$content), t.$slide.empty(), l(e) && e.parent().length ? ((e.hasClass("fancybox-content") || e.parent().hasClass("fancybox-content")) && e.parents(".fancybox-slide").trigger("onReset"), t.$placeholder = n("<div>").hide().insertAfter(e), e.css("display", "inline-block")) : t.hasError || ("string" === n.type(e) && (e = n("<div>").append(n.trim(e)).contents()), t.opts.filter && (e = n("<div>").html(e).find(t.opts.filter))), t.$slide.one("onReset", function () {
          n(this).find("video,audio").trigger("pause"), t.$placeholder && (t.$placeholder.after(e.removeClass("fancybox-content").hide()).remove(), t.$placeholder = null), t.$smallBtn && (t.$smallBtn.remove(), t.$smallBtn = null), t.hasError || (n(this).empty(), t.isLoaded = !1, t.isRevealed = !1);
        }), n(e).appendTo(t.$slide), n(e).is("video,audio") && (n(e).addClass("fancybox-video"), n(e).wrap("<div></div>"), t.contentType = "video", t.opts.width = t.opts.width || n(e).attr("width"), t.opts.height = t.opts.height || n(e).attr("height")), t.$content = t.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first(), t.$content.siblings().hide(), t.$content.length || (t.$content = t.$slide.wrapInner("<div></div>").children().first()), t.$content.addClass("fancybox-content"), t.$slide.addClass("fancybox-slide--" + t.contentType), o.afterLoad(t));
      },
      setError: function (t) {
        t.hasError = !0, t.$slide.trigger("onReset").removeClass("fancybox-slide--" + t.contentType).addClass("fancybox-slide--error"), t.contentType = "html", this.setContent(t, this.translate(t, t.opts.errorTpl)), t.pos === this.currPos && (this.isAnimating = !1);
      },
      showLoading: function (t) {
        var e = this;
        (t = t || e.current) && !t.$spinner && (t.$spinner = n(e.translate(e, e.opts.spinnerTpl)).appendTo(t.$slide).hide().fadeIn("fast"));
      },
      hideLoading: function (t) {
        var e = this;
        (t = t || e.current) && t.$spinner && (t.$spinner.stop().remove(), delete t.$spinner);
      },
      afterLoad: function (t) {
        var e = this;
        e.isClosing || (t.isLoading = !1, t.isLoaded = !0, e.trigger("afterLoad", t), e.hideLoading(t), !t.opts.smallBtn || t.$smallBtn && t.$smallBtn.length || (t.$smallBtn = n(e.translate(t, t.opts.btnTpl.smallBtn)).appendTo(t.$content)), t.opts.protect && t.$content && !t.hasError && (t.$content.on("contextmenu.fb", function (t) {
          return 2 == t.button && t.preventDefault(), !0;
        }), "image" === t.type && n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)), e.adjustCaption(t), e.adjustLayout(t), t.pos === e.currPos && e.updateCursor(), e.revealContent(t));
      },
      adjustCaption: function (t) {
        var e,
            n = this,
            o = t || n.current,
            i = o.opts.caption,
            a = o.opts.preventCaptionOverlap,
            s = n.$refs.caption,
            r = !1;
        s.toggleClass("fancybox-caption--separate", a), a && i && i.length && (o.pos !== n.currPos ? (e = s.clone().appendTo(s.parent()), e.children().eq(0).empty().html(i), r = e.outerHeight(!0), e.empty().remove()) : n.$caption && (r = n.$caption.outerHeight(!0)), o.$slide.css("padding-bottom", r || ""));
      },
      adjustLayout: function (t) {
        var e,
            n,
            o,
            i,
            a = this,
            s = t || a.current;
        s.isLoaded && !0 !== s.opts.disableLayoutFix && (s.$content.css("margin-bottom", ""), s.$content.outerHeight() > s.$slide.height() + .5 && (o = s.$slide[0].style["padding-bottom"], i = s.$slide.css("padding-bottom"), parseFloat(i) > 0 && (e = s.$slide[0].scrollHeight, s.$slide.css("padding-bottom", 0), Math.abs(e - s.$slide[0].scrollHeight) < 1 && (n = i), s.$slide.css("padding-bottom", o))), s.$content.css("margin-bottom", n));
      },
      revealContent: function (t) {
        var e,
            o,
            i,
            a,
            s = this,
            r = t.$slide,
            c = !1,
            l = !1,
            d = s.isMoved(t),
            u = t.isRevealed;
        return t.isRevealed = !0, e = t.opts[s.firstRun ? "animationEffect" : "transitionEffect"], i = t.opts[s.firstRun ? "animationDuration" : "transitionDuration"], i = parseInt(void 0 === t.forcedDuration ? i : t.forcedDuration, 10), !d && t.pos === s.currPos && i || (e = !1), "zoom" === e && (t.pos === s.currPos && i && "image" === t.type && !t.hasError && (l = s.getThumbPos(t)) ? c = s.getFitPos(t) : e = "fade"), "zoom" === e ? (s.isAnimating = !0, c.scaleX = c.width / l.width, c.scaleY = c.height / l.height, a = t.opts.zoomOpacity, "auto" == a && (a = Math.abs(t.width / t.height - l.width / l.height) > .1), a && (l.opacity = .1, c.opacity = 1), n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"), l), p(t.$content), void n.fancybox.animate(t.$content, c, i, function () {
          s.isAnimating = !1, s.complete();
        })) : (s.updateSlide(t), e ? (n.fancybox.stop(r), o = "fancybox-slide--" + (t.pos >= s.prevPos ? "next" : "previous") + " fancybox-animated fancybox-fx-" + e, r.addClass(o).removeClass("fancybox-slide--current"), t.$content.removeClass("fancybox-is-hidden"), p(r), "image" !== t.type && t.$content.hide().show(0), void n.fancybox.animate(r, "fancybox-slide--current", i, function () {
          r.removeClass(o).css({
            transform: "",
            opacity: ""
          }), t.pos === s.currPos && s.complete();
        }, !0)) : (t.$content.removeClass("fancybox-is-hidden"), u || !d || "image" !== t.type || t.hasError || t.$content.hide().fadeIn("fast"), void (t.pos === s.currPos && s.complete())));
      },
      getThumbPos: function (t) {
        var e,
            o,
            i,
            a,
            s,
            r = !1,
            c = t.$thumb;
        return !(!c || !g(c[0])) && (e = n.fancybox.getTranslate(c), o = parseFloat(c.css("border-top-width") || 0), i = parseFloat(c.css("border-right-width") || 0), a = parseFloat(c.css("border-bottom-width") || 0), s = parseFloat(c.css("border-left-width") || 0), r = {
          top: e.top + o,
          left: e.left + s,
          width: e.width - i - s,
          height: e.height - o - a,
          scaleX: 1,
          scaleY: 1
        }, e.width > 0 && e.height > 0 && r);
      },
      complete: function () {
        var t,
            e = this,
            o = e.current,
            i = {};
        !e.isMoved() && o.isLoaded && (o.isComplete || (o.isComplete = !0, o.$slide.siblings().trigger("onReset"), e.preload("inline"), p(o.$slide), o.$slide.addClass("fancybox-slide--complete"), n.each(e.slides, function (t, o) {
          o.pos >= e.currPos - 1 && o.pos <= e.currPos + 1 ? i[o.pos] = o : o && (n.fancybox.stop(o.$slide), o.$slide.off().remove());
        }), e.slides = i), e.isAnimating = !1, e.updateCursor(), e.trigger("afterShow"), o.opts.video.autoStart && o.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function () {
          Document.exitFullscreen ? Document.exitFullscreen() : this.webkitExitFullscreen && this.webkitExitFullscreen(), e.next();
        }), o.opts.autoFocus && "html" === o.contentType && (t = o.$content.find("input[autofocus]:enabled:visible:first"), t.length ? t.trigger("focus") : e.focus(null, !0)), o.$slide.scrollTop(0).scrollLeft(0));
      },
      preload: function (t) {
        var e,
            n,
            o = this;
        o.group.length < 2 || (n = o.slides[o.currPos + 1], e = o.slides[o.currPos - 1], e && e.type === t && o.loadSlide(e), n && n.type === t && o.loadSlide(n));
      },
      focus: function (t, o) {
        var i,
            a,
            s = this,
            r = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'].join(",");
        s.isClosing || (i = !t && s.current && s.current.isComplete ? s.current.$slide.find("*:visible" + (o ? ":not(.fancybox-close-small)" : "")) : s.$refs.container.find("*:visible"), i = i.filter(r).filter(function () {
          return "hidden" !== n(this).css("visibility") && !n(this).hasClass("disabled");
        }), i.length ? (a = i.index(e.activeElement), t && t.shiftKey ? (a < 0 || 0 == a) && (t.preventDefault(), i.eq(i.length - 1).trigger("focus")) : (a < 0 || a == i.length - 1) && (t && t.preventDefault(), i.eq(0).trigger("focus"))) : s.$refs.container.trigger("focus"));
      },
      activate: function () {
        var t = this;
        n(".fancybox-container").each(function () {
          var e = n(this).data("FancyBox");
          e && e.id !== t.id && !e.isClosing && (e.trigger("onDeactivate"), e.removeEvents(), e.isVisible = !1);
        }), t.isVisible = !0, (t.current || t.isIdle) && (t.update(), t.updateControls()), t.trigger("onActivate"), t.addEvents();
      },
      close: function (t, e) {
        var o,
            i,
            a,
            s,
            r,
            c,
            l,
            u = this,
            f = u.current,
            h = function () {
          u.cleanUp(t);
        };

        return !u.isClosing && (u.isClosing = !0, !1 === u.trigger("beforeClose", t) ? (u.isClosing = !1, d(function () {
          u.update();
        }), !1) : (u.removeEvents(), a = f.$content, o = f.opts.animationEffect, i = n.isNumeric(e) ? e : o ? f.opts.animationDuration : 0, f.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"), !0 !== t ? n.fancybox.stop(f.$slide) : o = !1, f.$slide.siblings().trigger("onReset").remove(), i && u.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration", i + "ms"), u.hideLoading(f), u.hideControls(!0), u.updateCursor(), "zoom" !== o || a && i && "image" === f.type && !u.isMoved() && !f.hasError && (l = u.getThumbPos(f)) || (o = "fade"), "zoom" === o ? (n.fancybox.stop(a), s = n.fancybox.getTranslate(a), c = {
          top: s.top,
          left: s.left,
          scaleX: s.width / l.width,
          scaleY: s.height / l.height,
          width: l.width,
          height: l.height
        }, r = f.opts.zoomOpacity, "auto" == r && (r = Math.abs(f.width / f.height - l.width / l.height) > .1), r && (l.opacity = 0), n.fancybox.setTranslate(a, c), p(a), n.fancybox.animate(a, l, i, h), !0) : (o && i ? n.fancybox.animate(f.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"), "fancybox-animated fancybox-fx-" + o, i, h) : !0 === t ? setTimeout(h, i) : h(), !0)));
      },
      cleanUp: function (e) {
        var o,
            i,
            a,
            s = this,
            r = s.current.opts.$orig;
        s.current.$slide.trigger("onReset"), s.$refs.container.empty().remove(), s.trigger("afterClose", e), s.current.opts.backFocus && (r && r.length && r.is(":visible") || (r = s.$trigger), r && r.length && (i = t.scrollX, a = t.scrollY, r.trigger("focus"), n("html, body").scrollTop(a).scrollLeft(i))), s.current = null, o = n.fancybox.getInstance(), o ? o.activate() : (n("body").removeClass("fancybox-active compensate-for-scrollbar"), n("#fancybox-style-noscroll").remove());
      },
      trigger: function (t, e) {
        var o,
            i = Array.prototype.slice.call(arguments, 1),
            a = this,
            s = e && e.opts ? e : a.current;
        if (s ? i.unshift(s) : s = a, i.unshift(a), n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)), !1 === o) return o;
        "afterClose" !== t && a.$refs ? a.$refs.container.trigger(t + ".fb", i) : r.trigger(t + ".fb", i);
      },
      updateControls: function () {
        var t = this,
            o = t.current,
            i = o.index,
            a = t.$refs.container,
            s = t.$refs.caption,
            r = o.opts.caption;
        o.$slide.trigger("refresh"), r && r.length ? (t.$caption = s, s.children().eq(0).html(r)) : t.$caption = null, t.hasHiddenControls || t.isIdle || t.showControls(), a.find("[data-fancybox-count]").html(t.group.length), a.find("[data-fancybox-index]").html(i + 1), a.find("[data-fancybox-prev]").prop("disabled", !o.opts.loop && i <= 0), a.find("[data-fancybox-next]").prop("disabled", !o.opts.loop && i >= t.group.length - 1), "image" === o.type ? a.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href", o.opts.image.src || o.src).show() : o.opts.toolbar && a.find("[data-fancybox-download],[data-fancybox-zoom]").hide(), n(e.activeElement).is(":hidden,[disabled]") && t.$refs.container.trigger("focus");
      },
      hideControls: function (t) {
        var e = this,
            n = ["infobar", "toolbar", "nav"];
        !t && e.current.opts.preventCaptionOverlap || n.push("caption"), this.$refs.container.removeClass(n.map(function (t) {
          return "fancybox-show-" + t;
        }).join(" ")), this.hasHiddenControls = !0;
      },
      showControls: function () {
        var t = this,
            e = t.current ? t.current.opts : t.opts,
            n = t.$refs.container;
        t.hasHiddenControls = !1, t.idleSecondsCounter = 0, n.toggleClass("fancybox-show-toolbar", !(!e.toolbar || !e.buttons)).toggleClass("fancybox-show-infobar", !!(e.infobar && t.group.length > 1)).toggleClass("fancybox-show-caption", !!t.$caption).toggleClass("fancybox-show-nav", !!(e.arrows && t.group.length > 1)).toggleClass("fancybox-is-modal", !!e.modal);
      },
      toggleControls: function () {
        this.hasHiddenControls ? this.showControls() : this.hideControls();
      }
    }), n.fancybox = {
      version: "3.5.7",
      defaults: a,
      getInstance: function (t) {
        var e = n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),
            o = Array.prototype.slice.call(arguments, 1);
        return e instanceof b && ("string" === n.type(t) ? e[t].apply(e, o) : "function" === n.type(t) && t.apply(e, o), e);
      },
      open: function (t, e, n) {
        return new b(t, e, n);
      },
      close: function (t) {
        var e = this.getInstance();
        e && (e.close(), !0 === t && this.close(t));
      },
      destroy: function () {
        this.close(!0), r.add("body").off("click.fb-start", "**");
      },
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      use3d: function () {
        var n = e.createElement("div");
        return t.getComputedStyle && t.getComputedStyle(n) && t.getComputedStyle(n).getPropertyValue("transform") && !(e.documentMode && e.documentMode < 11);
      }(),
      getTranslate: function (t) {
        var e;
        return !(!t || !t.length) && (e = t[0].getBoundingClientRect(), {
          top: e.top || 0,
          left: e.left || 0,
          width: e.width,
          height: e.height,
          opacity: parseFloat(t.css("opacity"))
        });
      },
      setTranslate: function (t, e) {
        var n = "",
            o = {};
        if (t && e) return void 0 === e.left && void 0 === e.top || (n = (void 0 === e.left ? t.position().left : e.left) + "px, " + (void 0 === e.top ? t.position().top : e.top) + "px", n = this.use3d ? "translate3d(" + n + ", 0px)" : "translate(" + n + ")"), void 0 !== e.scaleX && void 0 !== e.scaleY ? n += " scale(" + e.scaleX + ", " + e.scaleY + ")" : void 0 !== e.scaleX && (n += " scaleX(" + e.scaleX + ")"), n.length && (o.transform = n), void 0 !== e.opacity && (o.opacity = e.opacity), void 0 !== e.width && (o.width = e.width), void 0 !== e.height && (o.height = e.height), t.css(o);
      },
      animate: function (t, e, o, i, a) {
        var s,
            r = this;
        n.isFunction(o) && (i = o, o = null), r.stop(t), s = r.getTranslate(t), t.on(f, function (c) {
          (!c || !c.originalEvent || t.is(c.originalEvent.target) && "z-index" != c.originalEvent.propertyName) && (r.stop(t), n.isNumeric(o) && t.css("transition-duration", ""), n.isPlainObject(e) ? void 0 !== e.scaleX && void 0 !== e.scaleY && r.setTranslate(t, {
            top: e.top,
            left: e.left,
            width: s.width * e.scaleX,
            height: s.height * e.scaleY,
            scaleX: 1,
            scaleY: 1
          }) : !0 !== a && t.removeClass(e), n.isFunction(i) && i(c));
        }), n.isNumeric(o) && t.css("transition-duration", o + "ms"), n.isPlainObject(e) ? (void 0 !== e.scaleX && void 0 !== e.scaleY && (delete e.width, delete e.height, t.parent().hasClass("fancybox-slide--image") && t.parent().addClass("fancybox-is-scaling")), n.fancybox.setTranslate(t, e)) : t.addClass(e), t.data("timer", setTimeout(function () {
          t.trigger(f);
        }, o + 33));
      },
      stop: function (t, e) {
        t && t.length && (clearTimeout(t.data("timer")), e && t.trigger(f), t.off(f).css("transition-duration", ""), t.parent().removeClass("fancybox-is-scaling"));
      }
    }, n.fn.fancybox = function (t) {
      var e;
      return t = t || {}, e = t.selector || !1, e ? n("body").off("click.fb-start", e).on("click.fb-start", e, {
        options: t
      }, i) : this.off("click.fb-start").on("click.fb-start", {
        items: this,
        options: t
      }, i), this;
    }, r.on("click.fb-start", "[data-fancybox]", i), r.on("click.fb-start", "[data-fancybox-trigger]", function (t) {
      n('[data-fancybox="' + n(this).attr("data-fancybox-trigger") + '"]').eq(n(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", {
        $trigger: n(this)
      });
    }), function () {
      var t = null;
      r.on("mousedown mouseup focus blur", ".fancybox-button", function (e) {
        switch (e.type) {
          case "mousedown":
            t = n(this);
            break;

          case "mouseup":
            t = null;
            break;

          case "focusin":
            n(".fancybox-button").removeClass("fancybox-focus"), n(this).is(t) || n(this).is("[disabled]") || n(this).addClass("fancybox-focus");
            break;

          case "focusout":
            n(".fancybox-button").removeClass("fancybox-focus");
        }
      });
    }();
  }
}(window, document, jQuery), function (t) {
  "use strict";

  var e = {
    youtube: {
      matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
      params: {
        autoplay: 1,
        autohide: 1,
        fs: 1,
        rel: 0,
        hd: 1,
        wmode: "transparent",
        enablejsapi: 1,
        html5: 1
      },
      paramPlace: 8,
      type: "iframe",
      url: "https://www.youtube-nocookie.com/embed/$4",
      thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg"
    },
    vimeo: {
      matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
      params: {
        autoplay: 1,
        hd: 1,
        show_title: 1,
        show_byline: 1,
        show_portrait: 0,
        fullscreen: 1
      },
      paramPlace: 3,
      type: "iframe",
      url: "//player.vimeo.com/video/$2"
    },
    instagram: {
      matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
      type: "image",
      url: "//$1/p/$2/media/?size=l"
    },
    gmap_place: {
      matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
      type: "iframe",
      url: function (t) {
        return "//maps.google." + t[2] + "/?ll=" + (t[9] ? t[9] + "&z=" + Math.floor(t[10]) + (t[12] ? t[12].replace(/^\//, "&") : "") : t[12] + "").replace(/\?/, "&") + "&output=" + (t[12] && t[12].indexOf("layer=c") > 0 ? "svembed" : "embed");
      }
    },
    gmap_search: {
      matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
      type: "iframe",
      url: function (t) {
        return "//maps.google." + t[2] + "/maps?q=" + t[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
      }
    }
  },
      n = function (e, n, o) {
    if (e) return o = o || "", "object" === t.type(o) && (o = t.param(o, !0)), t.each(n, function (t, n) {
      e = e.replace("$" + t, n || "");
    }), o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o), e;
  };

  t(document).on("objectNeedsType.fb", function (o, i, a) {
    var s,
        r,
        c,
        l,
        d,
        u,
        f,
        p = a.src || "",
        h = !1;
    s = t.extend(!0, {}, e, a.opts.media), t.each(s, function (e, o) {
      if (c = p.match(o.matcher)) {
        if (h = o.type, f = e, u = {}, o.paramPlace && c[o.paramPlace]) {
          d = c[o.paramPlace], "?" == d[0] && (d = d.substring(1)), d = d.split("&");

          for (var i = 0; i < d.length; ++i) {
            var s = d[i].split("=", 2);
            2 == s.length && (u[s[0]] = decodeURIComponent(s[1].replace(/\+/g, " ")));
          }
        }

        return l = t.extend(!0, {}, o.params, a.opts[e], u), p = "function" === t.type(o.url) ? o.url.call(this, c, l, a) : n(o.url, c, l), r = "function" === t.type(o.thumb) ? o.thumb.call(this, c, l, a) : n(o.thumb, c), "youtube" === e ? p = p.replace(/&t=((\d+)m)?(\d+)s/, function (t, e, n, o) {
          return "&start=" + ((n ? 60 * parseInt(n, 10) : 0) + parseInt(o, 10));
        }) : "vimeo" === e && (p = p.replace("&%23", "#")), !1;
      }
    }), h ? (a.opts.thumb || a.opts.$thumb && a.opts.$thumb.length || (a.opts.thumb = r), "iframe" === h && (a.opts = t.extend(!0, a.opts, {
      iframe: {
        preload: !1,
        attr: {
          scrolling: "no"
        }
      }
    })), t.extend(a, {
      type: h,
      src: p,
      origSrc: a.src,
      contentSource: f,
      contentType: "image" === h ? "image" : "gmap_place" == f || "gmap_search" == f ? "map" : "video"
    })) : p && (a.type = a.opts.defaultType);
  });
  var o = {
    youtube: {
      src: "https://www.youtube.com/iframe_api",
      class: "YT",
      loading: !1,
      loaded: !1
    },
    vimeo: {
      src: "https://player.vimeo.com/api/player.js",
      class: "Vimeo",
      loading: !1,
      loaded: !1
    },
    load: function (t) {
      var e,
          n = this;
      if (this[t].loaded) return void setTimeout(function () {
        n.done(t);
      });
      this[t].loading || (this[t].loading = !0, e = document.createElement("script"), e.type = "text/javascript", e.src = this[t].src, "youtube" === t ? window.onYouTubeIframeAPIReady = function () {
        n[t].loaded = !0, n.done(t);
      } : e.onload = function () {
        n[t].loaded = !0, n.done(t);
      }, document.body.appendChild(e));
    },
    done: function (e) {
      var n, o, i;
      "youtube" === e && delete window.onYouTubeIframeAPIReady, (n = t.fancybox.getInstance()) && (o = n.current.$content.find("iframe"), "youtube" === e && void 0 !== YT && YT ? i = new YT.Player(o.attr("id"), {
        events: {
          onStateChange: function (t) {
            0 == t.data && n.next();
          }
        }
      }) : "vimeo" === e && void 0 !== Vimeo && Vimeo && (i = new Vimeo.Player(o), i.on("ended", function () {
        n.next();
      })));
    }
  };
  t(document).on({
    "afterShow.fb": function (t, e, n) {
      e.group.length > 1 && ("youtube" === n.contentSource || "vimeo" === n.contentSource) && o.load(n.contentSource);
    }
  });
}(jQuery), function (t, e, n) {
  "use strict";

  var o = function () {
    return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function (e) {
      return t.setTimeout(e, 1e3 / 60);
    };
  }(),
      i = function () {
    return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function (e) {
      t.clearTimeout(e);
    };
  }(),
      a = function (e) {
    var n = [];
    e = e.originalEvent || e || t.e, e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];

    for (var o in e) e[o].pageX ? n.push({
      x: e[o].pageX,
      y: e[o].pageY
    }) : e[o].clientX && n.push({
      x: e[o].clientX,
      y: e[o].clientY
    });

    return n;
  },
      s = function (t, e, n) {
    return e && t ? "x" === n ? t.x - e.x : "y" === n ? t.y - e.y : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) : 0;
  },
      r = function (t) {
    if (t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || n.isFunction(t.get(0).onclick) || t.data("selectable")) return !0;

    for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++) if ("data-fancybox-" === o[e].nodeName.substr(0, 14)) return !0;

    return !1;
  },
      c = function (e) {
    var n = t.getComputedStyle(e)["overflow-y"],
        o = t.getComputedStyle(e)["overflow-x"],
        i = ("scroll" === n || "auto" === n) && e.scrollHeight > e.clientHeight,
        a = ("scroll" === o || "auto" === o) && e.scrollWidth > e.clientWidth;
    return i || a;
  },
      l = function (t) {
    for (var e = !1;;) {
      if (e = c(t.get(0))) break;
      if (t = t.parent(), !t.length || t.hasClass("fancybox-stage") || t.is("body")) break;
    }

    return e;
  },
      d = function (t) {
    var e = this;
    e.instance = t, e.$bg = t.$refs.bg, e.$stage = t.$refs.stage, e.$container = t.$refs.container, e.destroy(), e.$container.on("touchstart.fb.touch mousedown.fb.touch", n.proxy(e, "ontouchstart"));
  };

  d.prototype.destroy = function () {
    var t = this;
    t.$container.off(".fb.touch"), n(e).off(".fb.touch"), t.requestId && (i(t.requestId), t.requestId = null), t.tapped && (clearTimeout(t.tapped), t.tapped = null);
  }, d.prototype.ontouchstart = function (o) {
    var i = this,
        c = n(o.target),
        d = i.instance,
        u = d.current,
        f = u.$slide,
        p = u.$content,
        h = "touchstart" == o.type;

    if (h && i.$container.off("mousedown.fb.touch"), (!o.originalEvent || 2 != o.originalEvent.button) && f.length && c.length && !r(c) && !r(c.parent()) && (c.is("img") || !(o.originalEvent.clientX > c[0].clientWidth + c.offset().left))) {
      if (!u || d.isAnimating || u.$slide.hasClass("fancybox-animated")) return o.stopPropagation(), void o.preventDefault();
      i.realPoints = i.startPoints = a(o), i.startPoints.length && (u.touch && o.stopPropagation(), i.startEvent = o, i.canTap = !0, i.$target = c, i.$content = p, i.opts = u.opts.touch, i.isPanning = !1, i.isSwiping = !1, i.isZooming = !1, i.isScrolling = !1, i.canPan = d.canPan(), i.startTime = new Date().getTime(), i.distanceX = i.distanceY = i.distance = 0, i.canvasWidth = Math.round(f[0].clientWidth), i.canvasHeight = Math.round(f[0].clientHeight), i.contentLastPos = null, i.contentStartPos = n.fancybox.getTranslate(i.$content) || {
        top: 0,
        left: 0
      }, i.sliderStartPos = n.fancybox.getTranslate(f), i.stagePos = n.fancybox.getTranslate(d.$refs.stage), i.sliderStartPos.top -= i.stagePos.top, i.sliderStartPos.left -= i.stagePos.left, i.contentStartPos.top -= i.stagePos.top, i.contentStartPos.left -= i.stagePos.left, n(e).off(".fb.touch").on(h ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", n.proxy(i, "ontouchend")).on(h ? "touchmove.fb.touch" : "mousemove.fb.touch", n.proxy(i, "ontouchmove")), n.fancybox.isMobile && e.addEventListener("scroll", i.onscroll, !0), ((i.opts || i.canPan) && (c.is(i.$stage) || i.$stage.find(c).length) || (c.is(".fancybox-image") && o.preventDefault(), n.fancybox.isMobile && c.parents(".fancybox-caption").length)) && (i.isScrollable = l(c) || l(c.parent()), n.fancybox.isMobile && i.isScrollable || o.preventDefault(), (1 === i.startPoints.length || u.hasError) && (i.canPan ? (n.fancybox.stop(i.$content), i.isPanning = !0) : i.isSwiping = !0, i.$container.addClass("fancybox-is-grabbing")), 2 === i.startPoints.length && "image" === u.type && (u.isLoaded || u.$ghost) && (i.canTap = !1, i.isSwiping = !1, i.isPanning = !1, i.isZooming = !0, n.fancybox.stop(i.$content), i.centerPointStartX = .5 * (i.startPoints[0].x + i.startPoints[1].x) - n(t).scrollLeft(), i.centerPointStartY = .5 * (i.startPoints[0].y + i.startPoints[1].y) - n(t).scrollTop(), i.percentageOfImageAtPinchPointX = (i.centerPointStartX - i.contentStartPos.left) / i.contentStartPos.width, i.percentageOfImageAtPinchPointY = (i.centerPointStartY - i.contentStartPos.top) / i.contentStartPos.height, i.startDistanceBetweenFingers = s(i.startPoints[0], i.startPoints[1]))));
    }
  }, d.prototype.onscroll = function (t) {
    var n = this;
    n.isScrolling = !0, e.removeEventListener("scroll", n.onscroll, !0);
  }, d.prototype.ontouchmove = function (t) {
    var e = this;
    return void 0 !== t.originalEvent.buttons && 0 === t.originalEvent.buttons ? void e.ontouchend(t) : e.isScrolling ? void (e.canTap = !1) : (e.newPoints = a(t), void ((e.opts || e.canPan) && e.newPoints.length && e.newPoints.length && (e.isSwiping && !0 === e.isSwiping || t.preventDefault(), e.distanceX = s(e.newPoints[0], e.startPoints[0], "x"), e.distanceY = s(e.newPoints[0], e.startPoints[0], "y"), e.distance = s(e.newPoints[0], e.startPoints[0]), e.distance > 0 && (e.isSwiping ? e.onSwipe(t) : e.isPanning ? e.onPan() : e.isZooming && e.onZoom()))));
  }, d.prototype.onSwipe = function (e) {
    var a,
        s = this,
        r = s.instance,
        c = s.isSwiping,
        l = s.sliderStartPos.left || 0;
    if (!0 !== c) "x" == c && (s.distanceX > 0 && (s.instance.group.length < 2 || 0 === s.instance.current.index && !s.instance.current.opts.loop) ? l += Math.pow(s.distanceX, .8) : s.distanceX < 0 && (s.instance.group.length < 2 || s.instance.current.index === s.instance.group.length - 1 && !s.instance.current.opts.loop) ? l -= Math.pow(-s.distanceX, .8) : l += s.distanceX), s.sliderLastPos = {
      top: "x" == c ? 0 : s.sliderStartPos.top + s.distanceY,
      left: l
    }, s.requestId && (i(s.requestId), s.requestId = null), s.requestId = o(function () {
      s.sliderLastPos && (n.each(s.instance.slides, function (t, e) {
        var o = e.pos - s.instance.currPos;
        n.fancybox.setTranslate(e.$slide, {
          top: s.sliderLastPos.top,
          left: s.sliderLastPos.left + o * s.canvasWidth + o * e.opts.gutter
        });
      }), s.$container.addClass("fancybox-is-sliding"));
    });else if (Math.abs(s.distance) > 10) {
      if (s.canTap = !1, r.group.length < 2 && s.opts.vertical ? s.isSwiping = "y" : r.isDragging || !1 === s.opts.vertical || "auto" === s.opts.vertical && n(t).width() > 800 ? s.isSwiping = "x" : (a = Math.abs(180 * Math.atan2(s.distanceY, s.distanceX) / Math.PI), s.isSwiping = a > 45 && a < 135 ? "y" : "x"), "y" === s.isSwiping && n.fancybox.isMobile && s.isScrollable) return void (s.isScrolling = !0);
      r.isDragging = s.isSwiping, s.startPoints = s.newPoints, n.each(r.slides, function (t, e) {
        var o, i;
        n.fancybox.stop(e.$slide), o = n.fancybox.getTranslate(e.$slide), i = n.fancybox.getTranslate(r.$refs.stage), e.$slide.css({
          transform: "",
          opacity: "",
          "transition-duration": ""
        }).removeClass("fancybox-animated").removeClass(function (t, e) {
          return (e.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
        }), e.pos === r.current.pos && (s.sliderStartPos.top = o.top - i.top, s.sliderStartPos.left = o.left - i.left), n.fancybox.setTranslate(e.$slide, {
          top: o.top - i.top,
          left: o.left - i.left
        });
      }), r.SlideShow && r.SlideShow.isActive && r.SlideShow.stop();
    }
  }, d.prototype.onPan = function () {
    var t = this;
    if (s(t.newPoints[0], t.realPoints[0]) < (n.fancybox.isMobile ? 10 : 5)) return void (t.startPoints = t.newPoints);
    t.canTap = !1, t.contentLastPos = t.limitMovement(), t.requestId && i(t.requestId), t.requestId = o(function () {
      n.fancybox.setTranslate(t.$content, t.contentLastPos);
    });
  }, d.prototype.limitMovement = function () {
    var t,
        e,
        n,
        o,
        i,
        a,
        s = this,
        r = s.canvasWidth,
        c = s.canvasHeight,
        l = s.distanceX,
        d = s.distanceY,
        u = s.contentStartPos,
        f = u.left,
        p = u.top,
        h = u.width,
        g = u.height;
    return i = h > r ? f + l : f, a = p + d, t = Math.max(0, .5 * r - .5 * h), e = Math.max(0, .5 * c - .5 * g), n = Math.min(r - h, .5 * r - .5 * h), o = Math.min(c - g, .5 * c - .5 * g), l > 0 && i > t && (i = t - 1 + Math.pow(-t + f + l, .8) || 0), l < 0 && i < n && (i = n + 1 - Math.pow(n - f - l, .8) || 0), d > 0 && a > e && (a = e - 1 + Math.pow(-e + p + d, .8) || 0), d < 0 && a < o && (a = o + 1 - Math.pow(o - p - d, .8) || 0), {
      top: a,
      left: i
    };
  }, d.prototype.limitPosition = function (t, e, n, o) {
    var i = this,
        a = i.canvasWidth,
        s = i.canvasHeight;
    return n > a ? (t = t > 0 ? 0 : t, t = t < a - n ? a - n : t) : t = Math.max(0, a / 2 - n / 2), o > s ? (e = e > 0 ? 0 : e, e = e < s - o ? s - o : e) : e = Math.max(0, s / 2 - o / 2), {
      top: e,
      left: t
    };
  }, d.prototype.onZoom = function () {
    var e = this,
        a = e.contentStartPos,
        r = a.width,
        c = a.height,
        l = a.left,
        d = a.top,
        u = s(e.newPoints[0], e.newPoints[1]),
        f = u / e.startDistanceBetweenFingers,
        p = Math.floor(r * f),
        h = Math.floor(c * f),
        g = (r - p) * e.percentageOfImageAtPinchPointX,
        b = (c - h) * e.percentageOfImageAtPinchPointY,
        m = (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft(),
        v = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop(),
        y = m - e.centerPointStartX,
        x = v - e.centerPointStartY,
        w = l + (g + y),
        $ = d + (b + x),
        S = {
      top: $,
      left: w,
      scaleX: f,
      scaleY: f
    };
    e.canTap = !1, e.newWidth = p, e.newHeight = h, e.contentLastPos = S, e.requestId && i(e.requestId), e.requestId = o(function () {
      n.fancybox.setTranslate(e.$content, e.contentLastPos);
    });
  }, d.prototype.ontouchend = function (t) {
    var o = this,
        s = o.isSwiping,
        r = o.isPanning,
        c = o.isZooming,
        l = o.isScrolling;
    if (o.endPoints = a(t), o.dMs = Math.max(new Date().getTime() - o.startTime, 1), o.$container.removeClass("fancybox-is-grabbing"), n(e).off(".fb.touch"), e.removeEventListener("scroll", o.onscroll, !0), o.requestId && (i(o.requestId), o.requestId = null), o.isSwiping = !1, o.isPanning = !1, o.isZooming = !1, o.isScrolling = !1, o.instance.isDragging = !1, o.canTap) return o.onTap(t);
    o.speed = 100, o.velocityX = o.distanceX / o.dMs * .5, o.velocityY = o.distanceY / o.dMs * .5, r ? o.endPanning() : c ? o.endZooming() : o.endSwiping(s, l);
  }, d.prototype.endSwiping = function (t, e) {
    var o = this,
        i = !1,
        a = o.instance.group.length,
        s = Math.abs(o.distanceX),
        r = "x" == t && a > 1 && (o.dMs > 130 && s > 10 || s > 50);
    o.sliderLastPos = null, "y" == t && !e && Math.abs(o.distanceY) > 50 ? (n.fancybox.animate(o.instance.current.$slide, {
      top: o.sliderStartPos.top + o.distanceY + 150 * o.velocityY,
      opacity: 0
    }, 200), i = o.instance.close(!0, 250)) : r && o.distanceX > 0 ? i = o.instance.previous(300) : r && o.distanceX < 0 && (i = o.instance.next(300)), !1 !== i || "x" != t && "y" != t || o.instance.centerSlide(200), o.$container.removeClass("fancybox-is-sliding");
  }, d.prototype.endPanning = function () {
    var t,
        e,
        o,
        i = this;
    i.contentLastPos && (!1 === i.opts.momentum || i.dMs > 350 ? (t = i.contentLastPos.left, e = i.contentLastPos.top) : (t = i.contentLastPos.left + 500 * i.velocityX, e = i.contentLastPos.top + 500 * i.velocityY), o = i.limitPosition(t, e, i.contentStartPos.width, i.contentStartPos.height), o.width = i.contentStartPos.width, o.height = i.contentStartPos.height, n.fancybox.animate(i.$content, o, 366));
  }, d.prototype.endZooming = function () {
    var t,
        e,
        o,
        i,
        a = this,
        s = a.instance.current,
        r = a.newWidth,
        c = a.newHeight;
    a.contentLastPos && (t = a.contentLastPos.left, e = a.contentLastPos.top, i = {
      top: e,
      left: t,
      width: r,
      height: c,
      scaleX: 1,
      scaleY: 1
    }, n.fancybox.setTranslate(a.$content, i), r < a.canvasWidth && c < a.canvasHeight ? a.instance.scaleToFit(150) : r > s.width || c > s.height ? a.instance.scaleToActual(a.centerPointStartX, a.centerPointStartY, 150) : (o = a.limitPosition(t, e, r, c), n.fancybox.animate(a.$content, o, 150)));
  }, d.prototype.onTap = function (e) {
    var o,
        i = this,
        s = n(e.target),
        r = i.instance,
        c = r.current,
        l = e && a(e) || i.startPoints,
        d = l[0] ? l[0].x - n(t).scrollLeft() - i.stagePos.left : 0,
        u = l[0] ? l[0].y - n(t).scrollTop() - i.stagePos.top : 0,
        f = function (t) {
      var o = c.opts[t];
      if (n.isFunction(o) && (o = o.apply(r, [c, e])), o) switch (o) {
        case "close":
          r.close(i.startEvent);
          break;

        case "toggleControls":
          r.toggleControls();
          break;

        case "next":
          r.next();
          break;

        case "nextOrClose":
          r.group.length > 1 ? r.next() : r.close(i.startEvent);
          break;

        case "zoom":
          "image" == c.type && (c.isLoaded || c.$ghost) && (r.canPan() ? r.scaleToFit() : r.isScaledDown() ? r.scaleToActual(d, u) : r.group.length < 2 && r.close(i.startEvent));
      }
    };

    if ((!e.originalEvent || 2 != e.originalEvent.button) && (s.is("img") || !(d > s[0].clientWidth + s.offset().left))) {
      if (s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) o = "Outside";else if (s.is(".fancybox-slide")) o = "Slide";else {
        if (!r.current.$content || !r.current.$content.find(s).addBack().filter(s).length) return;
        o = "Content";
      }

      if (i.tapped) {
        if (clearTimeout(i.tapped), i.tapped = null, Math.abs(d - i.tapX) > 50 || Math.abs(u - i.tapY) > 50) return this;
        f("dblclick" + o);
      } else i.tapX = d, i.tapY = u, c.opts["dblclick" + o] && c.opts["dblclick" + o] !== c.opts["click" + o] ? i.tapped = setTimeout(function () {
        i.tapped = null, r.isAnimating || f("click" + o);
      }, 500) : f("click" + o);

      return this;
    }
  }, n(e).on("onActivate.fb", function (t, e) {
    e && !e.Guestures && (e.Guestures = new d(e));
  }).on("beforeClose.fb", function (t, e) {
    e && e.Guestures && e.Guestures.destroy();
  });
}(window, document, jQuery), function (t, e) {
  "use strict";

  e.extend(!0, e.fancybox.defaults, {
    btnTpl: {
      slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>'
    },
    slideShow: {
      autoStart: !1,
      speed: 3e3,
      progress: !0
    }
  });

  var n = function (t) {
    this.instance = t, this.init();
  };

  e.extend(n.prototype, {
    timer: null,
    isActive: !1,
    $button: null,
    init: function () {
      var t = this,
          n = t.instance,
          o = n.group[n.currIndex].opts.slideShow;
      t.$button = n.$refs.toolbar.find("[data-fancybox-play]").on("click", function () {
        t.toggle();
      }), n.group.length < 2 || !o ? t.$button.hide() : o.progress && (t.$progress = e('<div class="fancybox-progress"></div>').appendTo(n.$refs.inner));
    },
    set: function (t) {
      var n = this,
          o = n.instance,
          i = o.current;
      i && (!0 === t || i.opts.loop || o.currIndex < o.group.length - 1) ? n.isActive && "video" !== i.contentType && (n.$progress && e.fancybox.animate(n.$progress.show(), {
        scaleX: 1
      }, i.opts.slideShow.speed), n.timer = setTimeout(function () {
        o.current.opts.loop || o.current.index != o.group.length - 1 ? o.next() : o.jumpTo(0);
      }, i.opts.slideShow.speed)) : (n.stop(), o.idleSecondsCounter = 0, o.showControls());
    },
    clear: function () {
      var t = this;
      clearTimeout(t.timer), t.timer = null, t.$progress && t.$progress.removeAttr("style").hide();
    },
    start: function () {
      var t = this,
          e = t.instance.current;
      e && (t.$button.attr("title", (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"), t.isActive = !0, e.isComplete && t.set(!0), t.instance.trigger("onSlideShowChange", !0));
    },
    stop: function () {
      var t = this,
          e = t.instance.current;
      t.clear(), t.$button.attr("title", (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"), t.isActive = !1, t.instance.trigger("onSlideShowChange", !1), t.$progress && t.$progress.removeAttr("style").hide();
    },
    toggle: function () {
      var t = this;
      t.isActive ? t.stop() : t.start();
    }
  }), e(t).on({
    "onInit.fb": function (t, e) {
      e && !e.SlideShow && (e.SlideShow = new n(e));
    },
    "beforeShow.fb": function (t, e, n, o) {
      var i = e && e.SlideShow;
      o ? i && n.opts.slideShow.autoStart && i.start() : i && i.isActive && i.clear();
    },
    "afterShow.fb": function (t, e, n) {
      var o = e && e.SlideShow;
      o && o.isActive && o.set();
    },
    "afterKeydown.fb": function (n, o, i, a, s) {
      var r = o && o.SlideShow;
      !r || !i.opts.slideShow || 80 !== s && 32 !== s || e(t.activeElement).is("button,a,input") || (a.preventDefault(), r.toggle());
    },
    "beforeClose.fb onDeactivate.fb": function (t, e) {
      var n = e && e.SlideShow;
      n && n.stop();
    }
  }), e(t).on("visibilitychange", function () {
    var n = e.fancybox.getInstance(),
        o = n && n.SlideShow;
    o && o.isActive && (t.hidden ? o.clear() : o.set());
  });
}(document, jQuery), function (t, e) {
  "use strict";

  var n = function () {
    for (var e = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], n = {}, o = 0; o < e.length; o++) {
      var i = e[o];

      if (i && i[1] in t) {
        for (var a = 0; a < i.length; a++) n[e[0][a]] = i[a];

        return n;
      }
    }

    return !1;
  }();

  if (n) {
    var o = {
      request: function (e) {
        e = e || t.documentElement, e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT);
      },
      exit: function () {
        t[n.exitFullscreen]();
      },
      toggle: function (e) {
        e = e || t.documentElement, this.isFullscreen() ? this.exit() : this.request(e);
      },
      isFullscreen: function () {
        return Boolean(t[n.fullscreenElement]);
      },
      enabled: function () {
        return Boolean(t[n.fullscreenEnabled]);
      }
    };
    e.extend(!0, e.fancybox.defaults, {
      btnTpl: {
        fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>'
      },
      fullScreen: {
        autoStart: !1
      }
    }), e(t).on(n.fullscreenchange, function () {
      var t = o.isFullscreen(),
          n = e.fancybox.getInstance();
      n && (n.current && "image" === n.current.type && n.isAnimating && (n.isAnimating = !1, n.update(!0, !0, 0), n.isComplete || n.complete()), n.trigger("onFullscreenChange", t), n.$refs.container.toggleClass("fancybox-is-fullscreen", t), n.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter", !t).toggleClass("fancybox-button--fsexit", t));
    });
  }

  e(t).on({
    "onInit.fb": function (t, e) {
      var i;
      if (!n) return void e.$refs.toolbar.find("[data-fancybox-fullscreen]").remove();
      e && e.group[e.currIndex].opts.fullScreen ? (i = e.$refs.container, i.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function (t) {
        t.stopPropagation(), t.preventDefault(), o.toggle();
      }), e.opts.fullScreen && !0 === e.opts.fullScreen.autoStart && o.request(), e.FullScreen = o) : e && e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();
    },
    "afterKeydown.fb": function (t, e, n, o, i) {
      e && e.FullScreen && 70 === i && (o.preventDefault(), e.FullScreen.toggle());
    },
    "beforeClose.fb": function (t, e) {
      e && e.FullScreen && e.$refs.container.hasClass("fancybox-is-fullscreen") && o.exit();
    }
  });
}(document, jQuery), function (t, e) {
  "use strict";

  var n = "fancybox-thumbs";
  e.fancybox.defaults = e.extend(!0, {
    btnTpl: {
      thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>'
    },
    thumbs: {
      autoStart: !1,
      hideOnClose: !0,
      parentEl: ".fancybox-container",
      axis: "y"
    }
  }, e.fancybox.defaults);

  var o = function (t) {
    this.init(t);
  };

  e.extend(o.prototype, {
    $button: null,
    $grid: null,
    $list: null,
    isVisible: !1,
    isActive: !1,
    init: function (t) {
      var e = this,
          n = t.group,
          o = 0;
      e.instance = t, e.opts = n[t.currIndex].opts.thumbs, t.Thumbs = e, e.$button = t.$refs.toolbar.find("[data-fancybox-thumbs]");

      for (var i = 0, a = n.length; i < a && (n[i].thumb && o++, !(o > 1)); i++);

      o > 1 && e.opts ? (e.$button.removeAttr("style").on("click", function () {
        e.toggle();
      }), e.isActive = !0) : e.$button.hide();
    },
    create: function () {
      var t,
          o = this,
          i = o.instance,
          a = o.opts.parentEl,
          s = [];
      o.$grid || (o.$grid = e('<div class="' + n + " " + n + "-" + o.opts.axis + '"></div>').appendTo(i.$refs.container.find(a).addBack().filter(a)), o.$grid.on("click", "a", function () {
        i.jumpTo(e(this).attr("data-index"));
      })), o.$list || (o.$list = e('<div class="' + n + '__list">').appendTo(o.$grid)), e.each(i.group, function (e, n) {
        t = n.thumb, t || "image" !== n.type || (t = n.src), s.push('<a href="javascript:;" tabindex="0" data-index="' + e + '"' + (t && t.length ? ' style="background-image:url(' + t + ')"' : 'class="fancybox-thumbs-missing"') + "></a>");
      }), o.$list[0].innerHTML = s.join(""), "x" === o.opts.axis && o.$list.width(parseInt(o.$grid.css("padding-right"), 10) + i.group.length * o.$list.children().eq(0).outerWidth(!0));
    },
    focus: function (t) {
      var e,
          n,
          o = this,
          i = o.$list,
          a = o.$grid;
      o.instance.current && (e = i.children().removeClass("fancybox-thumbs-active").filter('[data-index="' + o.instance.current.index + '"]').addClass("fancybox-thumbs-active"), n = e.position(), "y" === o.opts.axis && (n.top < 0 || n.top > i.height() - e.outerHeight()) ? i.stop().animate({
        scrollTop: i.scrollTop() + n.top
      }, t) : "x" === o.opts.axis && (n.left < a.scrollLeft() || n.left > a.scrollLeft() + (a.width() - e.outerWidth())) && i.parent().stop().animate({
        scrollLeft: n.left
      }, t));
    },
    update: function () {
      var t = this;
      t.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible), t.isVisible ? (t.$grid || t.create(), t.instance.trigger("onThumbsShow"), t.focus(0)) : t.$grid && t.instance.trigger("onThumbsHide"), t.instance.update();
    },
    hide: function () {
      this.isVisible = !1, this.update();
    },
    show: function () {
      this.isVisible = !0, this.update();
    },
    toggle: function () {
      this.isVisible = !this.isVisible, this.update();
    }
  }), e(t).on({
    "onInit.fb": function (t, e) {
      var n;
      e && !e.Thumbs && (n = new o(e), n.isActive && !0 === n.opts.autoStart && n.show());
    },
    "beforeShow.fb": function (t, e, n, o) {
      var i = e && e.Thumbs;
      i && i.isVisible && i.focus(o ? 0 : 250);
    },
    "afterKeydown.fb": function (t, e, n, o, i) {
      var a = e && e.Thumbs;
      a && a.isActive && 71 === i && (o.preventDefault(), a.toggle());
    },
    "beforeClose.fb": function (t, e) {
      var n = e && e.Thumbs;
      n && n.isVisible && !1 !== n.opts.hideOnClose && n.$grid.hide();
    }
  });
}(document, jQuery), function (t, e) {
  "use strict";

  function n(t) {
    var e = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };
    return String(t).replace(/[&<>"'`=\/]/g, function (t) {
      return e[t];
    });
  }

  e.extend(!0, e.fancybox.defaults, {
    btnTpl: {
      share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>'
    },
    share: {
      url: function (t, e) {
        return !t.currentHash && "inline" !== e.type && "html" !== e.type && (e.origSrc || e.src) || window.location;
      },
      tpl: '<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'
    }
  }), e(t).on("click", "[data-fancybox-share]", function () {
    var t,
        o,
        i = e.fancybox.getInstance(),
        a = i.current || null;
    a && ("function" === e.type(a.opts.share.url) && (t = a.opts.share.url.apply(a, [i, a])), o = a.opts.share.tpl.replace(/\{\{media\}\}/g, "image" === a.type ? encodeURIComponent(a.src) : "").replace(/\{\{url\}\}/g, encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g, n(t)).replace(/\{\{descr\}\}/g, i.$caption ? encodeURIComponent(i.$caption.text()) : ""), e.fancybox.open({
      src: i.translate(i, o),
      type: "html",
      opts: {
        touch: !1,
        animationEffect: !1,
        afterLoad: function (t, e) {
          i.$refs.container.one("beforeClose.fb", function () {
            t.close(null, 0);
          }), e.$content.find(".fancybox-share__button").click(function () {
            return window.open(this.href, "Share", "width=550, height=450"), !1;
          });
        },
        mobile: {
          autoFocus: !1
        }
      }
    }));
  });
}(document, jQuery), function (t, e, n) {
  "use strict";

  function o() {
    var e = t.location.hash.substr(1),
        n = e.split("-"),
        o = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ? parseInt(n.pop(-1), 10) || 1 : 1,
        i = n.join("-");
    return {
      hash: e,
      index: o < 1 ? 1 : o,
      gallery: i
    };
  }

  function i(t) {
    "" !== t.gallery && n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']").eq(t.index - 1).focus().trigger("click.fb-start");
  }

  function a(t) {
    var e, n;
    return !!t && (e = t.current ? t.current.opts : t.opts, "" !== (n = e.hash || (e.$orig ? e.$orig.data("fancybox") || e.$orig.data("fancybox-trigger") : "")) && n);
  }

  n.escapeSelector || (n.escapeSelector = function (t) {
    return (t + "").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, function (t, e) {
      return e ? "\0" === t ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t;
    });
  }), n(function () {
    !1 !== n.fancybox.defaults.hash && (n(e).on({
      "onInit.fb": function (t, e) {
        var n, i;
        !1 !== e.group[e.currIndex].opts.hash && (n = o(), (i = a(e)) && n.gallery && i == n.gallery && (e.currIndex = n.index - 1));
      },
      "beforeShow.fb": function (n, o, i, s) {
        var r;
        i && !1 !== i.opts.hash && (r = a(o)) && (o.currentHash = r + (o.group.length > 1 ? "-" + (i.index + 1) : ""), t.location.hash !== "#" + o.currentHash && (s && !o.origHash && (o.origHash = t.location.hash), o.hashTimer && clearTimeout(o.hashTimer), o.hashTimer = setTimeout(function () {
          "replaceState" in t.history ? (t.history[s ? "pushState" : "replaceState"]({}, e.title, t.location.pathname + t.location.search + "#" + o.currentHash), s && (o.hasCreatedHistory = !0)) : t.location.hash = o.currentHash, o.hashTimer = null;
        }, 300)));
      },
      "beforeClose.fb": function (n, o, i) {
        i && !1 !== i.opts.hash && (clearTimeout(o.hashTimer), o.currentHash && o.hasCreatedHistory ? t.history.back() : o.currentHash && ("replaceState" in t.history ? t.history.replaceState({}, e.title, t.location.pathname + t.location.search + (o.origHash || "")) : t.location.hash = o.origHash), o.currentHash = null);
      }
    }), n(t).on("hashchange.fb", function () {
      var t = o(),
          e = null;
      n.each(n(".fancybox-container").get().reverse(), function (t, o) {
        var i = n(o).data("FancyBox");
        if (i && i.currentHash) return e = i, !1;
      }), e ? e.currentHash === t.gallery + "-" + t.index || 1 === t.index && e.currentHash == t.gallery || (e.currentHash = null, e.close()) : "" !== t.gallery && i(t);
    }), setTimeout(function () {
      n.fancybox.getInstance() || i(o());
    }, 50));
  });
}(window, document, jQuery), function (t, e) {
  "use strict";

  var n = new Date().getTime();
  e(t).on({
    "onInit.fb": function (t, e, o) {
      e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function (t) {
        var o = e.current,
            i = new Date().getTime();
        e.group.length < 2 || !1 === o.opts.wheel || "auto" === o.opts.wheel && "image" !== o.type || (t.preventDefault(), t.stopPropagation(), o.$slide.hasClass("fancybox-animated") || (t = t.originalEvent || t, i - n < 250 || (n = i, e[(-t.deltaY || -t.deltaX || t.wheelDelta || -t.detail) < 0 ? "next" : "previous"]())));
      });
    }
  });
}(document, jQuery);
(function ($) {
  jQuery(document).ready(function () {
    setTimeout(function () {
      $(".page-wrapper").css({
        "padding-top": $("#top-bars").height()
      });
    }, 600); // Sticky header

    jQuery(window).scroll(function () {
      if ($(this).scrollTop() > 60) {
        $('#menu_area').addClass("sticky");
      } else {
        $('#menu_area').removeClass("sticky");
      }
    });

    if (
    /*@cc_on!@*/
    true) {
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
    }); //Delay click to 45s for Quick Quote Side Tab

    setTimeout(function () {
      $(".sticky-popup .popup-header").trigger('click');
    }, 45000);
    $('#cookie-notice').addClass('slide-up');
    $('#close-notice, #accept-cookie').click(function (e) {
      e.preventDefault();
      $("#cookie-notice").removeClass("slide-up");
      $("#cookie-notice").addClass("slide-down");
    });
    $(document).ready(function () {
      $('#faq__accordion .faq-wrap:first-of-type > div').css('display', 'block');
      $('#faq__accordion .faq-wrap:first-of-type > h3').addClass('active');
      $("#faq__accordion .faq-wrap > h3").on("click", function (e) {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(this).siblings("#faq__accordion .faq-wrap > div").slideUp(200);
        } else {
          $("#faq__accordion .faq-wrap > h3").removeClass("active");
          $(this).addClass("active");
          $("#faq__accordion .faq-wrap > div").slideUp(200);
          $(this).siblings("#faq__accordion .faq-wrap > div").slideDown(200);
        }

        e.preventDefault();
      });
    });
    $(".default-accordion .faq-box > h4").on("click", function (e) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this).siblings(".default-accordion .faq-box div").slideUp(200);
      } else {
        $(".default-accordion .faq-box > h4").removeClass("active");
        $(this).addClass("active");
        $(".default-accordion .faq-box div").slideUp(200);
        $(this).siblings(".default-accordion .faq-box div").slideDown(200);
      }

      e.preventDefault();
    }); // desktop multilevel menu

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
    }); // Menu

    $('#mobile-menu--btn a').click(function () {
      $('.main-menu-sidebar').addClass("menu-active");
      $('.menu-overlay').addClass("active-overlay");
      $(this).toggleClass('open');
    }); // Menu

    $('.close-menu-btn').click(function () {
      $('.main-menu-sidebar').removeClass("menu-active");
      $('.menu-overlay').removeClass("active-overlay");
    });
    $(function () {
      var menu_ul = $('.nav-links > li.has-menu  ul'),
          menu_a = $('.nav-links > li.has-menu  small');
      menu_ul.hide();
      menu_a.click(function (e) {
        e.preventDefault();

        if (!$(this).hasClass('active')) {
          menu_a.removeClass('active');
          menu_ul.filter(':visible').slideUp('normal');
          $(this).addClass('active').next().stop(true, true).slideDown('normal');
        } else {
          $(this).removeClass('active');
          $(this).next().stop(true, true).slideUp('normal');
        }
      });
    });
    $(".nav-links > li.has-menu  small ").attr("href", "javascript:;");
    var $menu = $('#menu');
    $(document).mouseup(function (e) {
      if (!$menu.is(e.target) // if the target of the click isn't the container...
      && $menu.has(e.target).length === 0) // ... nor a descendant of the container
        {
          $menu.removeClass('menu-active');
          $('.menu-overlay').removeClass("active-overlay");
        }
    }); // date picker

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
          var highlight = date >= date1 && date <= date2;
          var highlight2 = date >= date3 && date <= date4;
          var highlight3 = date >= date5 && date <= date6;

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
    $('.full-content a').attr("target", "_blank"); // Fancybox

    $('#gallery-page [data-fancybox="gallery"]').fancybox();
    $('#blog-page .blog-photo [data-fancybox="gallery"]').fancybox(); //$('#top-cta .features-list .feature-box h3').matchHeight();
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
      }, {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 8000
        }
      }, {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: false,
          infinite: false,
          autoplaySpeed: 8000
        }
      }]
    }); //modal

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
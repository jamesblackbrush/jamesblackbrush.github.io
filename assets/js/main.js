/*
	Big Picture by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $header = $("#header"),
    $all = $body.add($header);

  // Prevent browsers from restoring scroll position on refresh.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("pageshow", function () {
    window.scrollTo(0, 0);
  });

  // Breakpoints.
  breakpoints({
    xxlarge: ["1681px", "1920px"],
    xlarge: ["1281px", "1680px"],
    large: ["1001px", "1280px"],
    medium: ["737px", "1000px"],
    small: ["481px", "736px"],
    xsmall: [null, "480px"],
  });

  // Play initial animations on page load.
  // Always remove `is-preload` shortly after load so content renders on mobile.
  // For touch/mobile, start the section animations 1s after the down-arrow is clicked
  // by removing the 'inactive' class from sections (so they become visible).
  $window.on("load", function () {
    setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);

    if ($body.hasClass("is-touch")) {
      $(".button.down").one("click", function () {
        setTimeout(function () {
          $(".gallery, .main.style1, .main.style2, #contact").removeClass(
            "inactive",
          );
        }, 500);
      });
    }
    // When the down-arrow is clicked on touch devices, schedule a dissolve sequence.
    if ($body.hasClass("is-touch")) {
      $(".button.down").on("click", function (e) {
        var $articles = $(".gallery article");
        $articles.each(function (i, el) {
          setTimeout(
            function () {
              $(el).addClass("dissolve-in");
            },
            500 + i * 500,
          );
        });
      });
    }

    // Reveal the splash video after a short load delay.
    var $intro = $("#intro"),
      $introVideo = $("#intro-video"),
      introVideoEl = $introVideo[0],
      videoReady = false;

    if (introVideoEl) {
      $introVideo.on("canplaythrough loadeddata", function () {
        videoReady = true;
      });

      setTimeout(function () {
        if (videoReady || introVideoEl.readyState >= 3) {
          showIntroVideo();
        } else {
          $introVideo.one("canplaythrough loadeddata", showIntroVideo);
        }
      }, 2000);

      function showIntroVideo() {
        if (!$intro.hasClass("video-ready")) {
          $intro.addClass("video-ready");
        }
        if (introVideoEl && introVideoEl.paused) {
          introVideoEl.currentTime = 0;
          introVideoEl.play().catch(function () {
            // Autoplay may be blocked in some browsers, but the class will still reveal the video.
          });
        }
      }
    }
  });

  // Touch mode.
  if (browser.mobile) $body.addClass("is-touch");
  else {
    breakpoints.on("<=small", function () {
      $body.addClass("is-touch");
    });

    breakpoints.on(">small", function () {
      $body.removeClass("is-touch");
    });
  }

  // Fix: IE flexbox fix.
  if (browser.name == "ie") {
    var $main = $(".main.fullscreen"),
      IEResizeTimeout;

    $window
      .on("resize.ie-flexbox-fix", function () {
        clearTimeout(IEResizeTimeout);

        IEResizeTimeout = setTimeout(function () {
          var wh = $window.height();

          $main.each(function () {
            var $this = $(this);

            $this.css("height", "");

            if ($this.height() <= wh) $this.css("height", wh - 50 + "px");
          });
        });
      })
      .triggerHandler("resize.ie-flexbox-fix");
  }

  // Gallery - Initialize independent lightboxes for each panel
  // Each panel click opens its own unique lightbox with custom images
  $window.on("load", function () {
    // Common Poptrox settings for all galleries
    var poptroxSettings = {
      baseZIndex: 10001,
      useBodyOverflow: false,
      usePopupEasyClose: false,
      overlayColor: "#1f2328",
      overlayOpacity: 0.65,
      usePopupDefaultStyling: false,
      usePopupCaption: true,
      popupLoaderText: "",
      windowMargin: 50,
      usePopupNav: true,
    };

    // Custom settings for each gallery with a bottom link overlay
    function makeGallerySettings($gallery) {
      return $.extend({}, poptroxSettings, {
        usePopupCaption: false,
        onPopupOpen: function () {
          var $popup = $(".poptrox-popup");
          $popup.find(".gallery-caption-link").remove();
          var href = $gallery.data("link-href") || "consistent.html";
          var label = $gallery.data("link-text") || "Go to consistent.html";
          $popup.append(
            '<div class="gallery-caption-link"><a href="' +
              href +
              '">' +
              label +
              "</a></div>",
          );
        },
      });
    }

    // Initialize Poptrox on each off-screen gallery
    // This creates separate lightboxes for each panel
    $("#gallery-1").poptrox(makeGallerySettings($("#gallery-1")));
    $("#gallery-2").poptrox(makeGallerySettings($("#gallery-2")));
    $("#gallery-3").poptrox(makeGallerySettings($("#gallery-3")));
    $("#gallery-4").poptrox(makeGallerySettings($("#gallery-4")));

    // Handle panel clicks to open the corresponding gallery lightbox
    $(".gallery-trigger").on("click", function (e) {
      e.preventDefault();
      var galleryId = $(this).data("gallery");
      var $gallery = $("#gallery-" + galleryId);

      // Trigger the first image in the gallery to open the lightbox
      if ($gallery.find("a").length > 0) {
        $gallery.find("a").first().trigger("click");
      }
    });

    // Handle responsive window margin adjustments for all galleries
    breakpoints.on(">small", function () {
      $("#gallery-1, #gallery-2, #gallery-3, #gallery-4").each(function () {
        if (this._poptrox) {
          this._poptrox.windowMargin = 50;
        }
      });
    });

    breakpoints.on("<=small", function () {
      $("#gallery-1, #gallery-2, #gallery-3, #gallery-4").each(function () {
        if (this._poptrox) {
          this._poptrox.windowMargin = 5;
        }
      });
    });
  });

  // Section transitions.
  if (browser.canUse("transition")) {
    var on = function () {
      // Galleries.
      $(".gallery").scrollex({
        top: "30vh",
        bottom: "30vh",
        delay: 50,
        initialize: function () {
          $(this).addClass("inactive");
        },
        terminate: function () {
          $(this).removeClass("inactive");
        },
        enter: function () {
          $(this).removeClass("inactive");
        },
        leave: function () {
          $(this).addClass("inactive");
        },
      });

      // Generic sections.
      $(".main.style1").scrollex({
        mode: "middle",
        delay: 100,
        initialize: function () {
          $(this).addClass("inactive");
        },
        terminate: function () {
          $(this).removeClass("inactive");
        },
        enter: function () {
          $(this).removeClass("inactive");
        },
        leave: function () {
          $(this).addClass("inactive");
        },
      });

      $(".main.style2").scrollex({
        mode: "middle",
        delay: 100,
        initialize: function () {
          $(this).addClass("inactive");
        },
        terminate: function () {
          $(this).removeClass("inactive");
        },
        enter: function () {
          $(this).removeClass("inactive");
        },
        leave: function () {
          $(this).addClass("inactive");
        },
      });

      // Contact.
      $("#contact").scrollex({
        top: "50%",
        delay: 50,
        initialize: function () {
          $(this).addClass("inactive");
        },
        terminate: function () {
          $(this).removeClass("inactive");
        },
        enter: function () {
          $(this).removeClass("inactive");
        },
        leave: function () {
          $(this).addClass("inactive");
        },
      });
    };

    var off = function () {
      // Galleries.
      $(".gallery").unscrollex();

      // Generic sections.
      $(".main.style1").unscrollex();

      $(".main.style2").unscrollex();

      // Contact.
      $("#contact").unscrollex();
    };

    // only disable animations for the smallest screens
    breakpoints.on("<=xsmall", off);
    breakpoints.on(">xsmall", on);
  }

  // Events.
  var resizeTimeout, resizeScrollTimeout;

  $window
    .on("resize", function () {
      // Disable animations/transitions.
      $body.addClass("is-resizing");

      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function () {
        // Update scrolly links.
        $('a[href^="#"]').scrolly({
          speed: 1500,
          offset: $header.length ? $header.outerHeight() - 1 : 0,
        });

        // Re-enable animations/transitions.
        setTimeout(function () {
          $body.removeClass("is-resizing");
          $window.trigger("scroll");
        }, 0);
      }, 100);
    })
    .on("load", function () {
      $window.trigger("resize");
    });
})(jQuery);

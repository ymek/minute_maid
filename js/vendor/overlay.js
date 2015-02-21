jQuery(function($) {
    'use strict';

    window.Overlay = {
        init: function() {
            this.$triggerBttn = $('#trigger-menu');
            this.$overlay = $('div.overlay');
            this.$closeBttn = $(this.$overlay, 'button.overlay-close');
            this.transEndEventNames = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'
            };
            this.transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];
            this.support = { transitions : Modernizr.csstransitions };

            // TODO: Investigate whether these leave orphan event handlers/references
            this.$triggerBttn.on('click', this.toggleOverlay);
            this.$closeBttn.on('click', this.toggleOverlay);
        },
        toggleOverlay: function() {
            // Click event handler; can safely reference window.Overlay
            if (Overlay.$overlay.hasClass('open')) {
                Overlay.$overlay.removeClass('open');
                Overlay.$overlay.addClass('close');
                var onEndTransitionFn = function(ev) {
                    var originalEvent = ev.originalEvent;

                    if (Overlay.support.transitions) {
                        if (originalEvent.propertyName !== 'visibility') {
                          return;
                        }
                        this.removeEventListener(Overlay.transEndEventName, onEndTransitionFn);
                    }
                    Overlay.$overlay.removeClass('close');
                };
                if (Overlay.support.transitions) {
                    Overlay.$overlay.on(Overlay.transEndEventName, onEndTransitionFn);
                }
                else {
                    onEndTransitionFn();
                }
            }
            else if (!Overlay.$overlay.hasClass('close')) {
                Overlay.$overlay.addClass('open');
            }
        }
    };
});

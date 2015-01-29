jQuery(function($) {
    'use strict';

    //
    // Global API Object
    //  - Make requests to external JSON resources
    //
    //  NOTE: Refactor before implementing actions with simultaneous
    //        API requests
    //

    window.Api = {
        lastResultData: null,
        load: function(endpoint) {
            var request = $.getJSON(endpoint).then(function(data) {
                Api.lastResultData = data;
            });
            return request;
        }
    };

    //
    // Global Application Object
    //  - Manages state of page elements, routing, and rendering of API
    //    responses
    //

    window.App = {
        init: function() {
            this.pageHeader = {};
            this.pageFooter = {};
            this.dataHeader = {};
            this.datasets = [];
            this.summary = '';
            this.cacheElements();
            this.mobileArrows();

            var currentRoute = window.location.hash.slice(1);
            if (currentRoute.length < 2) {
                this.renderIndexNav();
            }

            Router({
                '/:resource/:dataset': function(resource, dataset) {
                    this.endpoint = '/api/' + resource + '/' + dataset;
                    this.renderDataFromEndpoint(this.endpoint);
                }.bind(this)
            })
            .configure({
                notfound: function() {
                    this.renderIndexNav();
                }.bind(this)
            })
            .init(currentRoute);
        },
        renderDataFromEndpoint: function(endpoint) {
            $.when(Api.load(endpoint)).done(function() {
                this.summary = Api.lastResultData['summary'];
                this.datasets = Api.lastResultData['datasets'];
                this.pageHeader = Api.lastResultData['page_header'];
                this.pageFooter = Api.lastResultData['page_footer'];
                this.dataHeader = Api.lastResultData['data_header'];
                this.cacheViewElements();
                this.render();
            }.bind(this));
        },
        cacheViewElements: function() {
            this.navViewTemplate = Handlebars.compile($('#nav-view-template').html());
            this.footerViewTemplate = Handlebars.compile($('#footer-view-template').html());
            this.brandSummaryTemplate = Handlebars.compile($('#brand-summary-template').html());
            this.brandViewTemplate = Handlebars.compile($('#brand-view-template').html());
            this.datasetTemplate = Handlebars.compile($('#dataset-template').html());
        },
        render: function() {
            var headerTitle = this.endpoint.split('/').pop(-1).replace('-', ' ')
            var navViewContext = {
                'header_title_category': this.pageHeader['category'],
                'header_title_period': this.pageHeader['period'],
                'header_title_report': headerTitle.replace('-', ' '),
                'header_mobile_nav_title': headerTitle
            };
            this.$navView.html(this.navViewTemplate(navViewContext));

            var footerViewContext = {
              date_summary: this.pageFooter['date_summary'],
              notes: this.pageFooter['notes']
            };
            this.$footerView.html(this.footerViewTemplate(footerViewContext));

            if (this.endpoint.lastIndexOf('summary') > 0) {
                var brandSummaryContext = { 'summary': this.summary };
                this.$brandView.html(this.brandSummaryTemplate(brandSummaryContext));
            } else {
                var brandViewContext = {
                    'percentage_header': this.dataHeader['percentage_header'],
                    'delta_month_header': this.dataHeader['delta_month_header'],
                    'delta_stly_header': this.dataHeader['delta_stly_header']
                };
                this.$brandView.html(this.brandViewTemplate(brandViewContext));
            }

            // ensure fresh object cache for selectors inside the template
            this.$overlayNavView = $('#overlay-nav-view');
            this.$brandViewTable = $('#brand-view-table');

            this.$overlayNavView.html(this.overlayNavViewTemplate());
            this.$brandViewTable.append(this.datasetTemplate(this.datasets));

            // (re-)bind events
            this.bindEventHandlers();
        },
        cacheElements: function() {
            this.$navView = $('#nav-view');
            this.$brandView = $('#brand-view');
            this.$footerView = $('#footer-view');
            this.$arrows = $('.arrow');
            this.$arrowLeft = $('#arrow-left');
            this.$arrowRight = $('#arrow-right');
            this.indexNavViewTemplate = Handlebars.compile($('#index-nav-view-template').html());
            this.overlayNavViewTemplate = Handlebars.compile($('#overlay-nav-view-template').html());
        },
        renderIndexNav: function() {
            $.when(Api.load('/api/index.json')).done(function() {
                var indexNavViewContext = {
                    date_range: Api.lastResultData['date_range'],
                    logo_image: Api.lastResultData['logo_image'],
                    headline: Api.lastResultData['headline']
                };
                this.$navView.html(this.indexNavViewTemplate(indexNavViewContext));
                this.$brandView.html('');
                this.$footerView.html('');
            }.bind(this));
        },
        bindEventHandlers: function() {
          // overlay javascript
          Overlay.init();

          // 'sticky' nav - nonexistent on summary pages
          if (this.endpoint.lastIndexOf('summary') < 0) {
              $(window).scroll(this.stickyHandler);
              this.stickyHandler();
          }

          // Mobile left/right 'swipe' arrows (mimics swipe handler)
          this.$arrowLeft.unbind('click').on('click', function(clickEvt) {
              clickEvt.preventDefault();
              this.swipeHandler(new Event('swiperight'));
          }.bind(this));

          this.$arrowRight.unbind('click').on('click', function(clickEvt) {
              clickEvt.preventDefault();
              this.swipeHandler(new Event('swipeleft'));
          }.bind(this));

          // swipe actions
          var hammerManager = new Hammer.Manager(this.$brandView[0]);
          hammerManager.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }));
          hammerManager.on('swipeleft swiperight', this.swipeHandler);
        },
        swipeHandler: function(evt) {
            var navElement = $('nav.stat-nav .active').parent();
            var nextLink = (evt.type == 'swipeleft') ? navElement.next() : navElement.prev();

            if (nextLink[0] !== undefined) {
                var newLocation = nextLink.children().attr('href');
                window.location = newLocation;
            }
        },
        stickyHandler: function() {
            var containerWidth = $('.container').width();
            var windowTop = $(window).scrollTop();
            var anchorTop = $('div.table-header-anchor').offset().top;
            var tableHeader = $('div.table-header');
            var tableText = $('p', tableHeader);
            var textDarkColor = '#6e6f71';
            var textOriginalColor = '#bfbfbf';

            if (windowTop > anchorTop) {
                tableHeader.css('width', containerWidth);
                tableText.css('color', textDarkColor);
                tableHeader.addClass('stick');
            }
            else {
                tableHeader.removeClass('stick');
                tableText.css('color', textOriginalColor);
            }
        },
        mobileArrows: function() {
            var middleOfWindow = $(window).height() / 2;
            this.$arrows.css('margin-top', middleOfWindow);
        }
    };

    App.init();
});

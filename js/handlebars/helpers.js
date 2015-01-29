jQuery(function($) {
    'use strict';

    //
    // Handlebars Helpers
    //

    Handlebars.registerHelper('report-type-link', function(endpoint) {
        var text = endpoint;
        // NOTE: We tack 'awareness' on to make routing cleaner, and to
        // 'automagically' load the initial data view page
        var result = '<a href="#/' + endpoint + '/awareness">' + text.replace('-', ' ') + '</a>';

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('brand-view-link', function(endpoint) {
        var newPath = '';
        var css = '';
        var text = endpoint;
        var currentRoute = window.location.hash.slice(1);
        var baseRoute = currentRoute.slice(0, currentRoute.lastIndexOf('/'));

        if (currentRoute.substring(baseRoute.length).slice(1) == endpoint) {
            css = 'class="active"'
        }
        if (baseRoute.length < 2) {
            baseRoute = currentRoute;
        }
        newPath = baseRoute + '/' + endpoint;

        var result = '<a href="#' + newPath + '" ' + css + '>' + text.replace('-', ' ') + '</a>';

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('delta-view-row', function(delta) {
      var value = parseInt(delta['value']);
      var cssClass = delta['change'];
      var sign = (value > 0) ? '+' : '';

      return '<h6 class="' + cssClass + '">' + sign + value + '</h6>';
    });
});

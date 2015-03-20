jQuery(function($) {
    'use strict';

    //
    // Handlebars Helpers
    //

    Handlebars.registerHelper('report-type-link', function(endpoint) {
        var text = endpoint;
        // NOTE: We tack on 'awareness' to make routing cleaner, and to
        // 'automagically' load the initial data view page
        var result = '<a href="#/' + endpoint + '/awareness">' + text.replace('-', ' ') + '</a>';

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('report-subnav', function(endpoint) {
        var html = '<li>\n';
        html += '<a href="#">' + endpoint.replace('-', ' ') + '</a>\n';
        html += '<ul>\n';
        $.each(
            [
                'awareness',
                'consideration',
                'brand-imagery',
                'brand-personality',
                'summary'
            ],
            function(_, value) {
              var text = value.replace('-', ' ');
              html += '\t<li><a href="#/' + endpoint + '/' + value + '">' + text + '</a></li>\n';
            }
        );
        html += '</ul>\n';
        html += '</li>\n';

        return new Handlebars.SafeString(html);
    });

    Handlebars.registerHelper('brand-view-link', function(endpoint) {
        var newPath = '';
        var css = '';
        var text = endpoint.replace('-', ' ');
        var currentRoute = window.location.hash.slice(1);
        var baseRoute = currentRoute.slice(0, currentRoute.lastIndexOf('/'));

        if (currentRoute.substring(baseRoute.length).slice(1) == endpoint) {
            css = 'class="active"'
        }
        if (baseRoute.length < 2) {
            baseRoute = currentRoute;
        }
        newPath = baseRoute + '/' + endpoint;

        var result = '<a href="#' + newPath + '" ' + css + '>' + text + '</a>';
        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('delta-view-row', function(delta) {
        var sign = '';
        var value = '';
        var cssClass = '';

        if (delta !== undefined) {
            value = parseInt(delta['value']);
            cssClass = delta['change'];
            sign = (value > 0) ? '+' : '';
        }

        return '<h6 class="' + cssClass + '">' + sign + value + '</h6>';
    });
});

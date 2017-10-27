// ==UserScript==
// @grant unsafeWindow
// @name     InfiniteScroll4LBC
// @include   http*://www.leboncoin.fr/*
//
// ==/UserScript==

if (!$('footer.pagination').length) return;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var load      = false;
var offset    = $('footer.pagination').offset().top;
var $content  = $('.tabsContent ul');
var $page_max = getParameterByName('o', $('.pagination_links_container a#last').attr('href'));

$content.prepend(
    $('<li/>').append(
        $('<div/>',{style:'padding:10px;background:silver;color:#fff;font-size:15px;'})
        .text('PAGE '+$('footer.pagination').find('.selected').text()+' / '+$page_max)
    )
);

var ajoutePage = function (html) {
    var $html = $(html);
    $content.append( $html.find('.tabsContent ul').html() );
    $('footer.pagination').html( $html.find('footer.pagination') );
    offset = $('footer.pagination') .offset() .top;
    load   = false;
    if (typeof(unsafeWindow.previewLBC) != 'undefined') {
        unsafeWindow.previewLBC();
    }
};

$(window).scroll(function () {
    var height  = window.innerHeight;
    var scrollY = window.scrollY;
    if ((!load) && (scrollY > (offset - height))) {
        load            = true;
        var $pagination = $('footer.pagination');
        var $url        = $('.pagination_links_container a#next');

        if ($url.length > 0) {
            var selected = $pagination.find('.selected').next().text();
            var url      = $url.attr('href');

            $content.append(
                $('<a/>',{href:url, target:'_blank', style:'text-decoration:none;color:#fff;'})
                    .append(
                        $('<li/>')
                        .append( $('<div/>',{style:'padding:10px;background:silver;font-size:15px;'})
                        .text('PAGE ' + selected + ' / ' + $page_max) )
                    )
            );

            $pagination.empty().html('<center>Chargement...</center>');
            $.ajax({
                url: url,
                success: ajoutePage,
                error: function (error) {
                    alert('Erreur de chargement de la page');
                    console.log(error);
                },
            });
        } else {
            $pagination.empty().html('<center>Plus de page.</center>');
        }
    }

});

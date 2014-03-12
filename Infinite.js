// ==UserScript==
// @grant none
// @name     InfiniteScroll4LBC
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @include   http://www.leboncoin.fr/*
//
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var load = false;
var offset = $('#paging') .offset() .top;
var ajoutePage = function (html) {
    var $lastPage = $('.list-lbc a:last');
    var $block = $('.content-border');
    $('#paging') .remove();
    var $html = $(html);
    var $ads = $html.find('.list-lbc a');
    var $page = $html.find('#paging');
    $lastPage.after($ads);
    $block.after($page);
    offset = $('#paging') .offset() .top;
    load = false;
};
$(window) .scroll(function () {
    var height = window.innerHeight;
    var scrollY = window.scrollY;
    if ((!load) && (scrollY > (offset - height))) {
        load = true;
        var $url = $('li.page a:last') .get(0);
        var $pagination = $('#paging');
        $pagination.empty().html('<center>Chargement...</center>');
        $.ajax({
            url: $url.href,
            success: ajoutePage,
            error: function (error) {
                alert('ko');
                console.log(error);
            },
        });
    }
});

$(window).on('load', function () {
    $('#preloader .loader').delay(3500).fadeOut('slow');
    $('#preloader').delay(3500).fadeOut('slow'); 
    $('body').delay(4000).css({'overflow': 'visible'});
})
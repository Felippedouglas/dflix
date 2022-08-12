$(window).on('load', function () {
    $('#preloader .loader').delay(1000).fadeOut('slow');
    $('#preloader').delay(1000).fadeOut('slow'); 
    $('body').delay(1500).css({'overflow': 'visible'});
})
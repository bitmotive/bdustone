export default class SlickGallery {
    constructor() {
    }

    init() {
        var $slickGalleries = $('[data-groove-slick]');
        $slickGalleries.each(function() {
            $(this).slick({
                accessibility: false,
                dots: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3,
            });
        });
    }
}

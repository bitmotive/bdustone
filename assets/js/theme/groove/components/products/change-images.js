export default class ChangeImages {
    constructor() {
    }

    init() {
        $('.product-image .arrow').on('click', function() {
            var direction = $(this).data('swap-image');
            var $activeThumbnail = $('.thumbnails .is-active').closest('.thumbnail');
            var activeThumbI = $activeThumbnail.index('.thumbnails .thumbnail');
            var thumbnailLength = $('.thumbnails .thumbnail').length;


            $activeThumbnail.removeClass('is-active');

            if (direction == "next") {
                activeThumbI = (activeThumbI + 1);

                if (activeThumbI === thumbnailLength) {
                    activeThumbI = 0;
                    $('.thumbnails .thumbnail:eq(' + activeThumbI + ') a').click();
                } else {
                    $('.thumbnails .thumbnail:eq(' + activeThumbI + ') a').click();
                }
            }

            if (direction == "prev") {
                activeThumbI = (activeThumbI - 1);

                if (activeThumbI === -1) {
                    activeThumbI = (thumbnailLength - 1);
                    $('.thumbnails .thumbnail:eq(' + activeThumbI + ') a').click();
                } else {
                    $('.thumbnails .thumbnail:eq(' + activeThumbI + ') a').click();
                }
            }
        });
    }
}

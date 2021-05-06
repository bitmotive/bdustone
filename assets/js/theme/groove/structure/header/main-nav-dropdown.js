export default class MainNav {
    constructor() {
    }

    init() {
        $(document).ready(function() {
            $('header .main > li > a').on('focus', function() {
                $('header .main input[type="checkbox"]').prop('checked', false);
            });
            
            $('#headerToggleNav').on('change', function() {
                if ($(this).is(':checked')) {
                    $('body').addClass('nav-open');
                } else {
                    $('body').removeClass('nav-open');
                }
            });

            $('header .main > li > input[type="checkbox"]').on('change', function() {
                if ($(this).prop('checked') && ($('header .main input:checked').length > 1)) {
                    var openI = $('header .main input:checked').index($(this));
                    if (openI === 0) {
                        $('header .main input:checked').eq(1).prop('checked', false);
                    } else if (openI === 1) {
                        $('header .main input:checked').eq(0).prop('checked', false);
                    }
                }
            });
            setTimeout(function(){ 
                if (window.matchMedia('(min-width: 992px)').matches)
                {
                    var alertHeight = $("body > .alert").outerHeight();
                    if($("body > .alert").length){
                        $("#bfx-cc-wrapper").css("top", alertHeight);
                    }
                }
             }, 1400);
            $(window).on('resize', function(){
                if (window.matchMedia('(min-width: 992px)').matches)
                {
                    var alertHeight = $("body > .alert").outerHeight();
                    if($("body > .alert").length){
                        $("#bfx-cc-wrapper").css("top", alertHeight);
                    }
                }
            });
        });
    }
}

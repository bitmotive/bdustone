export default class ComplexPersonalizedProduct {
    constructor(context) {
        this.context = context;
    }

    toggleVisibility(opts, contrParent, primaryKey) {
        let $keyOpts = $(`.complex-personalized [data-display-name*="${primaryKey}"]`);
        opts.hide();
        opts.find('small').hide();
        opts.find('input[type="text"]').prop('required', false).val('');
        opts.find('input[type="checkbox"]').prop('required', false).prop('checked', false);
        opts.find('input[type="radio"]').prop('required', false).prop('checked', false);
        contrParent.show();
        contrParent.find('small').show();
        $keyOpts.show();
        $keyOpts.find('small').show();
        $keyOpts.find('input').prop('required', true);
    }

    async init() {
        let base = this;
        var $opts = $('.complex-personalized [class*="opts-"]');
        var $contr = $('.complex-personalized [data-complex-controller]');
        var $contrParent = $contr.closest('[class*="opts-"]');
        $opts.hide();
        $contrParent.show();
        $contr.prop('required', true);
        if ($contr.val !== "") {
            var primaryKey = $contr.find(':selected').text();
            base.toggleVisibility($opts, $contrParent, primaryKey);
        }
        $contr.on('change', function(obj) {
            let primaryKey = $(this).find(':selected').text();
            base.toggleVisibility($opts, $contrParent, primaryKey);
        });
    }
}

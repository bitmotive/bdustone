export default class UpdateDetails {
    constructor(context) {
        this.context = context;
    }

    init() {
        $('.acc-description dd').each(function() {
            var content = $.trim($(this).text()).substring(0, 4);
            var comparison = ["null", "Null", "NULL", "N/A", "n/a", "N/a", "n/A", ""];
            if (comparison.indexOf(content) >= 0) {
                $(this).prev().remove();
                $(this).remove();
            }
        });

        if ($('.acc-description').children().length === 0) {
            $('.acc-description').closest('section').remove();
        }
    }
}

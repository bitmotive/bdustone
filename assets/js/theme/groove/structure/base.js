import MainNav from './header/main-nav-dropdown';
import OrderConfirmation from './order-confirmation';

export default class GrooveStructureComponents {
    constructor($context) {
        this.$context = $context;
    }

    init() {
        this.mainNav = new MainNav();
        this.mainNav.init();
        this.orderConfirmation = new OrderConfirmation(this.$context);
    }

}

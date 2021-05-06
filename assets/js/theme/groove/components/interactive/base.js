import Accordion from './accordion';
import SlickGallery from './slick-gallery';
import Tabs from './tabs';
export default class GrooveInteractiveComponents {
    constructor($context) {
        this.$context = $context;
    }

    init() {
        this.accordion = new Accordion();
        this.accordion.init();
        this.slickGallery = new SlickGallery();
        this.slickGallery.init();
        this.tabs = new Tabs();
        this.tabs.init();
    }
}

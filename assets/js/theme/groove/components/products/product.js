import ChangeImages from "./change-images";
import ComplexPersonalizedProduct from "./personalized-product";
import GroupedForm from "./grouped-form";
import BundledForm from "./bundled-form";
import StickyInfo from "./sticky-info";
import UpdateDetails from "./update-details";

export default class GrooveProduct {
    constructor(context) {
        this.context = context;
    }

    init() {
        this.changeImages = new ChangeImages();
        this.changeImages.init();
        this.complexPersonalizedProduct = new ComplexPersonalizedProduct();
        this.complexPersonalizedProduct.init();
        if(this.context.template == 'pages/custom/product/grouped') { this.groupedForm = new GroupedForm(this.context) };
        if(this.context.template == 'pages/custom/product/bundled') { this.bundledForm = new BundledForm(this.context) };
        this.stickyInfo = new StickyInfo(this.context);
        this.stickyInfo.init();
        this.updateDetails = new UpdateDetails(this.context);
        this.updateDetails.init();
    }
}

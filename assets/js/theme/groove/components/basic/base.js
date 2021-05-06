import GetProductsByCategory from "./products-by-category";

export default class GrooveBasicComponents {
    constructor(context) {
        this.context = context;
    }

    init() {
        this.getProductsByCategory = new GetProductsByCategory(this.context);
        this.getProductsByCategory.init();
        //console.log(this.context);
    }
}

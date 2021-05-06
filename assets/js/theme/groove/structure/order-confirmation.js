import exportedSettings from "../exportedSettings";

export default class OrderConfirmation {
  constructor(context) {
    this.context = context;
    this.init();
  }
  init() {
    if (this.context.template === "pages/order-confirmation") {
      fetch(`/api/storefront/order/${this.context.checkoutId}`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => this.checkSkuMatch(data))
        .catch((error) => console.error(error));
    }
  }
  checkSkuMatch(customerSkuData) {
    //if customer sku matches bdu sku
    let digitalSkuArr = customerSkuData.lineItems.digitalItems;
    let skuObject = exportedSettings.bduMembershipInfo;
    let subPurchase = false;

    digitalSkuArr.forEach((itemPurcahsed) => {
      // if a subscriptions was purchased,  turn the other display off
      if (skuObject[itemPurcahsed.sku]) {
        document.querySelector('.subscription-purchased').style.display = "block";
        subPurchase = true;
      }
    });
    // if no subscription purchase
    if (!subPurchase) {
            document.querySelector('.non-member-purchase').style.display = "block";
    }

    if (customerSkuData.discountAmount > 0) {
    document.querySelector('.amount-saved').innerHTML = `You Saved  $${customerSkuData.discountAmount}` ;
    }
  }
}

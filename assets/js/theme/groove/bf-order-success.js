import PageManager from '../page-manager';

export default class BFOrderSuccess extends PageManager {
  constructor(context) {
    super(context);
  }
  getCart() {
    fetch('/api/storefront/cart', {
      method: "get",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    })
    .then(resp => resp.json())
    .then(resp => {
      this.clearCart(resp[0].id);
    });
  }

  clearCart(id) {
    fetch(`/api/storefront/cart/${id}`, {
      method: "delete",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    })
    .then(resp => { 
      console.log(`${id} removed`, resp);
      $('body').trigger('cart-quantity-update', 0);
    });
  }

  onReady() {
    this.getCart()
  }
}

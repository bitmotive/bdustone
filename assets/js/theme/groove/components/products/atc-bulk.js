import PageManager from "../../../page-manager";
import swal from '../../../global/sweet-alert';
import { defaultModal } from '../../../global/modal';

export default class BulkATC extends PageManager {
  constructor(context) {
    super(context);
    
    this.cartid = context.cartId;
    this.lineItems = [];
    this.init();
  }

  async init() {
    this.optionChange();
    this.atcEvent();
  }

  cartSweetAlert(data, type) {
    let config;
    switch(type){
      case 'error': 
        config = {
          html: data.msg,
          timer: 5000,
          timerProgressBar: true,
          icon: 'error',
        }
        break;
      case 'success':
        config = {
          html: `<h2>Products Added to Cart</h2><h3>Subtotal: ${data.currency.symbol}${data.cartAmount.toFixed(2)}</h3>`,
          timer: 5000,
          timerProgressBar: true,
          icon: 'success',
        };
        break;
    }
    
    swal.fire(config);
  }

  // Actions
  async storefrontCart(url, cartItems) {
    return await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    })
    .then(resp => resp.json())
  }

  atcEvent() {
    $('[data-cart-item-add]').on('submit', (res) => {
      res.stopPropagation();
      res.preventDefault();
      
      let selections = $('[data-picklist-product]');
      selections = selections.filter(data => selections[data].value > 0);

      for(let item of selections) {
        this.lineItems.push({
          quantity: parseInt(item.value),
          productId: parseInt(item.id)
        })
      }

      if(this.lineItems.length <= 0) {
        this.cartSweetAlert({msg: `<h2>Quantity cannot be 0</h2>`}, 'error')
      } else {
        this.updateCart({ lineItems: this.lineItems });
        this.resetForm();
      }
    });
  }

  // Event listener for when inputs are updated
  optionChange() {
    $('[data-picklist-product]').on('change keyup', (res) => { 
      if(res.target.value < 0) { res.target.value = 0 }
      else { this.updatePreCart(); }
    });
  }

  // Update the Cart by either creating a new one, or adding to the current cart
  async updateCart(cartItems) {
    let cart;
    if(!this.cartid) {
      cart = await this.storefrontCart(`/api/storefront/carts`, cartItems);
    } else {
      cart = await this.storefrontCart(`/api/storefront/carts/${this.cartid}/items`, cartItems);
      if(cart.status == 404) { cart = await this.storefrontCart(`/api/storefront/carts`, cartItems); }
    }
    if(cart) { 
      this.cartid = cart.id;
      this.cartSweetAlert(cart, 'success');
    }
  }

  // Update the display of the selected products per quantity
  updatePreCart() {
    let tempPreCart = {
      qty: 0,
      total: 0
    };
    
    let selections = $('[data-picklist-product]');
    let productPrice = $('[data-product-price-without-tax]');
    let preCartContainer = $('[data-cart-info]');
    let preCartQty = $('[data-cart-info-qty]');
    let preCartPrice = $('[data-cart-info-price]');

    // Filter down selections to only those with a quantity > 0
    selections = selections.filter(data => selections[data].value > 0);

    for(let item of selections) {
      let data = {
        id: parseInt(item.getAttribute('id')),
        qty: parseInt(item.value),
        price: parseFloat(item.getAttribute('data-picklist-product-price'))
      }

      tempPreCart.qty += data.qty;
      tempPreCart.total += (data.price * data.qty);
    }

    preCartQty.text(tempPreCart.qty);
    preCartPrice.text(`$${tempPreCart.total.toFixed(2)}`);
    productPrice.text(`$${tempPreCart.total.toFixed(2)}`);
  }

  // Reset the form values
  resetForm() {
    $('[data-picklist-product]').val(0);
    $('[data-cart-info-qty]').text(0);
    $('[data-cart-info-price]').text('$0.00');
    this.lineItems = [];
  }
}

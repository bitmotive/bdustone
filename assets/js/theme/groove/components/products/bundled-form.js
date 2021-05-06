export default class BundledForm {
  constructor(context) {
    this.context = context;
    this.cartid = context.cartId;
    this.products = [];
    this.lineItems = [];
    this.getAccProductIds();
    this.getAddonProductIds();
    this.init();
  }

  fetchAccProducts(prodIds, type) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.settings.storefront_api.token}`
      },
      body: JSON.stringify({
        query: `
          query SeveralProductsByID {
            site {
              products(first: 25, entityIds: [${prodIds}]) {
                edges {
                  node {
                    entityId
                    sku
                    availability
                    prices {
                      price { value }
                      salePrice { value }
                      basePrice { value }
                      retailPrice { value }
                    }
                  }
                }
              }
            }
          }
         `
      })
    })
    .then(res => res.json())
    .then(productsData => {
      switch(type) {
        case 'checkbox':
          this.applyAddonCheckboxs(productsData.data.site.products.edges.entries());
          break;
        default:
          this.applyDefaultPicklists(productsData.data.site.products.edges.entries());
          break;
      }
      
    });
  }

  applyDefaultPicklists(prodArr) {
    for (let [i, prod] of prodArr) {
      const $prod = prod.node;
      const price = $prod.prices.salePrice != null ? $prod.prices.salePrice.value : $prod.prices.price.value;
      const $option = document.querySelectorAll(`option[data-option-product-id="${$prod.entityId}"]`);
      for(let opt of $option) {
        opt.dataset.optionPrice = price;
        opt.text = `${opt.text} - ${price}`;
      }
    }
  }

  applyAddonCheckboxs(prodArr) {
    for (let [i, prod] of prodArr) {
      const $prod = prod.node;
      const price = $prod.prices.salePrice != null ? $prod.prices.salePrice.value : $prod.prices.price.value;
      const $product = $(`.opts-picklist li[data-product-id="${$prod.entityId}"] .info`);
      const $input = $(`.opts-picklist li[data-product-id="${$prod.entityId}"] [data-picklist-product]`);
      $input.attr('data-picklist-product-price', price);
      $product.find('.pl-name').append(`<span style="display:block;"> - <span class="bfx-price">$${price}</span></span>`);
      $product.find('.pl-sku').text($prod.sku);
      $product.find('.pl-avail').text($prod.availability);
    }
  }

  getAccProductIds() {
    let base = this;
    let accordions = document.querySelectorAll('[data-bundle-acc-product-ids]');
    for(let item of accordions) {
      let prodIDs = item.dataset.bundleAccProductIds.split(',');
      base.fetchAccProducts(prodIDs);
    };
  }

  getAddonProductIds() {
    let base = this;
    let addons = document.querySelectorAll('[data-bundle-acc-addons-product-ids]');
    for(let item of addons) {
      let prodIDs = item.dataset.bundleAccAddonsProductIds;
      base.fetchAccProducts(prodIDs, 'checkbox');
    }
  }

  quantityChange() {
    $('[data-quantity-change] [data-action]').on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let $qty = $(e.target).parent().find('input');
      let currQty = $qty.val();
      let btnAction = $(e.target).data('action');

      if (btnAction === "inc") { $qty.val((parseInt(currQty) + 1)).change(); }
      if ((currQty > 0) && btnAction === "dec") { $qty.val((parseInt(currQty) - 1)).change(); }
    });
  }

  async storefrontCart(url, cartItems) {
    return await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    })
    .then(resp => resp.json())
  }

  async updateCart(cartItems) {
    let cart;
    console.log(this.cartid);
    if(!this.cartid) {
      cart = await this.storefrontCart(`/api/storefront/carts`, cartItems);
    } else {
      cart = await this.storefrontCart(`/api/storefront/carts/${this.cartid}/items`, cartItems);
      console.log(cart);
      if(cart.status == 404) { cart = await this.storefrontCart(`/api/storefront/carts`, cartItems); }
      console.log(cart);
    }
    if(cart) { 
      this.cartid = cart.id;
    }
  }

  bundleOptionsSelections() {
    let selections = $('[data-bundle-acc-product-ids]');
    selections = selections.filter(data => selections[data].value != 0);

    let mainProd = {
      productId: $('[data-cart-item-add] input[name="product_id"]').val(),
      quantity: $('.totals .form-input--incrementTotal').val(),
      option_selections: []
    }

    for(let item of selections) {
      mainProd.option_selections.push({
        option_id: item.id.split('attribute_select_')[1],
        option_value: item.value
      })
    }

    if(mainProd.option_selections.length > 0) {
      this.lineItems.push(mainProd);
    }
  }
  
  addonSelections() {
    let selections = $('[data-picklist-product]');
    selections = selections.filter(data => selections[data].value > 0);

    for(let item of selections) {
      this.lineItems.push({
        quantity: parseInt(item.value),
        productId: parseInt(item.id)
      })
    }
  }

  bundleATC() {
    $('[data-cart-item-add]').on('submit', async(res) => {
      // We're overriding the default ATC functionality to add these sets of products together into the cart
      res.preventDefault();
      res.stopPropagation();
      // Setup the selections for the main Product Picklists
      this.bundleOptionsSelections();
      // Addons get added as individual line items for the cart
      this.addonSelections();

      // As long as we have lineItems, we'll submit them to the Storefront Cart API, then transition to the Cart page
      // Else, do nothing.
      if(this.lineItems.length > 0) {
        this.updateCart({ lineItems: this.lineItems }).then(resp => {
          window.location = `/cart.php`;
        });
      } else {
        console.log('no lineitems to send');
      }
    });
  }

  addonsEventListeners() {
    this.quantityChange();
    this.bundleATC();
  }

  init() {
    $('.form-bundle .opts-select select').on('change', function() {
      let $option = $(this).find(':selected');
      let optionPrice = $option.data('option-price');
      let optionTxt = $option.data('option-text');
      let optionImg = $option.data('option-image-src');
      let optionAlt = $option.data('option-image-alt');
      let $rep = $(this).closest('dd').prev();
      let $priceDisplay = $rep.find('[data-selected-price]');
      let $repTxt = $rep.find('[data-selected-product]');
      let $repImg = $rep.find('img');
      let strLng = 13;
      if (optionTxt.length >= strLng) {
        optionTxt = (optionTxt.slice(0, strLng)).trim() + '&hellip;';
      }
      $repTxt.html(optionTxt);
      optionPrice ? $priceDisplay.html(`$${parseFloat(optionPrice).toFixed(2)}`) : $priceDisplay.empty();
      $repImg.attr('src', optionImg).attr('alt', optionAlt);
    });
    
    $('.acc-options > dt:first-child > button').click();

    this.addonsEventListeners();
  }
}

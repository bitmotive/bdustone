import BulkATC from "./atc-bulk";

export default class GroupedForm {
    constructor(context) {
        this.context = context;
        // this.api_root = 'http://localhost:7070'; // Local
        this.api_root = 'https://kegw-bc-app.herokuapp.com'; // Heroku

        this.init();
    }

    setPriceRange(data) {
        let priceElement = document.querySelector('[data-product-price-without-tax]');
        data = Array.from(new Set(data));
        data.sort();

        let min = Math.min(...data);
        let max = Math.max(...data);

        if(min == max) {
            priceElement.textContent = `$${min}`;
        } else {
            priceElement.textContent = `$${min} - $${max}`;
        }
        priceElement.removeAttribute('data-product-price-without-tax');
    }

    buildGraphQLProductDetails(data) {
        console.log(data);
        let priceRange = [];
        for (let [i, prod] of data) {
            let $prod = prod.node;
            let price = $prod.prices.salePrice != null ? $prod.prices.salePrice.value : $prod.prices.price.value;
            const $product = $(`.opts-picklist li[data-product-id="${$prod.entityId}"] .info`);
            const $input = $(`.opts-picklist li[data-product-id="${$prod.entityId}"] [data-picklist-product]`);
            $input.attr('data-picklist-product-price', price);
            priceRange.push(price);
            $product.find('.pl-name').append(`<span style="display:block;"> - <span class="bfx-price">$${price}</span></span>`);
            $product.find('.pl-sku').text($prod.sku);
            $product.find('.pl-avail').text($prod.availability);
        }

        this.setPriceRange(priceRange)
    }

    buildAPIProductDetails(data) {
        let priceRange = [];
        for (let [i, prod] of data.entries()) {
            let price = prod.sale_price != null && prod.sale_price != 0 ? prod.sale_price : prod.price;
            const $product = $(`.opts-picklist li[data-product-id="${prod.id}"] .info`);
            const $input = $(`.opts-picklist li[data-product-id="${prod.id}"] [data-picklist-product]`);
            $input.attr('data-picklist-product-price', price);
            priceRange.push(price);
            $product.find('.pl-name').append(`<span style="display:block;"> - <span class="bfx-price">$${price}</span></span>`);
            $product.find('.pl-sku').text(prod.sku);
            $product.find('.pl-avail').text(prod.availability);
        }

        this.setPriceRange(priceRange)
    }

    init() {
        this.bulkATC = new BulkATC(this.context);

        const products = new Array();
        $('.opts-picklist li').each(function() {
            let prodID = $(this).data('product-id');
            products.push(prodID);
        });
        console.log(products);

        /*fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.settings.storefront_api.token}`
            },
            body: JSON.stringify({
                query: `
                    query SeveralProductsByID {
                        site {
                            products(entityIds: [${products}]) {
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
            const prodArr = productsData.data.site.products.edges.entries();
            this.buildGraphQLProductDetails(prodArr);
        });*/

        fetch(`${this.api_root}/api/webhooks/products/details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.settings.storefront_api.token}`
            },
            body: JSON.stringify({ ids: products })
        }).then(res => res.json())
        .then(data => this.buildAPIProductDetails(data));

        $('.form-grouped .form-increment button').on('click', function() {
            var $qty = $(this).parent().find('input');
            var currQty = $qty.val();
            var btnAction = $(this).data('action');
            if (btnAction === "inc") {
                $qty.val((parseInt(currQty) + 1)).change();
            }
            if ((currQty > 0) && btnAction === "dec") {
                $qty.val((parseInt(currQty) - 1)).change();
            }
            // console.log('clicked: ' + currQty);
        });
    }
}

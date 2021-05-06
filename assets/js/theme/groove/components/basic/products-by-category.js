export default class GetProductsByCategory {
    constructor(context) {
        this.context = context;
    }

    async showProductsByCategory(category,limit,id,format) {
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`
            },
            body: JSON.stringify({
                query: `
                query CategoryByUrl {
                    site {
                      route(path: "${category}") {
                        node {
                          id
                          ... on Category {
                            name
                            entityId
                            description
                            products(first: 8) {
                              edges {
                                node {
                                  name
                                  sku
                                  path
                                  entityId
                                  defaultImage {
                                    url(width: 1200)
                                  }
                                  brand {
                                    name
                                  }
                                  prices {
                                    price {
                                      currencyCode
                                      value
                                    }
                                    salePrice {
                                      currencyCode
                                      value
                                    }
                                    retailPrice {
                                      currencyCode
                                      value
                                    }
                                    priceRange {
                                      min {
                                        currencyCode
                                        value
                                      }
                                      max {
                                        currencyCode
                                        value
                                      }
                                    }
                                  }
                                  inventory {
                                    isInStock
                                  }
                                }
                              }
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
        .then(products => {
            //console.log(products.data.site.route.node.products.edges);
            
          if (format==='static') {
            //console.log('Calling Static Carousel ' + format);
            for(let [i, prod] of products.data.site.route.node.products.edges.entries()) {
                let card = document.createElement('article');

                let img = "https://via.placeholder.com/900/e8e8e8/000?text=IMAGE COMING SOON";
              if (prod.node.defaultImage !== null) {
                img = prod.node.defaultImage.url;
              }

              let price = "0";
              if (prod.node.prices.price !== null ) {
                price = prod.node.prices.price.value;
                price = price.toLocaleString('en-US', {style:'currency',currency:'USD'});
              }
                card.className = "card";
                card.insertAdjacentHTML('beforeend', `
                    <div class="img-w">
                        <a href="${prod.node.path}" class="img-l">
                            <img src="${img}">
                            <div class="img-exclusive"></div>
                        </a>        
                    </div> 
                    <div class="cnt">
                        <h3 class="title" itemprop="name">
                            <a href="${prod.node.path}">${prod.node.name}</a>
                        </h3>
                        
                        <div class="price productPrice_${prod.node.entityId}">
                        <span data-product-price-without-tax="${price}" itemprop="price">${price}</span>
                      </div>

                      <span>
                        <a id="${prod.node.entityId}" href="/cart.php?action=add&product_id=${prod.node.entityId}" class="addtocart_${prod.node.entityId} button button--small card-figcaption-button btn-primary" rel="nofollow" style="display:none;">Add to Cart</a>
                      </span>
                      
                      <p class="requestPrice">
                        <a href="#" onclick="(function(e){e.preventDefault();})(event)" id="requestPriceBtn_${prod.node.entityId}" class="requestPriceBtn_${prod.node.entityId} button button--small card-figcaption-button btn-primary" style="display:none;">Request Price</a>
                      </p>

                    </div> 

                    `);
                
                if (prod.node.inventory.isInStock === true && i < limit) {
                    document.getElementById(id).appendChild(card);
                    i++;
                }
                
                try {
                    applyRules(prod.node.entityId,prod.node.sku,prod.node.name,prod.node.brand.name,false);
                } catch (exception) {
                    console.log(exception);
                }
            }
            
           
            
            $('#'+id).slick({
                "accessibility": false,
                "infinite": false,
                "mobileFirst": true,
                "arrows": false,
                "dots": false,
                "draggable": true,
                "swipe": true,
                "responsive": [
                    {
                        "breakpoint": 767,
                        "settings": {
                            "slidesToShow": 3,
                            "slidesToScroll": 3,
                            "arrows": false         
                        }
                    }
                ]
            });
          }  // end format === 'static'
          else if (format === 'dynamic') {
            //console.log('Calling Dynamic Carousel ' + format);
            for(let [i, prod] of products.data.site.route.node.products.edges.entries()) {
              let card = document.createElement('article');

              let img = "https://via.placeholder.com/900/e8e8e8/000?text=IMAGE COMING SOON";
              if (prod.node.defaultImage !== null) {
                img = prod.node.defaultImage.url;
              }

              let price = "0";
              if (prod.node.prices.price !== null ) {
                price = prod.node.prices.price.value;
                price = price.toLocaleString('en-US', {style:'currency',currency:'USD'});
              }

              card.className = "card";
              card.insertAdjacentHTML('beforeend', `
                  <div class="img-w">
                      <a href="${prod.node.path}" class="img-l">
                          <img src="${img}">
                          <div class="img-exclusive"></div>
                      </a>        
                  </div> 
                  <div class="cnt">

                      <h3 class="title" itemprop="name">
                          <a href="${prod.node.path}">${prod.node.name}</a>
                      </h3>

                      <div class="price productPrice_${prod.node.entityId}">
                        <span data-product-price-without-tax="${price}" itemprop="price">${price}</span>
                      </div>

                      <span>
                        <a id="${prod.node.entityId}" href="/cart.php?action=add&product_id=${prod.node.entityId}" class="addtocart_${prod.node.entityId} button button--small card-figcaption-button btn-primary" rel="nofollow" style="display:none;">Add to Cart</a>
                      </span>
                      
                      <p class="requestPrice">
                        <a href="#" onclick="(function(e){e.preventDefault();})(event)" id="requestPriceBtn_${prod.node.entityId}" class="requestPriceBtn_${prod.node.entityId} button button--small card-figcaption-button btn-primary" style="display:none;">Request Price</a>
                      </p>

                  </div> 
                  `);
                  
              if (prod.node.inventory.isInStock === true && i < limit) {
                  document.getElementById(id).appendChild(card);
                  i++;
              }

                try {
                    applyRules(prod.node.entityId,prod.node.sku,prod.node.name,prod.node.brand.name,false);
                } catch (exception) {
                    console.log(exception);
                }

          }
          
            $('#'+id).slick({
              "accessibility": false,
              "infinite": false,
              "mobileFirst": true,
              "arrows": false,
              "dots": false,
              "draggable": true,
              "swipe": true,
              "responsive": [
                  {
                      "breakpoint": 767,
                      "settings": {
                          "slidesToShow": 3,
                          "slidesToScroll": 3,
                          "arrows": true         
                      }
                  },
                  {
                      "breakpoint": 992,
                      "settings": {
                          "slidesToShow": 4,
                          "slidesToScroll": 4,
                          "arrows": true          
                      }
                  }
              ]
            }); 
          } // end format === 'dynamic'
        });
    }

    init() {
        let base = this;
        $(document).ready(function() {
            $('[data-category-carousel]').each(function() {
              
              let category = $(this).data('category-carousel');
              let limit = $(this).data('limit');
              let format = $(this).data('format');
              let id = $(this).attr('id');
              //console.log("Calling custom carousel with "+format+" format");
              //console.log(category);
              base.showProductsByCategory(category,limit,id,format);
            });
        });
    }
}

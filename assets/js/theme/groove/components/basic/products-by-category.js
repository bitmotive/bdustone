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
                            products(first: ${limit}) {
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

          // @TODO The following conditonal splits the logic between
          // "static" and "dynamic" carousels. However, there is a lot
          // of code duplication (i.e. the same thing in both places)
          // that could be more elegantly refactored in the future.

          // STATIC carousels do not display arrows
          if (format==='static') {

            // The default sort order is 70
            let defaultSort = 70;

            for(let [i, prod] of products.data.site.route.node.products.edges.entries()) {
                let card = document.createElement('article');

                // By default all cards should have a sort order
                let currentSort = defaultSort;

                // Let's see if this carousel category appears in the bduHomepageCarouselOptions object...
                let categoryKey = category.replaceAll('/', '');
                if( 'bduHomepageCarouselOptions' in exportedSettings && categoryKey in exportedSettings.bduHomepageCarouselOptions ){

                    // There are some extraneous keys we can delete before our comparison
                    let keySKUs = Object.keys(exportedSettings.bduHomepageCarouselOptions[categoryKey]);
                    keySKUs = keySKUs.filter(function(item){
                        return item !== 'categoryID' && item !== 'displayTitle';
                    });

                    // Check if this SKU was supplied and find its 'sort' value
                    $.each(keySKUs, function(){
                        if( this == prod.node.sku ){
                            currentSort = exportedSettings.bduHomepageCarouselOptions[categoryKey][this].sort;
                        }
                    });
                }

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
                // Create a unique id for each card based on the product SKU
                card.id = "card" + "-" + prod.node.sku;
                // Add a sort order to every carousel card
                $(card).attr('data-sort', currentSort);
                // Add the product SKU to every carousel card
                $(card).attr('data-sku', prod.node.sku);

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

                    // The following code will place a carousel card
                    // into a carousel. Before doing so, it will check
                    // the sort order of the card against all prior cards
                    // in the carousel and insert it in the appropriate location.

                    let currentSort = $(card).attr('data-sort');
                    let carousel = $(document.getElementById(id));
                    let cards = carousel.find('article');
                    let cardLength = cards.length;

                    // If this is our first card it can simply be appended.
                    if( cardLength == 0 ){
                        document.getElementById(id).appendChild(card);
                    } else {

                        // Check all prior cards in the carousel and insert
                        // prior to the next greater card in the list.
                        let added = 0;
                        for(let x = 1; x <= cardLength; x++){
                            let sort = $(cards[x - 1]).attr('data-sort');
                            if(currentSort < sort & added == 0) {
                                $(cards[x - 1]).before(card);
                                added = 1;
                                break;
                            }
                        }
                        if(added == 0){
                            // No greater sort values were found, so this should be added last.
                            document.getElementById(id).appendChild(card);
                        }
                    }
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
                            "slidesToShow": 6,
                            "slidesToScroll": 6,
                            "arrows": false
                        }
                    }
                ]
            });

          }  // end format === 'static'
          // DYNAMIC carousels may be scrolled with arrows
          else if (format === 'dynamic') {

            // The default sort order is 70
            let defaultSort = 70;

            for(let [i, prod] of products.data.site.route.node.products.edges.entries()) {
                let card = document.createElement('article');

                // By default all cards should have a sort order
                let currentSort = defaultSort;

                // Let's see if this carousel category appears in the bduHomepageCarouselOptions object...
                let categoryKey = category.replaceAll('/', '');
                if( 'bduHomepageCarouselOptions' in exportedSettings && categoryKey in exportedSettings.bduHomepageCarouselOptions ){

                    // There are some extraneous keys we can delete before our comparison
                    let keySKUs = Object.keys(exportedSettings.bduHomepageCarouselOptions[categoryKey]);
                    keySKUs = keySKUs.filter(function(item){
                        return item !== 'categoryID' && item !== 'displayTitle';
                    });

                    // Check if this SKU was supplied and find its 'sort' value
                    $.each(keySKUs, function(){
                        if( this == prod.node.sku ){
                            currentSort = exportedSettings.bduHomepageCarouselOptions[categoryKey][this].sort;
                        }
                    });
                }

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
              // Create a unique id for each card based on the product SKU
              card.id = "card" + "-" + prod.node.sku;
              // Add a sort order to every carousel card
              $(card).attr('data-sort', currentSort);
              // Add the product SKU to every carousel card
              $(card).attr('data-sku', prod.node.sku);

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
                  // The following code will place a carousel card
                  // into a carousel. Before doing so, it will check
                  // the sort order of the card against all prior cards
                  // in the carousel and insert it in the appropriate location.

                  let currentSort = $(card).attr('data-sort');
                  let carousel = $(document.getElementById(id));
                  let cards = carousel.find('article');
                  let cardLength = cards.length;

                  // If this is our first card it can simply be appended.
                  if( cardLength == 0 ){
                      document.getElementById(id).appendChild(card);
                  } else {

                      // Check all prior cards in the carousel and insert
                      // prior to the next greater card in the list.
                      let added = 0;
                      for(let x = 1; x <= cardLength; x++){
                          let sort = $(cards[x - 1]).attr('data-sort');
                          if(currentSort < sort & added == 0) {
                              $(cards[x - 1]).before(card);
                              added = 1;
                              break;
                          }
                      }
                      if(added == 0){
                          // No greater sort values were found, so this should be added last.
                          document.getElementById(id).appendChild(card);
                      }
                  }
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

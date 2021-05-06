
export default {

  //console.log(" exported settings is connected!");

    bduMembershipSKUs: [
      "BDU-Member",
      "BDU-Member-SDI",
      "BDU-Member-99",
      "BDU-Member-MAC",
      "BDU-Member-365",
      "BDU-Member-6M",
      "BDU-Member-SDS",
    ],
    bduMembershipInfo: {
      "BDU-Member": {
        sku: "BDU-Member",
        externalID: "205210",
        display: "Big Daddy Unlimited - Membership",
        lengthInDays: 30,
        duration: { unit: "month", value: 1 },
        gracePeriodInDays: 10,
        type: "full",
      },
      "BDU-Member-SDI": {
        sku: "BDU-Member-SDI",
        externalID: "340708",
        display: "Big Daddy Unlimited - Membership (Patreon Special)",
        lengthInDays: 30,
        duration: { unit: "month", value: 1 },
        gracePeriodInDays: 10,
        type: "full",
      },
      "BDU-Member-99": {
        sku: "BDU-Member-99",
        externalID: "360711",
        display: "Big Daddy Unlimited - Membership - 99 cent trial",
        lengthInDays: 30,
        duration: { unit: "month", value: 1 },
        gracePeriodInDays: 10,
        type: "trial",
      },
      "BDU-Member-MAC": {
        sku: "BDU-Member-MAC",
        externalID: "433771",
        display: " Big Daddy Unlimited - Membership (MAC special)",
        lengthInDays: 30,
        duration: { unit: "month", value: 1 },
        gracePeriodInDays: 10,
        type: "full",
      },
      "BDU-Member-365": {
        sku: "BDU-Member-365",
        externalID: "433774",
        display: "Big Daddy Unlimited - Annual Membership",
        lengthInDays: 365,
        duration: { unit: "month", value: 12 },
        gracePeriodInDays: 10,
        type: "full",
      },
      "BDU-Member-6M": {
        sku: "BDU-Member-6M",
        externalID: "433775",
        display: "Big Daddy Unlimited - 6 Month Membership",
        lengthInDays: 180,
        duration: { unit: "month", value: 6 },
        gracePeriodInDays: 10,
        type: "full",
      },
      "BDU-Member-SDS": {
        sku: "BDU-Member-SDS",
        externalID: "453838",
        display: "Big Daddy Unlimited - Membership (SD Special)",
        lengthInDays: 30,
        duration: { unit: "month", value: 1 },
        gracePeriodInDays: 10,
        type: "full",
      },
    },
    nonMemberVisibleProducts: {
      "angeryar15-bdu": true,
      "JW3SAFE-BDU": true,
      "jw3safe-bdu": true,
    },
    alertMessageList: {
      "001": {
        title: "Page Not Found",
        body:
          'Sorry, the page was not found. <a href="/">Click here to return to the home page</a>',
      },
      "020": {
        title: "No Product Found",
        body:
          "Failed to find a currently available version of a product. Please try again later.",
      },
      "021": {
        title: "Unsubscribe Successful",
        body:
          "Your email address has been unsubscribed from any pending restock notifications.",
      },
      "022": {
        title: "Restock Notification Added",
        body:
          "Your email address has been subscribed to be notified when the product comes back in stock.",
      },
      "023": {
        title: "Failed to Add Restock Notification",
        body:
          "Your email address failed to be added to the restock notification list. Please try again later. If you continue to encounter this problem please contact us.",
      },
      defaultMessage: {
        title: "Unknown Error",
        body:
          "An unknown error has occured. If you continue to encounter this problem please contact us.",
      },
    },
    enableINS: true,
    enableMembershipCartCheck: true,
    homepageRedirectLocations: {
      member: "/bdu-member-portal",
      login: "/login.php",
      buytrial: "/become-a-member",
      rejoin: "/rejoin-bdu",
      newjoin: "/become-a-member",
      home: "/",
    },
    disableStoreCreditForMembershipPurchase: true,
    productPageContentInjections: [
      {
        isEnabled: true,
        skuPattern: "^.*-[sS][sS]$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 4-5 day delay in shipping due to supply chain issues caused by COVID-19</div>",
        _msg: "SS prods",
      },
      {
        isEnabled: true,
        skuPattern: "^.*-[rR][sS]$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 5-7 day delay in shipping due to supply chain issues caused by COVID-19</div>",
        _msg: "RS prods",
      },
      {
        isEnabled: true,
        skuPattern: "^.*-[bB][hH]$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 15-20 day delay in shipping due to supply chain issues caused by COVID-19</div>",
        _msg: "BH prods +5 10-12 old",
      },
      {
        isEnabled: true,
        skuPattern: "^.*-[zZ][aA]$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 10-14 day delay in shipping due to supply chain issues caused by COVID-19</div>",
        _msg: "Z prods",
      },
      {
        isEnabled: true,
        skuPattern: "^.*-[cC][sS][sS]$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 10-14 day delay in shipping due to supply chain issues caused by COVID-19</div>",
        _msg: "CSS prods",
      },
      {
        isEnabled: false,
        skuPattern: "^.*-[bB][dD][uU]$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 1-2 day delay in shipping due to backlogs caused by COVID-19</div>",
        _msg: "CSS prods",
      },
      {
        isEnabled: false,
        skuPattern: "",
        titlePattern:
          "^.*Streamlight Trident Headlamp Xenon Replacement Bulb 57 Lumens.*$",
        regexFlags: "g",
        htmlSelector: ".ProductDescriptionContainer.prodAccordionContent",
        msgHTML: "<p><b>Life:</b> 100,000 hour</p>",
        _msg: "test tule 03",
      },
      {
        isEnabled: false,
        skuPattern: "^080926610514-SS$",
        titlePattern: "",
        regexFlags: "g",
        htmlSelector: ".ProductMain",
        msgHTML:
          "<div class='ppwarnbuybox'>This product may experience a 1-2 day delay in shipping due to backlogs caused by COVID-19</div>",
        _msg: "test rule 02",
      },
    ],
  
}

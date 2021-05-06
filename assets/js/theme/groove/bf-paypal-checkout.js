import PageManager from '../page-manager';

export default class BFPaypalCheckout extends PageManager {
  constructor(context) {
    super(context);
  }

  updateBFIframes() {
    const urlParams = new URLSearchParams(window.location.search);
    const ppStatus = urlParams.get('ppStatus');
    const token = urlParams.get('token');

    let src = `https://checkout.sbx.borderfree.com/v5/htmlcheckout/views/preloadBack_pp.xhtml?ppStatus=${ppStatus}&token=${token}`; // Staging URL
    // let src = `https://checkout.prd.borderfree.com/v5/htmlcheckout/views/preloadBack_pp.xhtml?ppStatus=${ppStatus}&token=${token}`; // Prod URL

    let iframe = document.querySelector('iframe[id="envoyId"]');
    iframe.src = src;
  }

  onReady() {
    this.updateBFIframes();
  }
}

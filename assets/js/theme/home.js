import PageManager from './page-manager';
//import Reflektion from './groove/components/interactive/reflektion';
//import Hubspot from './groove/components/interactive/hubspot';

export default class Home extends PageManager {
  constructor(context) {
    super(context);
    // Reflektion setup
    //this.reflektion = new Reflektion(this.context);
    // Hubspot featured blogs
    //this.Hubspot = new Hubspot();
  }

  onReady() {
    // console.log('homepage');
  }
}

export default class GetRelatedByCategory {
    constructor(context) {
        this.context = context;
    }

    init() {
        if (!'IntersectionObserver' in window &&
            !'IntersectionObserverEntry' in window &&
            !'IntersectionRatio' in window.IntersectionObserverEntry.prototype) {
            const stickyEl = document.querySelector('.sticky-info-sentinel');
            const stuckEl = document.querySelector('.sticky-info');
    
            const observer = new IntersectionObserver(function(entries) {
                // no intersection with screen
                if(entries[0].intersectionRatio === 0)
                    stuckEl.classList.add('js-stuck');
                // fully intersects with screen
                else if(entries[0].intersectionRatio === 1)
                    stuckEl.classList.remove("js-stuck");
                }, { 
                    threshold: [0,1] 
                });
    
            observer.observe(stickyEl);
        }
    }
}

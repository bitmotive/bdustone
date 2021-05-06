import GrooveInteractiveComponents from './components/interactive/base';
import GrooveStructureComponents from './structure/base';
import GrooveBasicComponents from './components/basic/base';
import exportedSettings from './exportedSettings';

export default class Groove {
    constructor(context) {
        this.context = context;
    }

    init() {
        this.grooveInteractiveComponents = new GrooveInteractiveComponents(this.context);
        this.grooveInteractiveComponents.init();
        this.grooveStructureComponents = new GrooveStructureComponents(this.context);
        this.grooveStructureComponents.init();
        this.grooveBasicComponents = new GrooveBasicComponents(this.context);
        this.grooveBasicComponents.init();
        //console.log(exportedSettings);
    }
}

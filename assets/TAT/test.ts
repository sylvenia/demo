import { Listener } from './listener';
import { GlobalInstance } from './bootstrap';

export class TestModel extends Listener {

    constructor(global: GlobalInstance) {
        super('onTestSignal', () => this);
        this.setDestroyTrigger(global.destroyTrigger);
    }
}

export class TestController extends Listener {

    constructor(global: GlobalInstance, testModel: TestModel) {
        super();
        this.setDestroyTrigger(global.destroyTrigger);

        // 关联当前控制器实例到模型实例
        testModel.subscribe(this);
    }

    onTestSignal(testModel) {
        console.log('onTestSignal', this, testModel);
    }
}

export class TestView extends Listener {

    constructor(global: GlobalInstance, testModel: TestModel) {
        super();
        this.setDestroyTrigger(global.destroyTrigger);

        testModel.subscribe(this);
    }

    onTestSignal(testModel) {
        console.log('onTestSignal', this, testModel);
    }
}
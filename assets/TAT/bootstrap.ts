import { Subject } from 'rxjs';
import { TestModel, TestController, TestView } from './test';

export interface GlobalInstance {
    destroyTrigger: Subject<any> | null,
}

export class InitHelper {

    _global: GlobalInstance;

    constructor() {
        this.init();
    }

    init() {
        this._global = { destroyTrigger: new Subject() };
    }

    buildTestModel() {
        return new TestModel(this._global);
    }
    buildTestController(testModel: TestModel) {
        return new TestController(this._global, testModel);
    }
    buildTestView(testModel: TestModel) {
        return new TestView(this._global, testModel);
    }
}
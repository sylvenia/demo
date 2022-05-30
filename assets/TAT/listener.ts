import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class Listener {
    _listeners: any[] = [];
    _notifyCallbackName: string = '';
    _getStateCallback: any;
    _trigger = new Subject();

    _destoryTrigger$: Subject<any> | null = null;

    constructor(notifyCallbackName?, getStateCallback?) {
        this._notifyCallbackName = notifyCallbackName;
        this._getStateCallback = getStateCallback;
    }

    public subscribe(listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
    }

    setDestroyTrigger(trigger) {
        this._destoryTrigger$ = trigger;

        this.initSubscriber();
    }

    unsubscribeAll() {
        this._listeners = [];
    }

    unsubscribe(listener) {
        let target = this._listeners.indexOf(listener);
        if (target !== -1) {
            this._listeners.splice(target, 1);
        }
    }

    /** 在当前实例发生变化时, 通知所有相关监听实例该信号, 同时传递自身实例 */
    public notify() {
        for (let listener of this._listeners) {
            if (listener) {
                let obj = {
                    callbackName    : this._notifyCallbackName, // 信号名
                    callbackTarget  : this._getStateCallback()  
                    // _getStateCallback通常的实现是"() => this", 可传递来源实例
                };

                listener._trigger.next(obj);
            }
        }
    }

    initSubscriber(): void {
        this._trigger
        .pipe(
            takeUntil(this._destoryTrigger$)
        )
        .subscribe(
            (res: any) => {
                if (this[res.callbackName] instanceof Function) {
                    this[res.callbackName](res.callbackTarget);
                } else {
                    throw Error('缺少执行函数');
                }
            }
        );
    }
}
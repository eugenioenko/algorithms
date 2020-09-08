
function map(mapper) {
    return function(source) {
        return new Observable(observer =>
            source.subscribe(
                value => observer.next(mapper(value)),
                error => observer.error(error),
                () => observer.complete()
            )
        );
    }
}

function tap(tapper) {
    return function(source) {
        return new Observable(observer =>
            source.subscribe(
                value => {
                    tapper(value);
                    return observer.next(value);
                },
                error => observer.error(error),
                () => observer.complete()
            )
        );
    }
}

function takeWhile(predicate) {
    return function(source) {
        return new Observable(observer =>
            source.subscribe(
                value => {
                    if(predicate(value)) {
                        return observer.next(value);
                    } else {
                        return observer.complete();
                    }
                },
                error => observer.error(error),
                () => observer.complete()
            )
        );
    }
}

function finalize(finalizer) {
    return (source) => new Observable(observer => {
        return source.subscribe(
            value => observer.next(value),
            error => observer.error(error),
            () => observer.complete(finalizer())
        );
    });
}

function of(value) {
    return new Observable(observer => {
        observer.next(value);
    });
}

class Observer {

    constructor(next, error, complete) {
        this._next = next || null;
        this._error = error || null;
        this._complete = complete || null;
        this.subscribed = true;
        this._unsubscribe = null;
    }

    next(value) {
        if (this.subscribed && this._next) {
            try {
                this._next(value);
            } catch (error) {
                this.unsubscribe();
                throw error;
            }
        }
    }

    error(error) {
        if (this.subscribed && this._error) {
            try {
                this._error(error);
            } catch (err2) {
                this.unsubscribe();
                throw err2;
            }
            this.unsubscribe();
        }
    }

    complete() {
        if (this.subscribed && this._complete) {
            try {
                this._complete();
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
            this.unsubscribe();
        }
    }

    unsubscribe() {
        this.subscribed = false;
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
}

class Observable {

    constructor(source) {
        this.source = source;
    }

    subscribe(next, error, complete) {
        const observer = new Observer(next, error, complete);
        observer._unsubscribe = this.source(observer);
        return observer.unsubscribe.bind(observer);
    }

    pipe(...functions) {
        let observable = this;
        for (const fn of functions) {
            observable = fn(observable)
        }
        return observable;
    }

}

const obs = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
}).pipe(
    finalize(() => console.log('finalized 1')),
    takeWhile(value => value !== 3),
    map(x => x + '?'),
    tap(x => console.log('taped ' + x)),
    map(x => x + '!'),
    finalize(() => console.log('finalized 2'))
).subscribe(
    (x) => console.log(`subscribed ${x}`),
    null,
    (x) => console.log('completed')
);

of('test').pipe(
    tap(value => console.log(value))
).subscribe();



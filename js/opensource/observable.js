/***************************************************************
*
* Observable
* 
// Listener.
var observable = new Observable();

observable.listen('myEvent', function(observable, eventType, data) {
    // Handle myEvent.
    // console.log('Listener hear: ' + data);
});

// Subject.
observable.dispatchEvent('myEvent', 'Subject1 call');
observable.dispatchEvent('myEvent', 'Subject2 call');
***************************************************************/

var Observable;
(Observable = function () {
}).prototype = {
    listen: function (type, method, scope, context) {
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])) {
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    },
    dispatchEvent: function (type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])) {
            return;
        }
        for (let i = 0, n = handlers.length; i < n; i++) {
            handler = handlers[i];
            if (typeof (context) !== "undefined" && context !== handler.context) continue;
            if (handler.method.call(
                handler.scope, this, type, data
            ) === false) {
                return false;
            }
        }
        return true;
    }
};
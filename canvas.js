/**
 * Author: <James Rickard> james@frodosghost.com
 * 
 * Project: Canvas
 * Version: 1.1.0
 *
 * Description: 
 * 
*/
(function(){

var Canvas = {
    version:       '1.0.1',
    timeout:       null,
    timeout_limit: 100,

    /**
     * Creates BreakEvent and fires attached to the window
     */
    broadcast: function() {
        var evt;

        if (document.createEvent) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent('breakevent', true, true);

            evt.width = this.width();

            window.dispatchEvent(evt);
        } else {
            evt = document.createEventObject();
            evt.eventType = 'breakevent';

            evt.width = this.width();

            window.fireEvent(evt.eventType, evt);
        }

        return evt;
    },

    /**
     * Determines width of Browser taking into account Internet Explorer
     *
     * @source http://j.mp/PfjwFc JavaScript window resizing
     */
    width: function() {
        var width;

        if (self.innerHeight) {
            // all except Explorer
            width = self.innerWidth;
        } else if (document.documentElement && document.documentElement.clientHeight) {
            // Explorer 6 Strict Mode
            width = document.documentElement.clientWidth;
        } else if (document.body) {
            // other Explorers
            width = document.body.clientWidth;
        }

        return width;
    },

    /**
     * Adds timeout to resize function to limit listener calls
     */
    onresize: function() {
        if (this.timeout !== null) clearTimeout(this.timeout);

        this.timeout = setTimeout(function() {
            Canvas.broadcast();
        }, this.timeout_limit);
    },
};

// Determines if value exists between the Max and Min values provided in object
Object.prototype.between = function(value) {
    if (typeof this.min !== 'number') {
        this.min = 0;
    }
    // If there is no max value in this array then we assume there is no high value
    if (typeof this.max !== 'number') {
        return (value >= this.min);
    }

    return (value > this.min && value <= this.max);
};

/**
 * Wrapper function to contain Canvas onresize events and allow extended and changed
 * by other javascript code added below.
 */
(function() {
    var resize = window.onresize;

    window.onresize = function () {
        Canvas.onresize();
        // Fire stored events
        if (typeof resize === 'function') {
            resize();
        };
    };
})();

})();
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
    version:       '1.1.0',
    timeout:       null,
    timeout_limit: 100,

    /**
     * Creates BreakEvent and fires attached to the window
     */
    broadcast: function() {
        var evt,
            media = MediaQuery;

            // Set current width to MediaQuery
            media.set('width', this.width());
            media.set('deviceWidth', window.screen.width);

        if (document.createEvent) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent('breakevent', true, true);

            evt.media = media;

            window.dispatchEvent(evt);
        } else {
            evt = document.createEventObject();
            evt.eventType = 'breakevent';

            evt.media = media;

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

var MediaQuery = {
    version:     '1.0.0',
    width:       null,
    deviceWidth: null,
    features:    {minWidth: '>=', maxWidth: '<=', minDeviceWidth: '>=', maxDeviceWidth: '<=', orientation: '=='},

    /**
     * Determines if the Media Features are correctly defined in the .media.query() on the event
     */
    validate: function(parameters) {
        for(var key in parameters) {
            if (!(key in this.features)) {
                throw new Error('The parameter "'+ key + '" does not exist in the Media Query Features.');
            }
        };

        return this;
    },

    /**
     * Initiates a media query.
     * Evaluates object passed and returns boolean from passed parameters
     */
    query: function(parameters) {
        try {
            this.validate(parameters);
        } catch (e) {
            if (console) console.log(e);
        }

        for (var key in parameters) {
            if (this.features.hasOwnProperty(key)) {
                switch (key) {
                    case 'minWidth':
                        if (!(this.width >= parameters[key])) return false;
                        break;
                    case 'maxWidth':
                        if (!(this.width <= parameters[key])) return false;
                        break;
                    case 'minDeviceWidth':
                        if (!(parameters[key] >= this.deviceWidth)) return false;
                        break;
                    case 'maxDeviceWidth':
                        if (!(parameters[key] <= this.deviceWidth)) return false;
                        break;
                    default:
                        return false;
                        break;
                }
            }
        }

        return true;
    },

    set: function(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
        }

        return this;
    }
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

// Fire initial broadcast to establish browser width
Canvas.broadcast();
})();

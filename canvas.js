/**
 * Author: <James Rickard> james@frodosghost.com
 * 
 * Project: Canvas
 * Version: α
 *
 * Description: Adds a resize event to the browser that triggers at specific dimensions.
 * This can be listened for in a javascript framework to adjust image sizes.
 * 
*/
(function(){

    var document = this.document;
    var window = document.window = this;

    var Canvas = this.Canvas = {
        version:     '1.0.0',

        timer:       false,
        width:       null,
        breakpoint:  null,
        pixel_ratio: ("devicePixelRatio" in window) ? devicePixelRatio : 1,
        resize:      window.onresize,

        // Instance parameters
        _parameters: {
            // Setup as array to make sorting for priority easier
            breakpoints: [
                {
                    name: 'mobile',
                    max: 767
                },
                {
                    name: 'tablet',
                    min: 768,
                    max: 1027
                },
                {
                    name: 'desktop',
                    min: 1028,
                    max: 1823
                },
                {
                    name: 'large',
                    min: 1824
                }
            ],
            timeout_limit: 100
        },

        initialize: function(parameters) {
            // Override default parameters
            this.overrideDefaultParameters(parameters || {});

            this.configureBreakpoints();

            // Establish current browser width and therefore detemine set breakpoint
            this.establish();

            this.broadcast();
        },

        overrideDefaultParameters: function (parameters)
        {
            for (var parameter in this._parameters)
            {
                if (typeof parameters[parameter] !== 'undefined')
                {
                    this._parameters[parameter] = parameters[parameter];
                }
            }

            return this;
        },

        configureBreakpoints: function() {
            var breakpoints = this.get('breakpoints'),
                sort = [];

            for(var name in breakpoints) {
                if (breakpoints.hasOwnProperty(name)) {
                    if (typeof breakpoints[name].min !== 'number') {
                        breakpoints[name].min = 0;
                    }
                }
            }

            this.get('breakpoints').sort(this.sortByMinimum);

            return this;
        },

        establish: function(width) {
            var width       = (typeof width == 'number') ? width : this.getWidth(),
                breakpoints = this.get('breakpoints');

            for(var name in breakpoints) {
                if (breakpoints.hasOwnProperty(name)) {
                    if (width > breakpoints[name].min && width <= breakpoints[name].max) {
                        return this.breakpoint = breakpoints[name].name;
                    }
                }
            }
        },

        sortByMinimum: function(a, b) {
            return (a.min - b.min !== 0) ? (a.min - b.min) : (a.max - b.max);
        },

        broadcast: function() {
            var evt;

            if (document.createEvent) {
                evt = document.createEvent('HTMLEvents');
                evt.initEvent('breakevent', true, true);

                evt.canvas = this.current();

                window.dispatchEvent(evt);
            } else {
                evt = document.createEventObject();
                evt.eventType = 'breakevent';

                evt.canvas = this.current();

                window.fireEvent(evt.eventType, evt);
            }

            return evt;
        },

        /**
         * Determines width of Browser taking into account Internet Explorer
         *
         * @source http://j.mp/PfjwFc JavaScript window resizing
         */
        getWidth: function() {
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
         * Returns object of public avialable information for Event
         */
        current: function() {
            this.establish();

            return {
                width:      this.getWidth(),
                breakpoint: this.breakpoint
            };
        },

        onresize: function() {
            if (this.timeout !== null) clearTimeout(this.timeout);

            this.timeout = setTimeout(function() {
                Canvas.broadcast();
            }, this.get('timeout_limit'));
        },

        get: function(parameter) {
            return (this._parameters[parameter] !== 'undefined') ? this._parameters[parameter] : false;
        }

    };

    Object.prototype.canvas = (function(){
        Canvas.initialize();
    })();

    window.onresize = function () {
        if (Canvas.resize) {
            Canvas.resize();
        }

        Canvas.onresize();
    }

})();

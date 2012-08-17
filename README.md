# Canvas
Another take at javascript CSS Media Queries. It adds a new event to the window, which is fired on resize of the window. The event includes a MediaQuery object that evaluates parameters as media queries.

## Setup
You can include Canvas in the header or footer of your HTML page.

## Features
* Fires an event attached to the window on resize
* Uses native event for easy use in external frameworks
* Evaluates parameters for media query

##Example
The returned event contains a MediaQuery object. The query function takes an object that is configured with the media query to evaluate.

        window.addEventListener('breakevent', function(event){
            if (event.media.query({minWidth: 0, maxWidth: 320})) {
                console.log('Smartphones (portrait) -----------');
            };

            if (event.media.query({minDeviceWidth: 768, maxDeviceWidth: 1024})) {
               console.log('iPads (portrait and landscape) -----------');
            };
        });

## Options
The class will broadcast an initial event once it is setup. Alternatively you can broadcast the event after the listeners have been configured - for example as the last item in the DomReady function.

        window.canvas.broadcast();

### Mootools
At this stage the following code will enable the event to work with the Mootools function `addEvent`.

        /**
         * Setup Mootools handling of Native Events.
         * Moves the Media object up onto the MooTools Event.
         */
        Element.NativeEvents.breakevent = 2;
        Element.Events.breakevent = {
            condition: function(event) {
                if (event.type == 'breakevent') event.media = event.event.media;
                return event;
            }
        };

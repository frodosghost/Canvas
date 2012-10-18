# Canvas
Another take at javascript CSS Media Queries for handling responsive websites. It adds a new event to the window, which is fired on resize of the window. The event includes a MediaQuery object that evaluates parameters as media queries.

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

## Frameworks
Some frameworks overwrite the existing elements with their own configuration, thus removing the extensions added within Canvas. To re-attach the functions added with Canvas some snippets will need to be included.

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

#### Example

    window.addEvent('breakevent', function(event){
        if (event.media.query({maxWidth: 320})) {
            console.log('Smartphones (portrait) -----------');     
        }
    });

### jQuery
The following code will enable the returned event in jQuery to work with the `bind` event. Thanks to Ben Alman and his article on [jQuery Special Events](http://benalman.com/news/2010/03/jquery-special-events).

    (function($){
        // Handle event definition to delegate media object onto Event
        $.event.special.breakevent = {
            add: function(handleObj) {
                var old_handler = handleObj.handler;

                handleObj.handler = function(event) {
                    if (event.type == 'breakevent') event.media = event.originalEvent.media;

                    return old_handler.apply( this, arguments );
                };
            }
        };
    })(jQuery);

#### Example

    $(window).bind('breakevent', function(event){
        if (event.media.query({minWidth: 768, maxWidth: 1027})) {
            console.log('iPads (portrait and landscape) -----------');
        }
    });

## Changelog

* 1.1.1 :: Updated ___broadcast___ function to include try/catch for IE8 issue.


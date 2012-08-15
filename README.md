# Canvas

Add a javascript event to the window of a browser which is fired on resize of the window.

##Example
The __breakevent__ is fired after a timeout.

        window.addEventListener('breakevent', function(event) {
            console.log(event.width);
        });


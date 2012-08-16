# Canvas

Add a javascript event to the window of a browser which is fired on resize of the window.

##Example
The returned event contains a MediaQuery object. The query function takes an object that is configured with the media query to evaluate.

        window.addEventListener('breakevent', function(event){
            if (event.media.query({minWidth: 0, maxWidth: 320})) {
                console.log('Smartphones (portrait) -----------');
            }
        });

export function flyTo(location, view, done) {
    let duration = 2000;
    let zoom = view.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate({
        center: location,
        duration: duration
    }, callback);
    view.animate({
        zoom: zoom - 1,
        duration: duration / 2
    }, {
        zoom: zoom,
        duration: duration / 2
    }, callback);
}

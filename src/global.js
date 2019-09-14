import OlStyleStyle from 'ol/style/Style';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';

export const DEFAULT_POINT_STYLE = new OlStyleStyle({
    image: new OlStyleCircle({
        radius: 7,
        fill: new OlStyleFill({
            color: 'rgba(154, 26, 56, 0.5)'
        }),
        stroke: new OlStyleStroke({
            color: 'rgba(154, 26, 56, 0.8)'
        })
    })
});

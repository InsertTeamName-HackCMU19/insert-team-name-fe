import OlStyleStyle from 'ol/style/Style';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';

export const SERVER_URL = 'http://localhost:5000/';

export const getStrikeStyleIndex = (pt1, pt2, styleIndex) => {
    if (pt1.building === pt2.building && pt1.floor !== pt2.floor)
        return (styleIndex + 1) % DEFAULT_STRIKE_STYLES.length;
    return styleIndex;
};

export const DEFAULT_STRIKE_STYLE = new OlStyleStyle({
    stroke: new OlStyleStroke({
        color: 'red',
        width: 3
    })
});
export const DEFAULT_STRIKE_STYLES = [
    DEFAULT_STRIKE_STYLE,
    new OlStyleStyle({
        stroke: new OlStyleStroke({
            color: 'orange',
            width: 3
        })
    }),
    new OlStyleStyle({
        stroke: new OlStyleStroke({
            color: 'yellow',
            width: 3
        })
    }),
    new OlStyleStyle({
        stroke: new OlStyleStroke({
            color: 'green',
            width: 3
        })
    }),
    new OlStyleStyle({
        stroke: new OlStyleStroke({
            color: 'blue',
            width: 3
        })
    }),
    new OlStyleStyle({
        stroke: new OlStyleStroke({
            color: 'indigo',
            width: 3
        })
    }),
    new OlStyleStyle({
        stroke: new OlStyleStroke({
            color: 'violet',
            width: 3
        })
    }),
];


export const DEFAULT_POINT_STYLE = new OlStyleStyle({
    image: new OlStyleCircle({
        radius: 5,
        fill: new OlStyleFill({
            color: 'rgba(154, 26, 56, 0.5)'
        }),
        stroke: new OlStyleStroke({
            color: 'rgba(154, 26, 56, 0.8)'
        })
    })
});

import React, {Component} from 'react';

import './App.css';
import 'ol/ol.css';
import 'antd/dist/antd.css';
import './react-geo.css';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerVector from 'ol/layer/Vector'
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlFeature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj';
import OlPoint from 'ol/geom/Point';
import OlStyle from 'ol/style/Style';
import {
    SimpleButton,
    MapComponent
} from '@terrestris/react-geo';

import {
    DEFAULT_POINT_STYLE, DEFAULT_POINT_STYLE_CONFIG,
    DEFAULT_STRIKE_STYLE,
    DEFAULT_STRIKE_STYLES, FONT,
    getStrikeStyleIndex
} from './global';
import {MainDrawer} from './component/MainDrawer';
import {Point} from './model';
import OlLineString from "ol/geom/LineString";
import {getNavigation} from "./http/api";
import {flyTo} from "./util";
import Text from "ol/style/Text";

function fromLatLon([lat, lon]) {
    return fromLonLat([lon, lat])
}

const center = [-8899342.494183049,4930561.23767311];
// console.log(center)

const minc = fromLatLon([40.440969, -79.948325]);
const maxc = fromLatLon([40.444463, -79.938144]);
// console.log(minc)
// console.log(maxc)

const extent = [...minc, ...maxc];
const layer = new OlLayerTile({
    source: new OlSourceOsm()
});
const vector = new OlLayerVector({
    source: new VectorSource({
        features: []
    }),
    style: [
        DEFAULT_STRIKE_STYLE,
        DEFAULT_POINT_STYLE
    ]
});
const measure = new OlLayerVector({
    source: new VectorSource({
        features: []
    }),
    style: [
        DEFAULT_STRIKE_STYLE,
        DEFAULT_POINT_STYLE
    ]
});
const map = new OlMap({
    view: new OlView({
        center: center,
        minZoom: 17.25,
        zoom: 18,
        extent: extent
    }),
    layers: [layer, vector, measure]
});
map.on('postcompose', map.updateSize);

class App extends Component {
    state = {
        visible: true,
        navigationPts: [
            // new Point({cor: [-8899299.098043324, 4930553.531049207], floor: -1, building: 'OUTSIDE'}),
            // new Point({cor: [-8899405.653601632, 4930565.239459672], floor: 5, building: 'GHC'}),
            // new Point({cor: [-8899405.653601632, 4930565.239459672], floor: 4, building: 'GHC'}),
            // new Point({cor: [-8899472.670471756, 4930580.221674304], floor: 4, building: 'NSH'}),
            // new Point({cor: [-8899509.770970259, 4930550.261168113], floor: 4, building: 'NSH'}),
            // new Point({cor: [-8899534.578520462, 4930467.462757293], floor: 4, building: 'WEH'}),
        ],
        loading: false
    };

    toggleDrawer = () => {
        this.setState({visible: !this.state.visible});
    };

    updateNavigationPts = async (start, end) => {
        try {
            let objs = await getNavigation(start, end);
            let points = objs.map((obj) => new Point(obj));
            this.setState({navigationPts: points}, () => {
                vector.getSource().clear();
                let newFeatures = [];
                let lastIndex = this.state.navigationPts.length - 1;
                let styleIndex = 0;
                let status = '';
                let prevPtFeat;
                let prevTextToShow = '';
                let beginDownstairs = false;

                this.state.navigationPts.forEach((pt, i) => {
                    let newPtFeat = new OlFeature(new OlPoint(pt.cor));
                    let textToShow = '';

                    if (i === 0) {
                        textToShow = start;
                        if (lastIndex > 0 && this.state.navigationPts[1].floor < pt.floor) {
                            beginDownstairs = true;
                        }
                    } else {
                        let prevPt = this.state.navigationPts[i - 1];
                        let newLineFeat = new OlFeature(new OlLineString([prevPt.cor, pt.cor]));
                        styleIndex = getStrikeStyleIndex(prevPt, pt, styleIndex);
                        newLineFeat.setStyle(DEFAULT_STRIKE_STYLES[styleIndex]);
                        newFeatures.push(newLineFeat);

                        if (i === lastIndex) {
                            textToShow = end;
                        }

                        if (pt.building === prevPt.building) {
                            if (pt.floor > prevPt.floor) {
                                console.log('u');
                                status = 'Upstairs';
                                // if (status !== 'Upstairs') {
                                //     prevTextToShow = prevTextToShow === '' ? status : prevTextToShow;
                                //
                                // }
                            } else if (pt.floor < prevPt.floor) {
                                console.log('d');
                                status = 'Downstairs';
                                // if (status !== 'Downstairs') {
                                //     prevTextToShow = prevTextToShow === '' ? status : prevTextToShow;
                                //     status = 'Downstairs';
                                //
                                //     if (beginDownstairs) {
                                //         prevTextToShow = ''
                                //     }
                                //     beginDownstairs = false;
                                // }
                            } else {
                                console.log('s');
                                if (status === 'Upstairs' || status === 'Downstairs') {
                                    prevTextToShow = prevTextToShow === '' ? status : prevTextToShow;
                                    if (status === 'Downstairs' && beginDownstairs) {
                                        prevTextToShow = '';
                                        beginDownstairs = false;
                                    }
                                    status = ''
                                }
                            }
                        }
                    }

                    if (prevTextToShow.length && i < lastIndex) {
                        prevPtFeat.setStyle(new OlStyle({
                            ...DEFAULT_POINT_STYLE_CONFIG,
                            text: new Text( {
                                text: '\n\n\n' + prevTextToShow + '\nto floor ' + pt.floor,
                                font: FONT
                            })
                        }));
                    }

                    if (textToShow.length) {
                        newPtFeat.setStyle(new OlStyle({
                            ...DEFAULT_POINT_STYLE_CONFIG,
                            text: new Text( {
                                text: '\n\n' + textToShow,
                                font: FONT
                            })
                        }));
                    }

                    prevPtFeat = newPtFeat;
                    prevTextToShow = textToShow;
                    newFeatures.push(newPtFeat);
                });
                vector.getSource().addFeatures(newFeatures);

                let newCor = this.state.navigationPts[0].averageCorWith(this.state.navigationPts[lastIndex]);

                setTimeout(() => {
                    flyTo(newCor, map.getView(), (complete) => {})
                }, 1);
            });
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        return (
            <div className="App">
                <MapComponent
                    map={map}
                />
                <SimpleButton
                    style={{position: 'fixed', top: '30px', right: '30px'}}
                    onClick={this.toggleDrawer}
                    icon="bars"
                />
                <MainDrawer
                    map={map}
                    layer={measure}
                    toggleDrawer={this.toggleDrawer}
                    visible={this.state.visible}
                    updateNavigationPts={this.updateNavigationPts}
                    pts={this.state.pts}
                />
            </div>
        );
    }
}

export default App;

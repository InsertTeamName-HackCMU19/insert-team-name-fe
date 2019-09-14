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
import {
    SimpleButton,
    MapComponent
} from '@terrestris/react-geo';

import {
    DEFAULT_POINT_STYLE,
    DEFAULT_STRIKE_STYLE,
    DEFAULT_STRIKE_STYLES,
    getStrikeStyleIndex
} from './global';
import {MainDrawer} from './component/MainDrawer';
import {Point} from './model';
import OlLineString from "ol/geom/LineString";
import {getNavigation} from "./http/api";

function fromLatLon([lat, lon]) {
    return fromLonLat([lon, lat])
}

const center = fromLatLon([40.4424589, -79.9427253]);
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
        zoom: 17.25,
        extent: extent
    }),
    layers: [layer, vector, measure]
});
map.on('postcompose', map.updateSize);

class App extends Component {
    state = {
        visible: false,
        navigationPts: [
            // new Point({cor: [-8899299.098043324, 4930553.531049207], floor: -1, building: 'OUTSIDE'}),
            // new Point({cor: [-8899405.653601632, 4930565.239459672], floor: 5, building: 'GHC'}),
            // new Point({cor: [-8899405.653601632, 4930565.239459672], floor: 4, building: 'GHC'}),
            // new Point({cor: [-8899472.670471756, 4930580.221674304], floor: 4, building: 'NSH'}),
            // new Point({cor: [-8899509.770970259, 4930550.261168113], floor: 4, building: 'NSH'}),
            // new Point({cor: [-8899534.578520462, 4930467.462757293], floor: 4, building: 'WEH'}),
        ]
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
                let styleIndex = 0;
                this.state.navigationPts.forEach((pt, i) => {
                    let newPtFeat = new OlFeature(new OlPoint(pt.cor));
                    if (i > 0) {
                        let prevPt = this.state.navigationPts[i - 1];
                        let newLineFeat = new OlFeature(new OlLineString([prevPt.cor, pt.cor]));
                        styleIndex = getStrikeStyleIndex(prevPt, pt, styleIndex);
                        newLineFeat.setStyle(DEFAULT_STRIKE_STYLES[styleIndex]);
                        newFeatures.push(newLineFeat);
                    }
                    newFeatures.push(newPtFeat);
                });
                vector.getSource().addFeatures(newFeatures);
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

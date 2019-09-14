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
import {Style, Stroke} from 'ol/style'
import OlPoint from 'ol/geom/Point';
import {
    SimpleButton,
    MapComponent
} from '@terrestris/react-geo';
import MeasureUtil from '@terrestris/ol-util/dist/MeasureUtil/MeasureUtil';

import {DEFAULT_POINT_STYLE} from './global';
import {MainDrawer} from './component/MainDrawer';
import {Point} from './model';
import OlLineString from "ol/geom/LineString";

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
        features: [
            // new OlFeature(
            //     fromExtent(extent)
            // ),
        ]
    }),
    style: [
        new Style({
            stroke: new Stroke({
                color: 'red',
                width: 3
            })
        }),
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
    layers: [layer, vector]
});

map.on('postcompose', map.updateSize);

class App extends Component {
    state = {
        visible: false,
        pts: [],
        visiblePts: [
            new Point({name: 'test1', cor: [-8899141.351290151, 4930638.34199632]}),
            new Point({name: 'test2', cor: [-8899183.47302255, 4930449.066277721]}),
        ]
    };

    toggleDrawer = () => {
        this.setState({visible: !this.state.visible});
    };

    onAddPt = (event) => {
        let pt = new Point({
            name: '',
            cor: event.target.sketchCoords_
        });
        console.log(event.target.sketchCoords_);
        if (this.state.pts.length > 0) {
            let newLine = new OlLineString([this.state.pts[this.state.pts.length - 1].cor, pt.cor]);
            // vector.getSource().addFeature(new OlFeature(newLine));
            console.log(MeasureUtil.formatLength(newLine, map, 2));
        }
        this.setState({
            pts: [...this.state.pts, pt]
        });
    };

    updateVisiblePts = () => {
        vector.getSource().addFeatures(this.state.visiblePts.map(
            (pt) => new OlFeature(new OlPoint(pt.cor))
        ));
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
                    toggleDrawer={this.toggleDrawer}
                    visible={this.state.visible}
                    updateVisiblePts={this.updateVisiblePts}
                    onAddPt={this.onAddPt}
                    pts={this.state.pts}
                />
            </div>
        );
    }
}

export default App;

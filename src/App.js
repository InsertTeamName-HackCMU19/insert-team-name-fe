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
import VectorSource from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj';
import {Style, Stroke} from 'ol/style'
import OlFeature from 'ol/Feature';
import {fromExtent} from 'ol/geom/Polygon';
import {Drawer} from 'antd';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import {
    SimpleButton,
    DigitizeButton,
    MapComponent,
    NominatimSearch,
    // MeasureButton
} from '@terrestris/react-geo';

function fromLatLon([lat, lon]) {
    return fromLonLat([lon, lat])
}

const center = fromLatLon([40.4424589, -79.9427253])
// console.log(center)

const minc = fromLatLon([40.440969, -79.948325])
const maxc = fromLatLon([40.444463, -79.938144])
// console.log(minc)
// console.log(maxc)
const extent = [...minc, ...maxc]

const layer = new OlLayerTile({
    source: new OlSourceOsm()
});

const vector = new OlLayerVector({
    source: new VectorSource({
        features: [
            new OlFeature(
                fromExtent(extent)
            )
        ]
    }),
    style: [
        new Style({
            stroke: new Stroke({
                color: 'red',
                width: 3
            })
        })
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
    state = {visible: false};

    toggleDrawer = () => {
        this.setState({visible: !this.state.visible});
    }

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
                <Drawer
                    title="react-geo-application"
                    placement="right"
                    onClose={this.toggleDrawer}
                    visible={this.state.visible}
                    mask={false}
                >
                    <NominatimSearch
                        key="search"
                        map={map}
                    />
                    <ToggleGroup>
                        <DigitizeButton
                            name="drawPoint"
                            map={map}
                            drawType="Point"
                            onDrawEnd={(event)=> {
                                console.log(event.target.sketchCoords_)
                            }}
                        >
                            Draw point
                        </DigitizeButton>
                    </ToggleGroup>
                </Drawer>
            </div>
        );
    }
}

export default App;

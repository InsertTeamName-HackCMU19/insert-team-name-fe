import React, {Component} from "react";
import {DigitizeButton, MeasureButton, SimpleButton} from "@terrestris/react-geo";
import ToggleGroup from "@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup";
import MeasureUtil from '@terrestris/ol-util/dist/MeasureUtil/MeasureUtil';
import {Drawer, Input} from "antd";
import {Point} from "../model";
import OlLineString from "ol/geom/LineString";
// import OlFeature from "ol/Feature";
// import {getStrikeStyleIndex} from "../global";
import "../style/util.css"

export class MainDrawer extends Component {
    state = {
        startText: '',
        endText: '',
        pts: [],
    };

    onAddPt = (event) => {
        let pt = new Point({
            name: '',
            cor: event.target.sketchCoords_
        });
        console.log(event.target.sketchCoords_);
        if (this.state.pts.length > 0) {
            let prevPt = this.state.pts[this.state.pts.length - 1];
            // pt.floor = prevPt.floor + 1;
            let newLine = new OlLineString([prevPt.cor, pt.cor]);
            // let newLineFeat = new OlFeature(newLine);
            // newLineFeat.setStyle(getStrikeStyleIndex(prevPt, pt, 0));
            // this.props.layer.getSource().addFeature(newLineFeat);
            console.log(MeasureUtil.formatLength(newLine, this.props.map, 2));
        }
        this.setState({
            pts: [...this.state.pts, pt]
        });
    };

    render() {
        let devTools = null;
        if (process.env.NODE_ENV === 'development') {
            devTools = (
                <ToggleGroup>
                    <DigitizeButton
                        name="drawPoint"
                        map={this.props.map}
                        drawType="Point"
                        onDrawEnd={this.onAddPt}
                    >
                        Draw point
                    </DigitizeButton>
                    <MeasureButton
                        name="line"
                        map={this.props.map}
                        measureType="line"
                    >
                        Distance
                    </MeasureButton>
                </ToggleGroup>
            )
        }

        return (
            <Drawer
                title="react-geo-application"
                placement="right"
                onClose={this.props.toggleDrawer}
                visible={this.props.visible}
                mask={false}
            >
                <Input className="marginBottom" placeholder="Start" value={this.state.startText} onChange={(event) => {this.setState({startText: event.target.value})}}/>
                <Input className="marginBottom" placeholder="Destination" value={this.state.endText} onChange={(event) => {this.setState({endText: event.target.value})}}/>
                <SimpleButton
                    className="marginBottom"
                    onClick={() => {this.props.updateNavigationPts(this.state.startText, this.state.endText)}}
                    disabled={this.state.startText === '' && this.state.endText === ''}
                >Search</SimpleButton>
                {devTools}
                <ul>
                    {this.state.pts.map((pt, i) => (<li key={i}>{pt.toString()}</li>))}
                </ul>
            </Drawer>
        )
    }
}

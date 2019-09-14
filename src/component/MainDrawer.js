import React, {Component} from "react";
import {DigitizeButton, MeasureButton, SimpleButton} from "@terrestris/react-geo";
import ToggleGroup from "@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup";
import {Drawer, Input} from "antd";

export class MainDrawer extends Component {
    state = {
        startText: '',
        endText: ''
    };

    render() {
        return (
            <Drawer
                title="react-geo-application"
                placement="right"
                onClose={this.props.toggleDrawer}
                visible={this.props.visible}
                mask={false}
            >
                <Input style={{margin: '0 8px 8px 0'}} placeholder="Start" value={this.state.startText} onChange={(event) => {this.setState({startText: event.target.value})}}/>
                <Input style={{margin: '0 8px 8px 0'}} placeholder="Destination" value={this.state.endText} onChange={(event) => {this.setState({endText: event.target.value})}}/>
                <SimpleButton onClick={() => {this.props.updateNavigationPts(this.state.startText, this.state.endText)}}>Search</SimpleButton>
                <ToggleGroup>
                    <DigitizeButton
                        name="drawPoint"
                        map={this.props.map}
                        drawType="Point"
                        onDrawEnd={this.props.onAddPt}
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
                <ul>
                    {this.props.pts.map((pt, i) => (<li key={i}>{pt.toString()}</li>))}
                </ul>
            </Drawer>
        )
    }
}

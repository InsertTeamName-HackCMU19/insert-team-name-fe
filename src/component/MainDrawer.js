import React, {PureComponent} from "react";
import {DigitizeButton, MeasureButton, NominatimSearch, SimpleButton} from "@terrestris/react-geo";
import ToggleGroup from "@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup";
import {Drawer, Input} from "antd";

export class MainDrawer extends PureComponent {
    render() {
        return (
            <Drawer
                title="react-geo-application"
                placement="right"
                onClose={this.props.toggleDrawer}
                visible={this.props.visible}
                mask={false}
            >
                <Input placeholder="Start"/>
                <Input placeholder="Destination"/>
                <SimpleButton onClick={this.props.updateNavigationPts}>Search</SimpleButton>
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

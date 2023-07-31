import * as me from "melonjs";
import { box2d } from "./init-box2d.js";

export default class RayCastCallback {
    constructor(renderer, pixelsPerMeter, metaData) {
        this.renderer = renderer;
        this.pixelsPerMeter = pixelsPerMeter;
        this.metaData = metaData;

        const {
            b2Fixture,
            getPointer,
            JSRayCastCallback,
            wrapPointer
        } = box2d;

        const self = this;
        this.instance = Object.assign(new JSRayCastCallback(), {
            ReportFixture(fixture_p, point_p, normal_p, fraction) {
                const fixture = wrapPointer(fixture_p, b2Fixture);
                const name = self.metaData[getPointer(fixture)].name;
                console.log(name);
            }
        });
    }

    drawRay(from, to, color, thickness = 1) {
        this.renderer.setLineWidth(thickness);
        this.renderer.beginPath();
        const c = new me.Color().setFloat(color[0], color[1], color[2], 1);
        this.renderer.setColor(c);
        this.renderer.moveTo(from.x * this.pixelsPerMeter, from.y * this.pixelsPerMeter);
        this.renderer.lineTo(to.x * this.pixelsPerMeter, to.y * this.pixelsPerMeter);
        this.renderer.stroke();
    }
}

import * as me from "melonjs";
import { box2d, initBox2D } from "./init-box2d.js";
import DebugDrawer from "./debug-drawer.js";
import RayCastCallback from "./ray-cast-callback.js";

me.device.onReady(
    () => {
        if (!me.video.init(300, 300, {
                parent: "screen",
                renderer: me.video.CANVAS,
                scale: "fit",
                antiAlias: true
            })) //
        {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        async function init() {
            await initBox2D();

            class Graphics extends me.Renderable {
                constructor() {
                    super(0, 0, me.game.viewport.width, me.game.viewport.height);
                    this.anchorPoint.set(0, 0);

                    const {
                        b2_dynamicBody,
                        b2BodyDef,
                        b2CircleShape,
                        b2PolygonShape,
                        b2Vec2,
                        b2World,
                        getPointer
                    } = box2d;

                    this.world = new b2World();
                    const gravity = new b2Vec2(0, 9.8);
                    this.world.SetGravity(gravity);
                    this.pixelsPerMeter = 30;

                    this.debugDrawer = new DebugDrawer(me.game.renderer, this.pixelsPerMeter);
                    this.world.SetDebugDraw(this.debugDrawer.instance);

                    const metaData = {};

                    this.rayCastCallback = new RayCastCallback(me.game.renderer,
                        this.pixelsPerMeter, metaData);

                    // Ground
                    const groundBodyDef = new b2BodyDef();
                    groundBodyDef.set_position(new b2Vec2(150 / this.pixelsPerMeter, 285 / this.pixelsPerMeter));
                    const groundBody = this.world.CreateBody(groundBodyDef);
                    const groundShape = new b2PolygonShape();
                    groundShape.SetAsBox(270 / 2 / this.pixelsPerMeter, 15 / 2 / this.pixelsPerMeter);
                    const groundFixture = groundBody.CreateFixture(groundShape, 0);
                    metaData[getPointer(groundFixture)] = {
                        name: "ground"
                    };

                    // Circle
                    const circleBodyDef = new b2BodyDef();
                    circleBodyDef.type = b2_dynamicBody;
                    circleBodyDef.position = new b2Vec2(140 / this.pixelsPerMeter, 0 / this.pixelsPerMeter);
                    this.circleBody = this.world.CreateBody(circleBodyDef);
                    const circleShape = new b2CircleShape();
                    circleShape.m_radius = 20 / this.pixelsPerMeter;
                    const circleFixture = this.circleBody.CreateFixture(circleShape, 1);
                    circleFixture.SetRestitution(0.5);
                    metaData[getPointer(circleFixture)] = {
                        name: "circle"
                    };

                    // First platform
                    const firstPlatformBodyDef = new b2BodyDef();
                    firstPlatformBodyDef.set_position(new b2Vec2(225 / this.pixelsPerMeter,
                        150 / this.pixelsPerMeter));
                    firstPlatformBodyDef.angle = 0 * Math.PI / 180;
                    const firstPlatformBody = this.world.CreateBody(firstPlatformBodyDef);
                    const firstPlatformShape = new b2PolygonShape();
                    firstPlatformShape.SetAsBox(120 / 2 / this.pixelsPerMeter, 15 / 2 / this.pixelsPerMeter);
                    const firstPlatformFixture = firstPlatformBody.CreateFixture(firstPlatformShape, 0);
                    metaData[getPointer(firstPlatformFixture)] = {
                        name: "first platform"
                    };

                    // Second platform
                    const secondPlatformBodyDef = new b2BodyDef();
                    secondPlatformBodyDef.set_position(new b2Vec2(225 / this.pixelsPerMeter,
                        200 / this.pixelsPerMeter));
                    secondPlatformBodyDef.angle = 0 * Math.PI / 180;
                    const secondPlatformBody = this.world.CreateBody(secondPlatformBodyDef);
                    const secondPlatformShape = new b2PolygonShape();
                    secondPlatformShape.SetAsBox(120 / 2 / this.pixelsPerMeter, 15 / 2 / this.pixelsPerMeter);
                    const secondPlatformFixture = secondPlatformBody.CreateFixture(secondPlatformShape, 0);
                    metaData[getPointer(secondPlatformFixture)] = {
                        name: "second platform"
                    };
                }

                update(dt) {
                    this.world.Step(dt / 1000, 3, 2);
                    return true;
                }

                draw(renderer) {
                    const {
                        b2Vec2
                    } = box2d;

                    renderer.clearColor("#000000");
                    renderer.setGlobalAlpha(1);

                    this.world.DebugDraw();

                    const circlePosition = this.circleBody.GetPosition();
                    const circleRayEnd = new b2Vec2(circlePosition.x + 30 / this.pixelsPerMeter,
                        circlePosition.y);
                    this.world.RayCast(this.rayCastCallback.instance, circlePosition, circleRayEnd);
                    this.rayCastCallback.drawRay(circlePosition, circleRayEnd, [1, 0, 0], 3);
                }
            }

            me.game.world.addChild(new Graphics());
        }
        init();
    });

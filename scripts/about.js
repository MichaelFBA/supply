$(document).ready(function() {
  if ($('body').is('#about')) {

    var FamousEngine = famous.core.FamousEngine;
    var Camera = famous.components.Camera;
    var DOMElement = famous.domRenderables.DOMElement;
    var MountPoint = famous.components.MountPoint;
    var PhysicsEngine = famous.physics.PhysicsEngine;
    var Position = famous.components.Position;
    var Size = famous.components.Size;
    var Wall = famous.physics.Wall;
    var Sphere = famous.physics.Sphere;
    var Vec3 = famous.math.Vec3;
    var math = famous.math;
    var physics = famous.physics;
    var collision = famous.physics.Collision;
    var gestures = famous.components.GestureHandler;
    var Spring = famous.physics.Spring;
    var screenW = $('#signUpInteractive').width();
    var screenH = $('#signUpInteractive').height();
    var anchor = new Vec3(screenW / 2, screenH / 2, 0);
    var messages = ["Learn more about the world's best materials and craftspeople", "Find out about new products we produce them.", "Yes, maybe get a discount every so often"];
    console.log('width', screenW)
    console.log('height', screenH)
    console.log(famous)
    console.log('anchor', anchor)

    //Create Walls
    var rightWall = new Wall({
      direction: Wall.LEFT
    }).setPosition(screenW - 10, 0, 0);
    var leftWall = new Wall({
      direction: Wall.RIGHT
    }).setPosition(10, 0, 0);
    var topWall = new Wall({
      direction: Wall.DOWN
    }).setPosition(0, 10, 0);
    var bottomWall = new Wall({
      direction: Wall.UP
    }).setPosition(0, screenH - 10, 0);
    var walls = [topWall, rightWall, bottomWall, leftWall];
    var centerPoint;

    //Same friction
    var mass = 10,
      restitution = 0, // if the body rests
      friction = 0.3,
      stiffness = 30, // how fast it attracts to the center
      damping = -1;


    function Demo() {
      this.scene = FamousEngine.createScene('#signUpInteractive');
      // this.collision = new collision.({broadphase: 'BruteForce'});
      var broadPhase = new physics.Collision.BruteForceAABB([rightWall, leftWall, topWall, bottomWall]);
      this.collision = new collision([topWall], {
        'broadPhase': broadPhase
      });

      this.simulation = new PhysicsEngine();
      this.simulation.setOrigin(0.5, 0.5);
      this.simulation.addConstraint(this.collision);
      this.items = [];
      this.walls = [];

      //   var horizontalRule = this.scene.addChild()
      //     .setSizeMode(0, 1, 1)
      //     .setAbsoluteSize(null, 1, 10)
      //     .setAlign(0, 0.5);
      //   var verticalRule = this.scene.addChild()
      //     .setSizeMode(1, 0, 1)
      //     .setAbsoluteSize(1, null, 10)
      //     .setAlign(0.5, 0);
      //
      //   new DOMElement(horizontalRule, {
      //     properties: {
      //       'background-color': 'grey'
      //     }
      //   });
      //   new DOMElement(verticalRule, {
      //     properties: {
      //       'background-color': 'grey'
      //     }
      //   });

      //Create Email input
      createProductName.call(this);
      //Create Size
      for (var i = 0; i < messages.length; i++) {
        createText.call(this, messages[i]);
      }
      //Create cat
      createImage.call(this);

      //Create Walls
      var nodeTop = this.scene.addChild();
      createTopBottomWalls(nodeTop, walls[0]);

      var nodeRight = this.scene.addChild();
      createSideWalls(nodeRight, walls[1]);

      var nodeBottom = this.scene.addChild();
      createTopBottomWalls(nodeBottom, walls[2]);

      var nodeLeft = this.scene.addChild();
      createSideWalls(nodeLeft, walls[3]);

      var once = true;

      Demo.prototype.onUpdate = function(time) {
        this.simulation.update(time);

        //Postition walls
        var topWallPosition = topWall.getPosition();
        nodeTop.setPosition(topWallPosition.x, topWallPosition.y);

        var bottomWallPosition = bottomWall.getPosition();
        nodeBottom.setPosition(bottomWallPosition.x, bottomWallPosition.y);

        var rightWallPosition = rightWall.getPosition();
        nodeRight.setPosition(rightWallPosition.x, rightWallPosition.y);

        var leftWallPosition = leftWall.getPosition();
        nodeLeft.setPosition(leftWallPosition.x, leftWallPosition.y);

        //Position elements
        if (this.items.length > 0) {
          for (var i = 0; i < this.items.length; i++) {
            var itemPosition = this.simulation.getTransform(this.items[i][0]).position;
            this.items[i][1].set(itemPosition[0], itemPosition[1], 0);
          }
        }
        FamousEngine.requestUpdateOnNextTick(this);
      };
      FamousEngine.requestUpdateOnNextTick(this);
    }

    function createTopBottomWalls(node, wall) {
      var wallPos = wall.getPosition();
      node.setSizeMode('absolute', 'absolute', 'absolute').setAbsoluteSize(screenW, 10, 0);
      var wallDOMElement = new DOMElement(node, {
        tagName: 'div'
      }).setProperty('background-color', 'transparent');
    }

    function createSideWalls(node, wall) {
      var wallPos = wall.getPosition();
      node.setSizeMode('absolute', 'absolute', 'absolute').setAbsoluteSize(10, screenH, 0);
      var wallDOMElement = new DOMElement(node, {
        tagName: 'div'
      }).setProperty('background-color', 'transparent');
    }

    function createProductName() {
      var signUpForm = '<h3 class="text-center mtl ptm mbt">Join the Supply mailing list</h3>' +
        '<form action="//supply.us10.list-manage.com/subscribe/post?u=97276da3f901250d5381a5d6f&amp;id=ef4ea557fb" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate row" target="_blank" novalidate="" _lpchecked="1">' +
        '<div id="mc_embed_signup_scroll" class="form-group col-xs-7 col-xs-offset-2 prs">' +
        '<input type="email" value="" name="EMAIL" class="required email form-control" id="mce-EMAIL" placeholder="Enter your e-mail">' +
        '</div>' +
        '<div class="col-xs-2 phn">' +
        '<button type="submit" name="subscribe" id="mc-embedded-subscribe" class="btn btn-default"><i class="fa fa-chevron-right"></i></button>' +
        '</div>' +
        '<div id="mce-responses" class="clear"><div class="response" id="mce-error-response" style="display:none"></div><div class="response" id="mce-success-response" style="display:none"></div></div>' +
        '<div style="position: absolute; left: -5000px;"><input type="text" name="b_97276da3f901250d5381a5d6f_ef4ea557fb" tabindex="-1" value=""></div>' +
        '</form>';
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(220, 220)
      var position = new Position(node);
      var el = new DOMElement(node, {
        content: signUpForm,
        properties: {
          'background-color': '#000000',
          'color': '#ffffff',
          'border-radius': '50%'
        },
        classes: ['sign-up-sphere']
      });

      centerPoint = new Sphere({
        radius: 110,
        mass: 100000,
        restrictions: ['xy'],
        position: new Vec3(screenW / 2, screenH / 2, 0)
      });

      var spring = new Spring(null, centerPoint, {
        stiffness: 95,
        period: 0.6,
        dampingRatio: 1.0,
        anchor: new Vec3(screenW / 2, screenH / 2, 0)
      });
      centerPoint.setVelocity(0, 0, 0);
      this.simulation.add(centerPoint, spring);
      this.items.push([centerPoint, position]);
      this.collision.addTarget(centerPoint);
    }

    function createText(text) {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(130, 130);
      var position = new Position(node);
      var radius = 65;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        content: '<div class="pam vText"><span>' + text + '</span></div>',
        properties: {
          'background-color': '#000000',
          'border-radius': '50%',
          'color': '#ffffff',
          'font-weight': 'normal',
          'text-align': 'center',
          'line-height': '125px',
          'min-height': '130px'
        }
      });

      var satellite = new Sphere({
        radius: 65,
        mass: mass,
        position: new Vec3(x, y, 0),
        restitution: restitution,
        friction: friction
      });

      // Attach the box to the anchor with a `Spring` force
      var spring = new Spring(null, satellite, {
        stiffness: stiffness,
        damping: damping,
        anchor: anchor
      });

      satellite.setVelocity(0.1, 0.1, 0);
      this.simulation.add(satellite, spring);
      this.items.push([satellite, position]);
      this.collision.addTarget(satellite);
    }

    function createImage() {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(140, 140);
      var position = new Position(node);
      var radius = 70;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        properties: {
          'background-image': 'url(http://thecatapi.com/api/images/get?format=src&type=gif)',
          'background-size': 'cover',
          'border-radius': '50%',
          'border': '2px solid',
          'border-color': '#000000'
        }
      });

      var satellite = new Sphere({
        radius: 70,
        mass: mass,
        position: new Vec3(x, y, 0),
        restitution: restitution,
        friction: friction
      });

      // Attach the box to the anchor with a `Spring` force
      var spring = new Spring(null, satellite, {
        stiffness: stiffness,
        damping: damping,
        anchor: anchor
      });

      satellite.setVelocity(0.1, 0.1, 0);
      this.simulation.add(satellite, spring);
      this.items.push([satellite, position]);
      this.collision.addTarget(satellite);
    }

    setTimeout(function() {
      // Boilerplate
      FamousEngine.init();
    }, 500);
    // App Code
    var demo = new Demo();
  }


});


if( $('body').hasClass('list-collections') ){
    console.log('instagram should be loaded');
    //Instagram
    var url = "https://api.instagram.com/v1/tags/trysupply/media/recent?access_token=1831335509.afab6a6.47e74584eafb44a087e18d2809c5f6c5&count=20&callback=";

    $.ajax({
		type: "GET",
		dataType: "jsonp",
		url: url
		}).done(function( data ) {
            console.log(data);
            loadInstagram(data);
        });
}

function loadInstagram(instData){

    var FamousEngine = famous.core.FamousEngine;

    var Camera = famous.components.Camera;


    var DOMElement = famous.domRenderables.DOMElement;
    var Gravity3D = famous.physics.Gravity3D;
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
    console.log(famous)
    var anchor = new Vec3(window.innerWidth / 2,window.innerHeight / 2, 0);

    //Create Walls
    var rightWall = new Wall({ direction: Wall.LEFT }).setPosition(window.innerWidth - 10, 0, 0);
    var leftWall = new Wall({ direction: Wall.RIGHT }).setPosition(10, 0, 0);
    var topWall = new Wall({ direction: Wall.DOWN }).setPosition(0, 10, 0);
    var bottomWall = new Wall({ direction: Wall.UP }).setPosition(0, window.innerHeight - 10, 0);
    var walls = [topWall, rightWall, bottomWall, leftWall];

    var centerPoint;

    function Demo () {
      this.scene = FamousEngine.createScene('#socialInteractive');
      // this.collision = new collision.({broadphase: 'BruteForce'});
      var broadPhase = new physics.Collision.BruteForceAABB([rightWall, leftWall, topWall, bottomWall]);
      this.collision = new collision([topWall],{'broadPhase':broadPhase});

      this.simulation = new PhysicsEngine();
      this.simulation.setOrigin(0.5,0.5);
      this.simulation.addConstraint(this.collision);
      this.items = [];
      this.walls = [];

      //Create Items
      for (var i = 0; i < 6; i++) {
        var node = this.scene.addChild();
        node.setMountPoint(0.5,0.5);
        var size = new Size(node).setMode(1, 1);
        var position = new Position(node);
        if (i === 0) {
          createLogo.call(this, node, size, position);

        }
        if (i !== 0 && i != 5 ) {
          node.id = i;
          createSatellites.call(this, node, size, position);
        }
        if (i === 5) {
            node.id = i;
          createAlternateShape.call(this, node, size, position);

        }
      }

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
        // this.collision.resolve(time, 360)

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
        if(this.items.length > 0) {
          for(var i = 0; i < this.items.length; i++) {
              if(!this.items[i][1]._node.moving){
                  var itemPosition = this.simulation.getTransform(this.items[i][0]).position;
                  this.items[i][1].set(itemPosition[0], itemPosition[1], 0);
              }


          }
        }

        FamousEngine.requestUpdateOnNextTick(this);
      };

       FamousEngine.requestUpdateOnNextTick(this);
    }

    function createTopBottomWalls(node, wall) {
      var wallPos = wall.getPosition();
      node.setSizeMode('absolute', 'absolute', 'absolute').setAbsoluteSize(window.innerWidth, 10, 0);
      var wallDOMElement = new DOMElement(node, {
        tagName: 'div'
    }).setProperty('background-color', 'transparent');
    }
    function createSideWalls(node, wall) {
      var wallPos = wall.getPosition();
      node.setSizeMode('absolute', 'absolute', 'absolute').setAbsoluteSize(10, window.innerHeight, 0);
      var wallDOMElement = new DOMElement(node, {
        tagName: 'div'
    }).setProperty('background-color', 'transparent');
    }

    function createLogo(node, size, position) {
        node.moving = false;
      size.setAbsolute(200, 200);
      var mp = new MountPoint(node).set(0.5, 0.5);
      var el = new DOMElement(node, {
        content: 'Be Social.<br/> Or not.</br> We are sometimes.',
        properties: {
          'border': '2px solid black',
          'border-radius': '100px'
        },
        classes: ['social-title']
      });
      centerPoint = new Sphere({
        radius: 100,
        mass: 100000,
        restrictions: ['xy'],
        position: new Vec3(window.innerWidth / 2, window.innerHeight / 2, 0)
      });

      var spring = new Spring(null, centerPoint, {
          stiffness: 95,
          period: 0.6,
          dampingRatio: 1.0,
          anchor: new Vec3(window.innerWidth / 2, window.innerHeight / 2, 0)
      });

      centerPoint.setVelocity(0,0,0);
      this.simulation.add(centerPoint, spring);
      this.items.push([centerPoint, position]);
      this.collision.addTarget(centerPoint);
    }

    function createAlternateShape(node, size, position) {
        node.moving = false;
      size.setAbsolute(100, 100);
      var el = new DOMElement(node, {
        properties: {
            'background-image': 'url(' + instData.data[node.id - 1].images.standard_resolution.url + ')',
            'background-size': 'cover',
        }
      });

      var box = new physics.Box({
        size: [101,101,101],
        mass: 10,
        position: new Vec3(100, 100, 0)
      });

        // Attach the box to the anchor with a `Spring` force
        var spring = new Spring(null, box, {
            period: 1.5,
            dampingRatio: 0.8,
            anchor: new Vec3(window.innerWidth / 2, window.innerHeight / 2, 0)
        });

      box.setVelocity(0.1,0.1,0);
      this.simulation.add(box, spring);
      this.items.push([box, position]);
      this.collision.addTarget(box);
      var nodeGesture = new gestures(node);
      nodeGesture.on('drag', function(e,p){
        if(e.status == "move"){
            node.moving = true;
            var currentPos = node.getPosition()
            var newPosX = currentPos[0] + e.centerDelta.x
            var newPosY = currentPos[1] + e.centerDelta.y
            box.setPosition(newPosX,newPosY)
            node.setPosition(newPosX,newPosY)
        }

        if(e.status == "end"){
            node.moving = false;
        }
      });
    }

    function createSatellites(node, size, position, i) {
        node.moving = false;
      var rand = Math.round(Math.random() * 100 + 100);
      rand = 100;
      size.setAbsolute(rand, rand);
      var radius = rand;
      var x = Math.floor(Math.random() * radius * 2) - radius;
      var y = (Math.round(Math.random()) * 2 - 1) * Math.sqrt(radius * radius - x * x);
      var color = 'rgb(' + Math.abs(x) + ',' + Math.abs(Math.round(y)) + ',' + (255 - node.id) + ')';
      console.log(instData.data[node.id - 1].images.standard_resolution.url)
      var el = new DOMElement(node, {
        properties: {
          'background-image': 'url(' + instData.data[node.id].images.standard_resolution.url + ')',
          'background-size': 'cover',
          'border-radius': '50%',
        }
      });

      var satellite = new Sphere({
        radius: rand / 2,
        mass: 100,
        position: new Vec3(x + window.innerWidth / 2, y + window.innerHeight / 2, 0),
        restitution: 0,
        friction: 0.8
      });

        // Attach the box to the anchor with a `Spring` force
        var spring = new Spring(null, satellite, {
            stiffness: 50,
            period: 1.5,
            dampingRatio: 0.8,
            anchor: anchor
        });

      //console.log(color);
      // satellite.setVelocity(-y / Math.PI, -x / Math.PI / 2, y / 2);
      satellite.setVelocity(0.1,0.1,0);
      // this.gravity.add(satellite);
      this.simulation.add(satellite, spring);
      this.items.push([satellite, position]);
      this.collision.addTarget(satellite);
      //Drag
      var nodeGesture = new gestures(node);
      nodeGesture.on('drag', function(e,p){
        if(e.status == "move"){
            node.moving = true;
            var currentPos = node.getPosition()
            var newPosX = currentPos[0] + e.centerDelta.x
            var newPosY = currentPos[1] + e.centerDelta.y
            satellite.setPosition(newPosX,newPosY)
            node.setPosition(newPosX,newPosY)
        }

        if(e.status == "end"){
            node.moving = false;
        }
      });
      //event
      node.addComponent({
        onReceive:function(event, payload){
                if(event==='click'){
                    // el.setContent('I\'ve been clicked')
                }
            }
        });
    }

    setTimeout(function () {
        // Boilerplate
        FamousEngine.init();
    }, 500);


    // App Code
    var demo = new Demo();
}

$(document).ready(function() {
  if ($('body').hasClass('product')) {

    //Initalise select box
    var selectCallback = function(variant, selector) {
      if (variant) {
        if (variant.available) {
          // Selected a valid variant that is available.
          $('#add').removeClass('disabled').removeAttr('disabled').val('Add to Cart').fadeTo(200, 1);
        } else {
          // Variant is sold out.
          $('#add').val('Sold Out').addClass('disabled').attr('disabled', 'disabled').fadeTo(200, 0.5);
        }
        // Whether the variant is in stock or not, we can update the price and compare at price.
        if (variant.compare_at_price > variant.price) {
          $('.price-text').html('<span class="product-price on-sale">' + Shopify.formatMoney(variant.price, "") + '</span>' + '&nbsp;<s class="product-compare-price">' + Shopify.formatMoney(variant.compare_at_price, "") + '</s>');
        } else {
          $('.price-text').html('<span class="product-price">' + Shopify.formatMoney(variant.price, "") + '</span>');
        }
      } else {
        // variant doesn't exist.
        $('#add').val('Unavailable').addClass('disabled').attr('disabled', 'disabled').fadeTo(200, 0.5);
      }
    }
    // initialize multi selector for product
    new Shopify.OptionSelectors('product-select', {
      product: json_product,
      onVariantSelected: selectCallback,
      enableHistoryState: true
    });
    //Add bootstrap class to selects
    $('.single-option-selector').addClass('form-control');
    //Move selects into modals
    for (var i = 0; i < json_product.options.length; i++) {
      if (json_product.options[i] == "Size" || json_product.options[i] == "size") {
        $('#product-select-option-' + i).appendTo('#sizeModal .modal-body #select');
      }
      if (json_product.options[i] == "Color" || json_product.options[i] == "color") {
        $('#product-select-option-' + i).appendTo('#colorModal .modal-body #select');
      }

    }

    //Setup background
    $('aside').backstretch(json_product.images[0]);


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
    var screenW = $('#product').width();
    var screenH = $('#product').height();
    var anchor = new Vec3(screenW / 2, screenH / 2, 0);
    var centerPoint = new Vec3(screenW / 2, screenH / 2, 0);
    var productScene;
    console.log('width', screenW)
    console.log('height', screenH)

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

    //Same friction
    var mass = 10,
      restitution = 0, // if the body rests
      friction = 0.3,
      stiffness = 30, // how fast it attracts to the center
      damping = -1;


    function Demo() {
      this.scene = FamousEngine.createScene('#product');
      productScene = this.scene;
      console.log('scene', this.scene);
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

      //Testing user iteraction
      //   var parent = this.scene.addChild()
      //   parent.setAlign(0.5, 0.5)
      //     .setMountPoint(0.5, 0.5)
      //     .setSizeMode('absolute', 'absolute', 'absolute')
      //     .setAbsoluteSize(screenW, screenH)
      //
      //   parent.el = new DOMElement(parent, {
      //     tagName: 'div',
      //     properties: {
      //       'background': 'transparent'
      //     }
      //   })
      //
      //   parent.addUIEvent('mousemove');
      //   parent.addUIEvent('mouseout');
      //
      //   this.scene.addComponent({
      //     onReceive: function(e, payload) {
      //       console.log(e, payload)
      //       if (e == "mousemove") {
      //         var pos = payload.node.getPosition()
      //         anchor.x = payload.offsetX;
      //         anchor.y = payload.offsetY;
      //       }
      //       if (e == "mouseout") {
      //         var pos = payload.node.getPosition()
      //       }
      //     }
      //   });

      // var horizontalRule = this.scene.addChild()
      //   .setSizeMode(0, 1, 1)
      //   .setAbsoluteSize(null, 1, 10)
      //   .setAlign(0, 0.5);
      // var verticalRule = this.scene.addChild()
      //   .setSizeMode(1, 0, 1)
      //   .setAbsoluteSize(1, null, 10)
      //   .setAlign(0.5, 0);
      //
      // new DOMElement(horizontalRule, {
      //   properties: {
      //     'background-color': 'grey'
      //   }
      // });
      // new DOMElement(verticalRule, {
      //   properties: {
      //     'background-color': 'grey'
      //   }
      // });

      //Create product name
      createProductName.call(this);
      //Create price
      createPrice.call(this, Shopify.formatMoney(json_product.price));
      //Create buy
      createBuy.call(this);
      //Create info
      createInfo.call(this);
      //Create Size
      for (var i = 0; i < json_product.options.length; i++) {
        createVariants.call(this, json_product.options[i]);
      }
      //Create Images
      for (var i = 0; i < json_product.images.length; i++) {
        createImages.call(this, i);
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
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(125, 125)
      var position = new Position(node);
      var el = new DOMElement(node, {
        content: json_product.title,
        properties: {
          'background-color': '#000000',
          'color': '#ffffff',
          'border-radius': '100px'
        },
        classes: ['product-title']
      });

      var sphere = new Sphere({
        radius: 62.5,
        mass: 100000,
        restrictions: ['xy'],
        position: centerPoint
      });

      var spring = new Spring(null, sphere, {
        stiffness: 95,
        period: 0.6,
        dampingRatio: 1.0,
        anchor: new Vec3(screenW / 2, screenH / 2, 0)
      });
      sphere.setVelocity(0, 0, 0);
      this.simulation.add(sphere, spring);
      this.items.push([sphere, position]);
      this.collision.addTarget(sphere); console.log(this.simulation);
      node.addUIEvent('mousemove');
    }

    function createPrice(price) {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(125, 125);
      var position = new Position(node);
      var radius = 62.5;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        content: '<span class="price-text">' + price + '</span>',
        properties: {
          'border-radius': '100px',
          'background-image': 'url(http://www.cliparthut.com/clip-arts/250/award-seal-clip-art-250445.png)',
          'background-size': 'cover',
        },
        classes: ['vAlign']
      });

      var satellite = new Sphere({
        radius: 62.5,
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
      node.addUIEvent('mousemove');
    }

    function createBuy() {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(75, 75);
      var position = new Position(node);
      var radius = 37.5;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        content: '<i class="fa fa-shopping-cart"></i>',
        classes: ['vAlign', 'pointer', 'buy-button']
      });

      var satellite = new Sphere({
        radius: 37.5,
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
      node.addUIEvent('mousemove');
      //Add to cart-button
      var nodeGesture = new gestures(node);
      node.addComponent({
        onReceive: function(e, payload) {
          if (e === 'mouseup') {
            var variantId = getParameterByName('variant');
            CartJS.addItem(variantId);
          }
        }
      });

    }

    function createInfo() {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(75, 75);
      var position = new Position(node);
      var radius = 37.5;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        content: 'info',
        classes: ['vAlign', 'pointer', 'modal-info']
      });

      var satellite = new Sphere({
        radius: 37.5,
        mass: mass,
        position: new Vec3(x, y, 0),
        restitution: restitution,
        damping: damping,
        friction: friction
      });

      // Attach the box to the anchor with a `Spring` force
      var spring = new Spring(null, satellite, {
        stiffness: stiffness,
        anchor: anchor
      });

      satellite.setVelocity(0.1, 0.1, 0);
      this.simulation.add(satellite, spring);
      this.items.push([satellite, position]);
      this.collision.addTarget(satellite);
      node.addUIEvent('mousemove');
      //Geature Events
      var nodeGesture = new gestures(node);
      node.addComponent({
        onReceive: function(e, payload) {
          if (e === 'mouseup') {
            var attributes = el.getValue('attributes');
            if (attributes.content == 'info') {
              $('#infoModal').modal();
            }
          }
        }
      });
    }

    function createVariants(variant) {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(75, 75);
      var position = new Position(node);
      var radius = 37.5;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        content: variant.toLowerCase(),
        classes: ['vAlign', 'pointer', 'modal-info']
      });

      var satellite = new Sphere({
        radius: 37.5,
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
      node.addUIEvent('mousemove');
      //Geature Events
      var nodeGesture = new gestures(node);
      node.addComponent({
        onReceive: function(e, payload) {
          if (e === 'mouseup') {
            var attributes = el.getValue('attributes');
            if (attributes.content == 'size') {
              $('#sizeModal').modal();
            } else if (attributes.content == 'color') {
              $('#colorModal').modal()
            }
          }
        }
      });
    }

    function createImages(imageNo) {
      var node = this.scene.addChild();
      var mp = new MountPoint(node).set(0.5, 0.5);
      node.setSizeMode('absolute', 'absolute')
        .setAbsoluteSize(50, 50);
      var position = new Position(node);
      var radius = 25;
      var x = Math.round(Math.random() * screenW) - radius;
      var y = Math.round(Math.random() * screenH) - radius;
      var el = new DOMElement(node, {
        properties: {
          'background-image': 'url(' + json_product.images[imageNo] + ')',
          'background-size': 'cover',
          'border-radius': '50%',
          'border': '2px solid',
          'border-color': '#000000'
        },
        attributes: {
          'data-img': json_product.images[imageNo]
        },
        classes: ['pointer', 'product-image-buttons']
      });

      var satellite = new Sphere({
        radius: 25,
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
      node.addUIEvent('mousemove');

      //Geature Events
      var nodeGesture = new gestures(node);
      node.addComponent({
        onReceive: function(e, payload) {
          if (e === 'mouseup') {
            var attributes = el.getValue('attributes');
            $('aside').backstretch(attributes.attributes['data-img'], {
              fade: 4000
            });
          }
        }
      });

    }

    setTimeout(function() {
      // Boilerplate
      FamousEngine.init();
    }, 500);
    // App Code
    var demo = new Demo();

    //mobile
    $(window).resize(function() {
      //   resize();
    });

    // function resize() {
    //   if ($(this).width() <= 480) {
    //     //mobile
    //     productScene.setScale(0.7, 0.7);
    //   } else if ($(this).width() > 480) {
    //     productScene.setScale(0.7, 0.7);
    //   }
    // }

    createSlider();
    movePricingBadges()
  // resize()s
  }


});

function movePricingBadges() {
  console.log('move');
  $('.product-badge').each(function(index, value) {
    var min = 40;
    var max = 70;
    var randX = Math.floor(Math.random() * (max - min + 1)) + min;
    var randY = Math.floor(Math.random() * (max - min + 1)) + min;
    $(this).css('top', randX + '%').css('right', randY + '%');
  });
}

function createSlider() {
  $('.slickFullHeight').slick({
    nextArrow: '<button type="button" class="slick-next btn btn-default btn-large grey "><i class="fa fa-2x fa-angle-right"></i></button>',
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    touchThreshold: 7,
    arrows: true,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  });
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

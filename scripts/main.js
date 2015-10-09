
$(document).ready(function() {

  //Rivets
  rivets.formatters['!='] = function(value, arg) {
    return value != arg;
  }

  rivets.formatters.console = function(value, arg) {
    console.log(value);
    return value;
  }

  rivets.formatters.truncate = function(value, arg) {
    return value.split(" ").splice(0, arg).join(" ");
  }

  rivets.binders['style-*'] = function(el, value) {
    el.style.setProperty(this.args[0], value);
  };

  rivets.binders.bg = function(el, value) {
    $(el).css('background-image', 'url(' + value + ')');
  };

  //Closure for Supply Logo
  var resizeTimeout;
  $(window).resize(function() {
    if (!!resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(function() {
      d3.select("svg").remove();
      buildLogo()
    }, 200);
  });

  function buildLogo() {

    var $container = $('.logo');
    var width = $container.width(),
      height = $container.height(),
      padding = 0, // separation between nodes
      maxRadius = 12;

    var color = "#000000";

    var letters = [4, 5, 9, 10];

    var n = 16, // total number of nodes
      m = 15; // number of distinct clusters

    var center = width / 2;
    var dist = 20;

    var supplyPos = [
      {
        outline: false,
        x: center - dist,
        y: 20
      }, {
        outline: false,
        x: center,
        y: 20
      }, {
        outline: false,
        x: center + dist,
        y: 20
      },
      {
        outline: false,
        x: center - dist,
        y: 40
      }, {
        outline: true,
        x: center,
        y: 40
      }, {
        outline: true,
        x: center + dist,
        y: 40
      },
      {
        outline: false,
        x: center - dist,
        y: 60
      }, {
        outline: false,
        x: center,
        y: 60
      }, {
        outline: false,
        x: center + dist,
        y: 60
      },
      {
        outline: true,
        x: center - dist,
        y: 80
      }, {
        outline: true,
        x: center,
        y: 80
      }, {
        outline: false,
        x: center + dist,
        y: 80
      },
      {
        outline: false,
        x: center - dist,
        y: 100
      }, {
        outline: false,
        x: center,
        y: 100
      }, {
        outline: false,
        x: center + dist,
        y: 100
      },
      {
        outline: false,
        x: 1000,
        y: 1000
      },
    ]

    var x = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangePoints([0, width], 1);

    var nodes = d3.range(n).map(function(index) {
      var radius = 7;
      if (supplyPos[index].outline) {
        radius = 6;
      }
      return {
        outline: supplyPos[index].outline,
        radius: radius,
        color: color,
        cx: supplyPos[index].x,
        cy: supplyPos[index].y,
        x: supplyPos[index].x,
        y: supplyPos[index].y,
      };
    });

    var root = nodes[15];
    root.radius = 20;
    root.fixed = true;
    root.color = "none";


    var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(0)
      .charge(0)
      .on("tick", tick)
      .start();

    var svg = d3.select('.logo').append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      // .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
      // .attr('preserveAspectRatio','xMinYMin')

    var circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", function(d) {
        return d.radius;
      })
      .style("fill", function(d) {
        if (!d.outline) {
          return d.color;
        } else {
          return "transparent"
        }
      })
      .style("stroke", function(d) {
        if (d.outline) {
          return d.color;
        }
      })
      .style("stroke-width", function(d) {
        if (d.outline) {
          return "2px";
        }
      })
      .call(force.drag);

    function tick(e) {
      circle
        .each(gravity(.2 * e.alpha))
        .each(collide(.5))
        .attr("cx", function(d) {
          return Math.max(d.radius, Math.min(width - d.radius, d.x))
        })
        .attr("cy", function(d) {
          return Math.max(d.radius, Math.min(height - d.radius, d.y))
        });
    }

    svg.on("mousemove", function() {
      var p1 = d3.mouse(this);
      root.px = p1[0];
      root.py = p1[1];
      force.resume();
    });

    // d3.select("body")
    //     .on("mousedown", mousedown)
    //     .on("touchstart", mousedown);

    function mousedown() {
      nodes.forEach(function(o, i) {
        o.x += (Math.random() - .5) * 40;
        o.y += (Math.random() - .5) * 40;
      });
      force.resume();
    }

    // Move nodes toward cluster focus.
    function gravity(alpha) {
      return function(d) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
      };
    }

    // Resolve collisions between nodes.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + maxRadius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
  }
  ;
  buildLogo();

  // Fullpage.js
  if ($('#fullpage').length >= 1) {
    var fit = false; //Used to stop auto scroll
    if ($('body').hasClass('collection')) {
      fit = false;
    }
    $('#fullpage').fullpage({
      menu: '#menu',
      css3: true,
      scrollingSpeed: 1000,
      autoScrolling: false,
      fitToSection: fit,
      afterRender: function() {
        // $('video').get(0).play();

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

      },
      onLeave: function(index, nextIndex, direction) {
        // $('video').get(0).pause();
      },
    });
  }


  //Product
  if ($('body').hasClass('product')) {
    var image = $('.product-gif').data('src');
    $('#productHeader').css("min-height", window.innerHeight + "px")
  // $('#productHeader').backstretch(image);
  // var sup2 = new RubbableGif({
  //     gif: document.getElementById('example2'),
  //     show_progress_bar: false,
  //     draw_while_loading: false
  // });
  // sup2.load();
  }

  //404
  if ($('body').hasClass('404')) {
    $(document).ready(function() {
      $.backstretch("http://beautifuldecay.com/wp-content/uploads/2013/09/domonkosgif23.gif");
      $('footer').hide();
    })
  }
  ;

  // Video
  $(document).on("mouseenter", '.slick-slide', function() {
    if ($(this).find('video').length >= 1) {
      $(this).find('video').get(0).play();
    }
  })
  $(document).on('mouseleave', '.slick-slide', function() {
    if ($(this).find('video').length >= 1) {
      $(this).find('video').get(0).pause();
    }
  })

  //Side nav
  var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70,
    'side': 'right',
    'touch': false
  });

  // Toggle button
  document.querySelector('.toggle-button').addEventListener('click', function() {
    slideout.toggle();
  });

});

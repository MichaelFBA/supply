$(document).ready(function() {
    //Start Footer Interactive

    function footer() {

        var width = $('#fInteractive').width(),
            height = $('#fInteractive').height(),
            padding = 0, // separation between nodes
            maxRadius = 25;

        var middle = width / 2;
        var center = [width/2, height/2];

        var color1 = "#000000";

        var footerData = [
            {size: "8px",r: 25, name: 'TERMS', url: "terms", tx: 3, font: "Source Sans Pro"},
            {size: "8px",r: 25, name: 'CARE' , url: "care", tx: 3, font: "Source Sans Pro"},
            {size: "8px",r: 25, name: 'CONTACT' , url: "contact", tx: 3, font: "Source Sans Pro"},
            {size: "8px",r: 25, name: 'PRIVACY' , url: "privacy", tx: 3, font: "Source Sans Pro"},
            {size: "8px",r: 25, name: 'SIZING' , url: "sizing", tx: 3, font: "Source Sans Pro"},
            {size: "15px",r: 15, name: '\uf09a' , url: 'https://www.facebook.com/trysupply', tx: 6, font: "FontAwesome"},
            {size: "15px",r: 15, name: '\uf16d' , url: 'https://instagram.com/trysupply/', tx: 6, font: "FontAwesome"},
            {size: "15px",r: 15, name: '\uf231' , url: 'https://www.pinterest.com/trysupply/', tx: 6, font: "FontAwesome"},
            {size: "15px",r: 15, name: '\uf099' , url: 'https://twitter.com/TrySuppy', tx: 6, font: "FontAwesome"},
            ]

        var n = footerData.length, // total number of nodes
            m = 1; // number of distinct clusters

        var color = d3.scale.category10()
            .domain(d3.range(m));

        var x = d3.scale.ordinal()
            .domain(d3.range(m))
            .rangePoints([0, width], 1);

        var nodes = d3.range(n).map(function(index) {
            return {
                radius: 25,
                color: color1,
                cx: center[0],
                cy: center[1],
                footer: footerData[index]
            };
        });

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(0)
            .on("tick", tick)
            .start();

        var svg = d3.select("#fInteractive").append("svg")
            .attr("width", width)
            .attr("height", height);

        var elemEnter = svg.selectAll("g")
            .data(nodes)
            .enter().append("g")
            .attr("transform", function(d){return "translate("+center[0]+",80)"})
            .on('click', function(d, i) {
                window.location.href = d.footer.url;
            })
            .call(force.drag);

        var circle = elemEnter
            .append("circle")
            .attr("r", function(d) {
                return d.footer.r;
            })
            .style("fill", function(d) {
                return "transparent";
            })
            .style("stroke", function(d) {
                return d.color;
            })
            .style("stroke-width","2px")

        var text = elemEnter
            .append("text")
            .text( function (d) { return d.footer.name; })
            .attr("transform", function(d){return "translate(0,"+ d.footer.tx +")"})
            .attr("font-family", function (d) { return d.footer.font; })
            .attr("font-size", function (d) { return d.footer.size; })
            .attr("fill", "black")
            .attr("text-anchor","middle")


        function tick(e) {

            elemEnter
                .attr("transform", function(d) {
                    return "translate("+ Math.max(d.footer.r, Math.min(width - d.footer.r, d.x)) +","+ Math.max(d.footer.r, Math.min(height - d.footer.r, d.y)) +" )";
                })
                .each(gravity(.2 * e.alpha))
                .each(collide(.5))
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

                var r = d.footer.r + maxRadius + d.footer.r,
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.footer.r + quad.point.footer.r + (d.color !== quad.point.color) * d.footer.r;
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

    function footerMatter(){
        var width = $('#fInteractive').width(),
            height = $('#fInteractive').height();

        var pages = [
            {r: 40, name: 'TERMS', url: "terms", svg:'https://cdn.shopify.com/s/files/1/0792/8597/files/footer-terms.svg?6260614960223666133'},
            {r: 40, name: 'CARE' , url: "care", svg:'https://cdn.shopify.com/s/files/1/0792/8597/files/footer-care.svg?6260614960223666133'},
            {r: 40, name: 'CONTACT' , url: "contact", svg:'https://cdn.shopify.com/s/files/1/0792/8597/files/footer-contact.svg?6260614960223666133'},
            {r: 40, name: 'PRIVACY' , url: "privacy", svg:'https://cdn.shopify.com/s/files/1/0792/8597/files/footer-privacy.svg?6260614960223666133'},
            {r: 40, name: 'SIZING' , url: "sizing", svg:'https://cdn.shopify.com/s/files/1/0792/8597/files/footer-sizing.svg?6260614960223666133'}
        ]
        var social = [
            {r: 50, name: '\uf09a' , url: 'https://www.facebook.com/trysupply', svg: 'https://cdn.shopify.com/s/files/1/0792/8597/files/social-facebook.svg?12695765623459550425'},
            {r: 50, name: '\uf16d' , url: 'https://instagram.com/trysupply/', svg: 'https://cdn.shopify.com/s/files/1/0792/8597/files/social-instagram.svg?12695765623459550425'},
            {r: 50, name: '\uf231' , url: 'https://www.pinterest.com/trysupply/', svg: 'https://cdn.shopify.com/s/files/1/0792/8597/files/social-pinterest.svg?12695765623459550425'},
            {r: 50, name: '\uf099' , url: 'https://twitter.com/TrySuppy', svg: 'https://cdn.shopify.com/s/files/1/0792/8597/files/social-twitter.svg?12695765623459550425'},
        ]

        // Matter module aliases
        var Engine = Matter.Engine,
            World = Matter.World,
            Body = Matter.Body,
            Bodies = Matter.Bodies,
            Constraint = Matter.Constraint,
            Composites = Matter.Composites,
            Events = Matter.Events,
            MouseConstraint = Matter.MouseConstraint;

        // create a Matter.js engine
        var engine = Engine.create({
            render: {
                element: document.getElementById('fInteractive'),
                // controller: Matter.RenderPixi,
                options: {
                    pixelRatio: 'auto',
                    wireframes: false,
                    background: 'transparent',
                    width: width,
                    height: height
                }
            }
        });

        // add a mouse controlled constraint
        var mouseConstraint = MouseConstraint.create(engine, {
                              constraint: {
                                render: {
                                  visible: false
                                }
                              }
                            });
        World.add(engine.world, mouseConstraint);
        console.log(engine)

        engine.world.gravity.x = width / 2;
        engine.world.gravity.y = height / 2;
        engine.world.gravity.isPoint = true;
        engine.enableSleeping = true;

        // Wall Settings
        var offset = 10,
            wallOptions = {
                isStatic: true,
                render: {
                    visible: false
                }
            };

        // add some invisible some walls to the world
        World.add(engine.world, [
            Bodies.rectangle(width / 2, 0 , width, offset, wallOptions), // Top
            Bodies.rectangle(width / 2, height , width, offset, wallOptions), //Bottom
            Bodies.rectangle(0, height /2 , offset, height, wallOptions), //Left
            Bodies.rectangle(width, height /2 , offset, height, wallOptions), //Left
        ]);

        //Diamond Settings
        var diamondOptions = {
                isStatic: true,
                render: {
                    sprite:{
                        texture: ''
                    },
                    visible: true,
                    fillStyle: 'transparent',
                    strokeStyle: '#000000',
                    lineWidth: 3,

                }
            };



        var diamond = Bodies.polygon(width / 2, height / 2 ,4, 50, diamondOptions);
        Body.rotate ( diamond, 0.8 );


        var circleOptions = {
                isStatic: true,
                render: {
                    sprite:{
                        texture: 'https://cdn.shopify.com/s/files/1/0792/8597/files/footer-important.svg?11590300766221973337'
                    },
                    visible: true
                }
            };
        var circlePiece = Bodies.circle(width / 2, height / 2 ,45, circleOptions);

        //Add small diamonds
        var footerBodies = [];

        function createFooter(data){
            for (var i = 0; i < data.length; i++) {
                var diamond = Bodies.rectangle(width * Math.random(), height * Math.random() , data[i].r, data[i].r, {
                    inertia: 'Infinity',
                    density: 0.0005,
                    // frictionAir: 0.06,
                    restitution: 0.8,
                    // friction: 0.01,
                    render: {
                            sprite: {
                                texture: data[i].svg
                            }
                        }
                });

                Body.rotate ( diamond, 0.8 );
                footerBodies.push(diamond);

                Events.on ( diamond,'mouseup', function(event){
                    console.log(event);
                })

            };
        }

        createFooter(pages)
        createFooter(social)
        footerBodies.push(circlePiece);

        // create a stack of textured boxes and beach balls
        var stack = Composites.stack(2, 2, 2, 2, 0, 0, function(x, y, column, row) {

            // randomly create a box or beachball at this position in the stack
            if (Math.random() > 0.35) {
                return Bodies.rectangle(x, y, 50, 50, {
                    render: {
                        fillStyle: 'transparent',
                        strokeStyle: '#000000',
                        lineWidth: 3,

                        sprite: {
                            texture: 'https://cdn.shopify.com/s/files/1/0792/8597/files/sizing.svg?13374040375445798518'
                        }
                    }
                });
            } else {
                return Bodies.circle(x, y, 30, {
                    density: 0.0005,
                    frictionAir: 0.06,
                    restitution: 0.3,
                    friction: 0.01,
                    render: {
                         fillStyle: 'transparent',
                         strokeStyle: '#000000',
                         lineWidth: 3
                    }
                });
            }
        });

        // add the stack to the world
        World.add(engine.world, footerBodies);

        // run the engine
        Engine.run(engine);


    }

    var resizeTimeout;
    $(window).resize(function() {
        if (!!resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
            d3.select("svg").remove();
            // footer()
        }, 200);
    });
    // footerMatter()
    // footer();
    

})

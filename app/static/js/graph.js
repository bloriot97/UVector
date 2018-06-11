// Button variables

var network;

var TCBtn = true;
var CSBtn = true;
var TMBtn = true;
var GIBtn = true;
var GUBtn = true;
var IMBtn = true;
var GPBtn = true;
var GBBtn = true;
var NoBranches = false;
var NoTypes = false;

function reverse(GI, GU, GB, GP, IM, TC, TM, CS, NB, NT) {
  if (NB && !NoBranches) {
    GIBtn = false;
    GUBtn = false;
    GBBtn = false;
    GPBtn = false;
    IMBtn = false;
    TCBtn = false;
  }
  else if (NB && NoBranches) {
    GIBtn = true;
    GUBtn = true;
    GBBtn = true;
    GPBtn = true;
    IMBtn = true;
    TCBtn = true;
  }
  else if (NT && !NoTypes) {
    TMBtn = false;
    CSBtn = false;
  }
  else if (NT && NoTypes) {
    TMBtn = true;
    CSBtn = true;
  }
  else if (GI) {
    GIBtn = !GIBtn;
  }
  else if (GU) {
    GUBtn = !GUBtn;
  }
  else if (GB) {
    GBBtn = !GBBtn;
  }
  else if (GP) {
    GPBtn = !GPBtn;
  }
  else if (IM) {
    IMBtn = !IMBtn;
  }
  else if (TC) {
    TCBtn = !TCBtn;
  }
  else if (TM) {
    TMBtn = !TMBtn;
  }
  else if (CS) {
    CSBtn = !CSBtn;
  }
  if (!GIBtn && !GUBtn && !GBBtn && !GPBtn && !IMBtn && !TCBtn) {
    NoBranches = true;
  }
  else {
    NoBranches = false;
  }
  if (!TMBtn && !CSBtn) {
    NoTypes = true;
  }
  else {
    NoTypes = false;
  }
  //console.log("GI=", GIBtn, "GU=", GUBtn, "GB=", GBBtn, "GP=", GPBtn, "IM=", IMBtn, "TC=", TCBtn, "TM=", TMBtn, "CS=", CSBtn, "NB=", NoBranches, "NT=", NoTypes);
};

var nodes = []

var edges = []

 // update the network

function updateGraph() {
  var filterBranch = [];
  var filterType = [];
  if (TCBtn) {
    filterBranch.push("TC");
  }
  if (CSBtn) {
    filterType.push("CS");
  }
  if (TMBtn) {
    filterType.push("TM");
  }
  if (GIBtn) {
    filterBranch.push("GI");
  }
  if (GUBtn) {
    filterBranch.push("GU");
  }
  if (IMBtn) {
    filterBranch.push("IM");
  }
  if (GPBtn) {
    filterBranch.push("GP");
  }
  if (GBBtn) {
    filterBranch.push("GB");
  }
  var JSONadress;
  if (filterType && filterBranch) {
    JSONadress = "/api/v1/graphs/branches/?branches="+filterBranch+"&types="+filterType;
  }
  else if (filterType) {
    JSONadress = "/api/v1/graphs/branches/?types="+filterType;
  }
  else if (filterBranch) {
    JSONadress = "/api/v1/graphs/branches/?branches="+filterBranch;
  }
  else {
    JSONadress = "/api/v1/graphs/branches";
  }
  //JSONadress = "/api/v1/graphs/branches/?types=TSH"
  $.getJSON( JSONadress, function( data ) {
    var container = document.getElementById('vis-network');
    console.log(data.groupes)
    var options = {
        layout: {
            improvedLayout: false,
        },
        nodes: {
            shape: 'dot',
            size: 25
        },
        edges: {
          smooth: {type: 'continuous'},
          selectionWidth: function (width) {return width*2;}
        },
        groups: data.groupes,
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -100,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 150,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 5}
        },
        interaction: {
        hideEdgesOnDrag: true,
        // tooltipDelay: 200,
        // dragNodes: false,// do not allow dragging nodes
        // zoomView: true, // do not allow zooming
        // dragView: true  // do not allow dragging
      }
    };
    var dataNodes = {
      "nodes": data['nodes'], "edges": data['edges']
    };
    network = new vis.Network(container, dataNodes, options);
    network.on( 'click', function(properties) {
        var ids = properties.nodes;
        var clickedNodes = data['nodes'][ids[0]];
        console.log('clicked nodes:', clickedNodes);
    });

    // Autocomplete
    $('#node-to-search').on('keyup', function(){
        console.log('input')
        const search = data['nodes'].filter(node => node.label.startsWith($('#node-to-search').val())).slice(0, 5);

        $('#dropdown').empty();

        if(search){
            for (var i = 0; i < search.length; i++) {
                name = '<span style="color: #9E9E9C;" class="truncate">' + search[i].label + '</span>';

                $('#dropdown').append('<li><a href="#"><span class="node">' + name + '</span></a></li>');
            }
        }
    });

    // On autocomplete element click
    $('#dropdown').on('click', 'li', function(e){
        network.selectNodes([data['nodes'].find(node => node.label == $(this).find('a span.node').text()).id])

        // network.zoomExtent();
        // var nodePosition= {x: network.nodes[data['nodes'].find(node => node.label == $(this).find('a span.node').text()).id].x, y: network.nodes[data['nodes'].find(node => node.label == $(this).find('a span.node').text()).id].y};

        // var canvasCenter = network.DOMtoCanvas({x:0.5 * network.frame.canvas.width,y:0.5 * network.frame.canvas.height});
        // var translation = network._getTranslation();
        // var requiredScale = 0.75;
        // var distanceFromCenter = {x:canvasCenter.x - nodePosition.x,
        //                             y:canvasCenter.y - nodePosition.y};

        // network._setScale(requiredScale);
        // network._setTranslation(translation.x + requiredScale * distanceFromCenter.x,translation.y + requiredScale * distanceFromCenter.y);
        // network.redraw();

        $('#node-to-search').val('')
        $('#dropdown').empty();
    });

    var dataBranches = data['genie'];
    network.moveNode(dataBranches['GI01'],200,200);
  });
  console.log("Types=",filterType,"Branches=",filterBranch);
};

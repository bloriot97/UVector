// Button variables

var network;

var nodes = []

var edges = []

 // update the network

function updateGraph() {
  var filterBranch = [];
  var filterType = [];
  if (!$("#node_branch_TC").hasClass("btn-flat")) {
    filterBranch.push("TC");
  }
  if (!$("#node_category_CS").hasClass("btn-flat")) {
    filterType.push("CS");
  }
  if (!$("#node_category_TM").hasClass("btn-flat")) {
    filterType.push("TM");
  }
  if (!$("#node_branch_GI").hasClass("btn-flat")) {
    filterBranch.push("GI");
  }
  if (!$("#node_branch_GU").hasClass("btn-flat")) {
    filterBranch.push("GU");
  }
  if (!$("#node_branch_IM").hasClass("btn-flat")) {
    filterBranch.push("IM");
  }
  if (!$("#node_branch_GP").hasClass("btn-flat")) {
    filterBranch.push("GP");
  }
  if (!$("#node_branch_GB").hasClass("btn-flat")) {
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
    var container = document.getElementById('mynetwork');
    //console.log(data.groupes)
    var options = {
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
        layout:{
          improvedLayout: false
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
    network.on("selectNode", function (params) {
      showUvCard(dataNodes.nodes[params.nodes[0]].label)
    });
    var dataBranches = data['genie'];
  });
  //console.log("Types=",filterType,"Branches=",filterBranch);
};

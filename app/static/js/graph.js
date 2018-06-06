// Button variables

var network;

var nodes = []

var edges = []

 // update the network

 var filterBranch = [];
 var filterType = [];
 let saison = [];

function updateGraph() {
  $("#graph-preloader").show();
  filterBranch = [];
  filterType = [];
  saison = [];
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

  if (!$("#saison_A").hasClass("btn-flat")) {
    saison.push("A");
  }
  if (!$("#saison_P").hasClass("btn-flat")) {
    saison.push("P");
  }

  var JSONadress = "/api/v1/graphs/branches/?branches="+filterBranch+"&types="+filterType+"&saison="+saison;
  console.log(JSONadress)
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
    $("#graph-preloader").fadeOut(100);
    network = new vis.Network(container, dataNodes, options);
    network.on("selectNode", function (params) {
      if (dataNodes.nodes[params.nodes[0]].shape == "box"){ // GX
        showGxCard(dataNodes.nodes[params.nodes[0]].label)
      } else { // UV
        showUvCard(dataNodes.nodes[params.nodes[0]].label)
      }

    });
    var dataBranches = data['genie'];
  });
  //console.log("Types=",filterType,"Branches=",filterBranch);
};

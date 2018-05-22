module.exports = {
  query: {
    limit: 10,
    max_limit: 50
  },
  neo4j: {
    user: "neo4j",
    password: "ic05",
    port: "7687"
  },
  branches: ["TC","GU","GI","IM","GB","GP", "GX"],
  branches_color: {
    TC: "#3498db",
    GU: "#e67e22",
    GI: "#1abc9c",
    IM: "#f1c40f",
    GB: "#9b59b6",
    GP: "#e74c3c",
    GX: "#888888"
  },
  types: ["CS", "TM", "TSH"]
};

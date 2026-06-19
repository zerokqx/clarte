module.exports = {
  petstore: {
    output: {
      mode: "tags-split",
      target: "src/api/generated.ts",
      schemas: "src/api/models",
      client: "react-query",
      mock: true,
    },
    input: {
      target: "http://localhost:5000/docs-json",
    },
  },
};

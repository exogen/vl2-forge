module.exports = {
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? "./docs" : undefined,
  basePath: "/vl2-forge",
  assetPrefix: "/vl2-forge/",
  trailingSlash: true,
};

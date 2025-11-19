import rybbitProxyHandler from "./proxy";

const widget = {
  api: "{url}/api/analytics/{endpoint}",
  proxyHandler: rybbitProxyHandler,

  mappings: {
    stats: {
      endpoint: "sites/{siteId}/overview",
    },
  },
};

export default widget;

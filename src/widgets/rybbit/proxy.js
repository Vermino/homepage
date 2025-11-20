import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import widgets from "widgets/widgets";

const proxyName = "rybbitProxyHandler";
const logger = createLogger(proxyName);

export default async function rybbitProxyHandler(req, res) {
  const { group, service, endpoint, index } = req.query;

  if (!group || !service) {
    logger.debug("Invalid request: missing group or service");
    return res.status(400).json({ error: "Invalid rybbit request" });
  }

  const widget = await getServiceWidget(group, service, index);

  if (!widget) {
    logger.debug("Invalid widget configuration");
    return res.status(400).json({ error: "Invalid widget configuration" });
  }

  if (!widgets?.[widget.type]?.api) {
    return res.status(403).json({ error: "Service does not support API calls" });
  }

  const { url, key, siteId } = widget;

  if (!url || !siteId) {
    logger.debug("Missing required rybbit configuration (url or siteId)");
    return res.status(400).json({ error: "Missing required rybbit configuration" });
  }

  logger.debug(`Rybbit configuration - URL: ${url}, siteId: ${siteId}`);

  // Build API URL using formatApiCall
  const apiUrl = formatApiCall(widgets[widget.type].api, { endpoint, ...widget });

  // Add optional time range parameters
  const params = new URLSearchParams();
  if (req.query.from) {
    params.append("from", req.query.from);
  }
  if (req.query.to) {
    params.append("to", req.query.to);
  }

  const apiEndpoint = params.toString() ? `${apiUrl}?${params.toString()}` : apiUrl;

  logger.debug(`Rybbit API endpoint: ${apiEndpoint}`);

  // Set authorization header if API key provided
  const headers = {
    "Content-Type": "application/json",
  };

  if (key) {
    headers.Authorization = `Bearer ${key}`;
  }

  try {
    const [status, , data] = await httpProxy(apiEndpoint, {
      method: "GET",
      headers,
    });

    if (status !== 200) {
      logger.error(`Rybbit API error: ${status} - ${data}`);
      return res.status(status).json({ error: data });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
    } catch (e) {
      logger.debug(`Failed to parse response as JSON: ${e.message}`);
      parsedData = data;
    }

    // Transform data to widget format
    const widgetData = {
      visitors: parsedData.visitors || 0,
      pageviews: parsedData.pageviews || 0,
      bounce_rate: parsedData.bounce_rate || 0,
      avg_session_duration: parsedData.avg_session_duration || 0,
    };

    return res.status(200).json(widgetData);
  } catch (error) {
    logger.error(`Rybbit proxy error: ${error.message}`);
    return res.status(500).json({ error: "Failed to fetch rybbit stats" });
  }
}

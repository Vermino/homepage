---
title: Rybbit
description: Rybbit Widget Configuration
---

Learn more about [Rybbit](https://rybbit.io).

Displays real-time analytics for websites monitored by your Rybbit instance.

You will need to obtain a Rybbit API key and the site ID for the website you want to monitor from your Rybbit dashboard.

Allowed fields: `["visitors", "pageviews", "bounce_rate", "avg_duration"]`.

## Important: Backend API URL

**IMPORTANT**: The `url` must point to your Rybbit **backend API** (default port 3001), not the client UI (port 3002).

### For Local Development
```yaml
widget:
  type: rybbit
  url: http://localhost:3001  # Backend API port
  siteId: 1
  key: rb_yourapikey  # Optional
```

### For Docker Environments
If Homepage is running in Docker and Rybbit is on your host machine:

```yaml
widget:
  type: rybbit
  url: http://host.docker.internal:3001  # Use host.docker.internal for Docker
  siteId: 1
  key: rb_yourapikey  # Optional
```

### For Remote/Production Instances
```yaml
widget:
  type: rybbit
  url: https://rybbit-api.example.com  # Your Rybbit backend URL
  siteId: 1
  key: rb_yourapikey  # Optional
```

## Configuration Options

- `url`: The URL of your Rybbit **backend API** (port 3001 by default, NOT the client UI on port 3002)
- `siteId`: The numeric ID of the site you want to monitor (required)
- `key`: Your Rybbit API key (optional, required if your instance requires authentication)
- `fields`: Array of fields to display (optional, defaults to `["visitors", "pageviews"]`)

## Example

```yaml
- Analytics:
    - Rybbit:
        icon: rybbit.png
        href: http://localhost:3002  # Client UI for clicking through
        description: Website Analytics
        widget:
          type: rybbit
          url: http://localhost:3001  # Backend API for data
          siteId: 123
          key: rb_abc123xyz
          fields: ["visitors", "pageviews", "bounce_rate"]
```

## Fields

- `visitors`: Total unique visitors
- `pageviews`: Total page views
- `bounce_rate`: Bounce rate as a percentage
- `avg_duration`: Average session duration in seconds

## Troubleshooting

### Widget shows errors or no data

1. **Check you're using the correct port**: The widget needs to connect to the Rybbit **backend API** (port 3001), not the client UI (port 3002)

2. **For Docker users**: If Homepage is running in Docker, use `http://host.docker.internal:3001` instead of `http://localhost:3001`

3. **Check the logs**: Look for `rybbitProxyHandler` messages in your Homepage logs. The logs will show:
   - The configured URL and siteId
   - The final API endpoint being called
   - Any API errors

4. **Verify the API endpoint**: The widget will call:
   ```
   http://your-url:3001/api/analytics/sites/{siteId}/overview
   ```
   Make sure this endpoint is accessible from Homepage.

5. **Test the API manually**: Try accessing the endpoint directly:
   ```bash
   curl http://localhost:3001/api/analytics/sites/1/overview
   ```
   or with authentication:
   ```bash
   curl -H "Authorization: Bearer rb_yourkey" http://localhost:3001/api/analytics/sites/1/overview
   ```

6. **Check CORS settings**: If Rybbit is running on a different host, ensure CORS is configured to allow requests from Homepage.

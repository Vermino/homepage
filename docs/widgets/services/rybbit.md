---
title: Rybbit
description: Rybbit Widget Configuration
---

Learn more about [Rybbit](https://rybbit.io).

Displays real-time analytics for websites monitored by your Rybbit instance.

You will need to obtain a Rybbit API key and the site ID for the website you want to monitor from your Rybbit dashboard.

Allowed fields: `["visitors", "pageviews", "bounce_rate", "avg_duration"]`.

```yaml
widget:
  type: rybbit
  url: http://rybbit.host.or.ip:3000
  siteId: 1 # Your Rybbit site ID
  key: rb_yourapikey # Optional: Rybbit API key for authentication
```

## Configuration Options

- `url`: The URL of your Rybbit instance
- `siteId`: The numeric ID of the site you want to monitor (required)
- `key`: Your Rybbit API key (optional, required if your instance requires authentication)
- `fields`: Array of fields to display (optional, defaults to `["visitors", "pageviews"]`)

## Example

```yaml
- Analytics:
    - Rybbit:
        icon: rybbit.png
        href: https://analytics.example.com
        description: Website Analytics
        widget:
          type: rybbit
          url: https://analytics.example.com
          siteId: 123
          key: rb_abc123xyz
          fields: ["visitors", "pageviews", "bounce_rate"]
```

## Fields

- `visitors`: Total unique visitors
- `pageviews`: Total page views
- `bounce_rate`: Bounce rate as a percentage
- `avg_duration`: Average session duration in seconds

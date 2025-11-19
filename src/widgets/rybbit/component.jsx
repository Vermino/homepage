import { useTranslation } from "next-i18next";

import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  // Fetch data every 30 seconds (30000ms)
  const { data: rybbitData, error: rybbitError } = useWidgetAPI(widget, "stats", {
    refreshInterval: 30000,
  });

  if (rybbitError) {
    return <Container service={service} error={rybbitError} />;
  }

  if (!rybbitData) {
    return (
      <Container service={service}>
        <Block label="rybbit.visitors" />
        <Block label="rybbit.pageviews" />
        <Block label="rybbit.bounce_rate" />
        <Block label="rybbit.avg_duration" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="rybbit.visitors" value={t("common.number", { value: rybbitData.visitors })} />
      <Block label="rybbit.pageviews" value={t("common.number", { value: rybbitData.pageviews })} />
      <Block label="rybbit.bounce_rate" value={t("common.percent", { value: rybbitData.bounce_rate })} />
      <Block
        label="rybbit.avg_duration"
        value={t("common.number", { value: Math.round(rybbitData.avg_session_duration) })}
      />
    </Container>
  );
}

import React from "react";
import { Box, Button } from "grommet";

const ApplyButton = ({
  applicationUrl,
  googleTag,
  logEvent,
  position,
  slug,
}) => {
  const app_url = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationUrl)
    ? `mailto:${applicationUrl}?subject=Expatriant Job Post: ${position}&body=Job URL: https://jobs.expatriant.com/position/${slug}`
    : applicationUrl;
  return (
    <Box align="center" pad={{ bottom: "medium" }}>
      <Button
        hoverIndicator={true}
        href={app_url}
        target="_blank"
        label="Apply"
        onClick={(e) => {
          e.stopPropagation();
          logEvent("clicked-apply", googleTag);
        }}
      />
    </Box>
  );
};

export default ApplyButton;

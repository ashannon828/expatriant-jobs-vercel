import React, { useState } from "react";

import { Anchor, Box, Button, Heading, Layer, Text } from "grommet";

import { StatusGood, StatusCritical } from "grommet-icons";
import Link from "next/link";

const PopupModal = ({
  open,
  setOpen,
  status,
  size,
  title,
  body,
  cta,
  link,
  linkText,
}) => {
  return (
    <Layer onEsc={() => setOpen(false)} onClickOutside={() => setOpen(false)}>
      <Box alignSelf="center" width="400px" margin="medium">
        <Box margin={{ bottom: "medium" }} align="center">
          {status === "Success" ? (
            <StatusGood color="status-ok" size="xlarge" />
          ) : (
            <StatusCritical color="status-error" size="xlarge" />
          )}
        </Box>
        <Box align="center">
          <Heading margin="none" level={3}>
            {title}
          </Heading>
          <Text textAlign="center" margin={{ top: "15px" }} size="medium">
            {body}
          </Text>
        </Box>
        <Box margin={{ top: "40px" }} align="center">
          <Button
            hoverIndicator="string"
            size={size}
            label={cta}
            a11yTitle={cta}
            color="brand"
            primary={true}
            onClick={() => setOpen(false)}
          />
          <Link href={link}>
            <Anchor margin={{ top: "10px" }} size="small">
              {linkText}
            </Anchor>
          </Link>
        </Box>
      </Box>
    </Layer>
  );
};

export default PopupModal;

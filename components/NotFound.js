import React from "react";
import { Anchor, Box, Heading, Image, Text, ResponsiveContext } from "grommet";
import PageContainer from "./PageContainer";
import heroImg from "../img/undraw_Taken_if77.svg";

const NotFound = ({ size }) => {
  return (
    <Box margin={{ left: "small", right: "small" }}>
      <Box
        width="xlarge"
        alignSelf="center"
        alignContent="center"
        margin={{ left: "small", right: "small" }}
        pad={{ left: "medium", right: "medium" }}
      >
        <Box justify="center" direction="column">
          <Heading>You're not in the right spot.</Heading>
          <Text>
            Lets take you{" "}
            <span>
              <Anchor className="BackToJobs" href="/">
                back to the jobs
              </Anchor>
              .
            </span>
          </Text>
          <Box height={size !== "small" ? null : "medium"}>
            <Image src={heroImg} fit="contain" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;

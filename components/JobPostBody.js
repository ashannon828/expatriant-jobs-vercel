import React from "react";
import { Box, Image, Text } from "grommet";
import ApplyButton from "./ApplyButton";

import ReactMarkdown from "react-markdown";

function JobPostBody({ job, fontSize, margin, logEvent }) {
  return (
    <Box
      margin={
        margin
          ? {
              bottom: "medium",
              left: "medium",
              right: "medium",
            }
          : null
      }
    >
      <Text size={fontSize}>
        {job.salary && (
          <Box pad={{ top: "20px" }}>
            <span>
              <strong>Annual Salary:</strong> {`$${job.salary}`}
            </span>
          </Box>
        )}
        <ReactMarkdown
          source={`${job.markdown_desc}`
            .trim()
            .replace(/\\n/g, "\n")
            .replace(/((#)(\w))/g, "$2 $3")}
          renderers={{
            image: (props) => (
              <Box
                fill={{ horizontal: false }}
                flex="shrink"
                height={{ max: "medium" }}
                style={{ objectFit: "scale-down" }}
              >
                <Image fit="cover" {...props} />
              </Box>
            ),
          }}
        />
      </Text>
      <ApplyButton
        applicationUrl={job.application_url}
        googleTag={`${job.company}:${job.position}`}
        logEvent={logEvent}
        position={job.position}
        slug={job.expatriant_slug}
      />
      <Box
        pad={{
          left: "medium",
          right: "medium",
          bottom: "small",
        }}
      >
        <Box>
          <Text size="xsmall" weight="bold" color="brand" textAlign="center">
            {`Please let ${job.company} know that you found this job on
							Expatriant Jobs! It will help us grow, and more companies will post here.`}
          </Text>
        </Box>
        <Box>
          <Text size="xsmall" textAlign="center">
            {`Never pay to apply for a job - it is always a scam.  Additionally, always verify that you're talking to the company in the job post and not an imposter. Those seeking work in foreign countries are easy targets for scammers - BE ATTENTIVE AND CAREFUL! When you click the button to apply, you will leave Expatriant Jobs and go to the application page for that company.  We try our best to ensure that all jobs posted are prescreened, however, it is possible that we may miss some.  Expatriant accepts no liability or responsibility as a consequence for your actions.`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default React.memo(JobPostBody, areEqual);

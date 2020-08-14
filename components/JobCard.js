import React from "react";
import { Box, Heading, Text, Image } from "grommet";
import { Language } from "grommet-icons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

import Link from "next/link";

import style from "../public/styles/JobCard.module.css";

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: function (number, withoutSuffix) {
      return withoutSuffix ? "now" : "a few seconds";
    },
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmth",
    y: "1y",
    yy: "%dy",
  },
});

function JobCard({ job, size, logEvent }) {
  console.log("Render job cards");
  const imgSize = size !== "small" ? "55px" : "35px";
  const imgContainer = size !== "small" ? "xsmall" : "xxsmall";
  return (
    <Box
      background="#f8f8f8"
      className={style.JobCard}
      direction="row"
      justify="between"
      height="xsmall"
    >
      <Box direction="row">
        <Box height="xsmall" width={imgContainer} justify="center">
          <Box
            round="xxsmall"
            width={imgSize}
            height={imgSize}
            background="white"
            alignSelf="center"
            justify="center"
            elevation="xsmall"
            overflow="hidden"
          >
            {job.company_logo !== "" ? (
              <Box justify="center" align="center">
                <Image
                  style={{ maxWidth: imgSize, maxHeight: imgSize }}
                  pad="small"
                  fit="contain"
                  src={job.company_logo}
                  alt={`${job.company} logo`}
                />
              </Box>
            ) : (
              <Box fill={true} justify="center" align="center">
                <Heading
                  level={2}
                  color="accent-4"
                  margin="none"
                  responsive={false}
                >
                  {job.company[0]}
                </Heading>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          direction="column"
          justify="center"
          width={size !== "small" ? null : "250px"}
        >
          <Link
            scroll={true}
            href="/position/[slug]"
            as={`/position/${job.expatriant_slug}`}
          >
            <Box
              className={style.toJobPost}
              onClick={(e) => {
                e.stopPropagation();
                logEvent("read-job-url", `${job.company}:${job.position}`);
              }}
            >
              <Text size={size !== "small" ? "small" : "xsmall"}>
                {job.company}
              </Text>
              <Text size={size !== "small" ? "small" : "xsmall"} weight="bold">
                {size !== "small" ? job.position : job.position.slice(0, 70)}
              </Text>
            </Box>
          </Link>
          <Box direction="row" align="center">
            <Language size="small" />
            <Text size="xsmall">{job.location}</Text>
          </Box>
        </Box>
      </Box>
      <Box
        height="xsmall"
        pad={{ right: "medium" }}
        direction="row"
        justify="end"
      >
        <Box align="end" alignSelf="center">
          {dayjs(job.date).fromNow()}
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

export default React.memo(JobCard, areEqual);

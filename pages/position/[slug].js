import React from "react";
import { Anchor, Box, Heading, Text } from "grommet";
import removeMd from "remove-markdown";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

import JobPostBody from "../../components/JobPostBody";
import algoliasearch from "algoliasearch/lite";

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

export async function getServerSideProps(context) {
  const { query, req } = context;

  console.log(req.headers.referer);

  const isBack = req.headers.referer ? req.headers.referer : null;

  const searchClient = algoliasearch(
    process.env.REACT_APP_Algolia_Project,
    process.env.REACT_APP_Search_Key
  );
  const index = searchClient.initIndex(process.env.REACT_APP_Algolia_Index);
  const data = await index.search("", {
    filters: `expatriant_slug:${query.slug}`,
  });
  const job = data.hits[0];

  return {
    props: {
      job,
      isBack,
    },
  };
}

const JobPost = ({ job, isBack }) => {
  const BackToJobs = () => {
    return isBack ? (
      <Anchor onClick={() => Router.back()}>Back to Jobs</Anchor>
    ) : (
      <Link href="/">
        <Anchor>Back to Jobs</Anchor>
      </Link>
    );
  };

  const pageTitle = `${job.company} - ${job.position}`;
  const metaDescription = removeMd(job.markdown_desc).substr(0, 250);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <Box
        width="xlarge"
        margin={{ top: "medium", left: "small", right: "small" }}
      >
        <Box alignSelf="start" width="fit-content">
          <BackToJobs />
        </Box>
        <Box
          alignSelf="center"
          elevation="medium"
          margin={{ top: "medium" }}
          pad={{ left: "large", right: "large" }}
          round="xsmall"
        >
          <Box>
            <Box
              pad={{ top: "medium", bottom: "small" }}
              border={{
                color: "border",
                size: "xsmall",
                style: "solid",
                side: "bottom",
              }}
            >
              <Box pad={{ bottom: "xsmall" }}>
                <Box>
                  <Heading margin="none" level={2}>
                    {job.position}
                  </Heading>
                </Box>
                <Box>
                  <Heading
                    margin={{ top: "xsmall", bottom: "xsmall" }}
                    level={4}
                  >
                    {job.company}
                  </Heading>
                  <Box margin="none" pad={{ top: "xsmall" }}>
                    <Text>{`Located in ${job.location}`}</Text>
                    <Text>{`Posted ${dayjs(job.date).fromNow()} ago`}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            <JobPostBody margin={false} fontSize={"medium"} job={job} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default JobPost;

export async function getServerSideProps(context) {
  const { query, req } = context;
  const isBack = req.headers.referer ? req.headers.referer : null;

  const searchClient = algoliasearch(
    process.env.REACT_APP_Algolia_Project,
    process.env.REACT_APP_Search_Key
  );
  const index = searchClient.initIndex(process.env.REACT_APP_Algolia_Index);
  const data = await index.search("", {
    filters: `expatriant_slug:${query.slug}`,
  });
  const job = data.hits[0];

  return {
    props: {
      job,
      isBack,
    },
  };
}

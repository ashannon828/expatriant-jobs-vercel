import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Heading, Accordion, AccordionPanel, Image } from "grommet";
import algoliasearch from "algoliasearch/lite";

import JobCard from "../components/JobCard";

import JobPostBody from "../components/JobPostBody";
import Pagination from "../components/Pagination";
import SearchComponent from "../components/SearchComponent";

import heroImg from "../public/img/interview.svg";

export async function getServerSideProps(context) {
  console.log(process.env);
  const searchClient = algoliasearch(
    process.env.REACT_APP_Algolia_Project,
    process.env.REACT_APP_Search_Key
  );
  const index = searchClient.initIndex(process.env.REACT_APP_Algolia_Index);
  const data = await index.search();

  return {
    props: {
      ...data,
    },
  };
}

const JobBoard = ({
  size,
  logEvent,
  nbHits,
  hits,
  page,
  nbPages,
  hitsPerPage,
  processingTimeMS,
  location,
  match,
  submitSearch,
  urlQuery,
}) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  submitSearch = (e) => {
    e.preventDefault();
    const route = {
      ...(searchString && {
        q: searchString,
      }),
      ...(searchLocation && {
        l: searchLocation,
      }),
    };

    router.push({ pathname: "/jobs", query: route });
  };
  const metaDescription =
    "Browse handpicked expat jobs in Russia. Expatriant Jobs helps expats find their dream job abroad.";
  const pageTitle = "Expat Jobs in Russia - Expatriant";
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <Box
        alignContent="center"
        align="center"
        pad={{ horizontal: "small", bottom: "small" }}
      >
        <Box
          height={size !== "small" ? "270px" : "small"}
          pad={{ top: "small" }}
        >
          <Image src={heroImg} fit="contain" />
        </Box>

        <Box
          margin={size !== "small" ? "small" : "large"}
          width={{ max: "500px" }}
          alignSelf="center"
        >
          <Heading margin="none" alignSelf="center" textAlign="center">
            Browse Expat Jobs in Russia
          </Heading>
          <Heading alignSelf="center" textAlign="center" level={4}>
            Find sales, marketing, translating, editing and teaching jobs in
            Russia.
          </Heading>
        </Box>

        <Box>
          <SearchComponent
            size={size}
            page={page}
            searchString={searchString}
            setSearchString={setSearchString}
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
            submitSearch={submitSearch}
            nbHits={nbHits}
            processingTimeMS={processingTimeMS}
          />
        </Box>
        <Box pad="small">
          <Box elevation="xsmall" width="xlarge">
            <Accordion
              onActive={(idx) => {
                let job = hits[idx];
                if (job) {
                  logEvent(
                    "read-job-accordion",
                    `${job.company}:${job.position}`
                  );
                }
              }}
            >
              {hits.map((hit) => (
                <AccordionPanel
                  key={hit.objectID}
                  header={
                    <JobCard
                      location={location}
                      size={size}
                      match={match}
                      job={hit}
                      logEvent={logEvent}
                    />
                  }
                >
                  <Box>
                    <JobPostBody
                      margin={true}
                      fontSize={"small"}
                      job={hit}
                      logEvent={logEvent}
                    />
                  </Box>
                </AccordionPanel>
              ))}
            </Accordion>
          </Box>
        </Box>
        <Pagination
          nbHits={nbHits}
          page={page}
          nbPages={nbPages}
          hitsPerPage={hitsPerPage}
          urlQuery={urlQuery}
        />
      </Box>
    </>
  );
};

export default JobBoard;

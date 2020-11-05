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
  const { query } = context;

  const algoliaSearchObj = {
    ...(query.q && {
      query: query.q,
    }),
    ...(query.l && {
      filters: `location:"${query.l}"`,
    }),
    ...(query.start && {
      page: query.start / 20,
    }),
  };

  const searchClient = algoliasearch(
    process.env.REACT_APP_Algolia_Project,
    process.env.REACT_APP_Search_Key
  );

  const index = searchClient.initIndex(process.env.REACT_APP_Algolia_Index);
  const data = await index.search(algoliaSearchObj);

  return {
    props: {
      urlQuery: query,
      ...data,
      ...(query.q && {
        searchQuery: query.q,
      }),
      ...(query.l && {
        searchLoc: query.l,
      }),
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
  searchQuery,
  searchLoc,
  urlQuery,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState(
    searchQuery ? searchQuery : ""
  );
  const [searchLocation, setSearchLocation] = useState(
    searchLoc ? searchLoc : ""
  );

  submitSearch = (e) => {
    e.preventDefault();
    const searchObj = {
      ...(searchString && {
        q: searchString,
      }),
      ...(searchLocation && {
        l: searchLocation,
      }),
    };

    router.push({ pathname: "/jobs", query: searchObj });
  };

  const metaDescription =
    "Browse sales, marketing, translating, editing and English teaching jobs in Russia.";
  const pageTitle = "Jobs in Russia - Expatriant";

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
            Jobs in Russia
          </Heading>
          <Heading alignSelf="center" textAlign="center" level={4}>
            Browse sales, marketing, translating, editing and English teaching
            jobs in Russia.
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
                    "read-job",
                    "accordion",
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

import React from "react";
import { Box, Button, Form, Text, Anchor } from "grommet";
import { Checkmark } from "grommet-icons";

import QueryComponent from "./QueryComponent";
import LocationFilter from "./LocationFilter";

const SearchComponent = ({
  size,
  searchString,
  setSearchString,
  searchLocation,
  setSearchLocation,
  submitSearch,

  nbHits,
  processingTimeMS,
}) => {
  console.log("render serach component");
  return (
    <Box width="xlarge" align="center" pad={{ left: "20px", right: "20px" }}>
      <Form onSubmit={(e) => submitSearch(e)}>
        <Box direction={size !== "small" ? "row" : "column"}>
          <QueryComponent
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <Box
            margin={size !== "small" ? { left: "10px" } : { top: "5px" }}
            direction="row"
            align="center"
          >
            <LocationFilter
              searchLocation={searchLocation}
              setSearchLocation={setSearchLocation}
            />
            <Box margin={{ left: "8px" }}>
              <Button
                alignSelf="center"
                primary
                plain={false}
                type="submit"
                icon={<Checkmark />}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          {nbHits > 0 ? (
            <Text size="xsmall">{`Returned ${nbHits} records in ${processingTimeMS}ms`}</Text>
          ) : (
            <Text size="xsmall">No results found</Text>
          )}
          <Text size="xsmall" alignSelf="start">
            {`Got feedback?  `}
            <Anchor href="mailto:contact@expatriant.com?subject=Job Board Feedback">
              Let us know
            </Anchor>
            !
          </Text>
        </Box>
      </Form>
    </Box>
  );
};

export default SearchComponent;

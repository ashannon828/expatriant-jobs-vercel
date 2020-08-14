import React from "react";
import { Box, TextInput } from "grommet";
import { Search } from "grommet-icons";

const QueryComponent = ({ searchString, setSearchString }) => {
  return (
    <>
      <Box
        align="center"
        direction="row"
        round="small"
        pad={{ horizontal: "small" }}
        border={{
          side: "all",
        }}
      >
        <Search color="brand" />
        <TextInput
          type="search"
          plain
          value={searchString}
          placeholder="Search Expat Jobs..."
          onChange={(e) => {
            setSearchString(e.currentTarget.value, 0);
          }}
        />
      </Box>
    </>
  );
};

export default QueryComponent;

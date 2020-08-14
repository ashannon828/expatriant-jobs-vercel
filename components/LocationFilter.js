import React from "react";
import { Box, TextInput } from "grommet";
import { Location } from "grommet-icons";
import PlacesAutocomplete from "react-places-autocomplete";

const LocationFilter = ({ searchLocation, setSearchLocation }) => {
  const searchOptions = {
    types: ["geocode"],
    componentRestrictions: {
      country: "ru",
    },
  };
  return (
    <PlacesAutocomplete
      name="searchLocation"
      value={searchLocation}
      searchOptions={searchOptions}
      onChange={setSearchLocation}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <Box
          onBlur={() =>
            suggestions[0] && setSearchLocation(suggestions[0].description)
          }
          fill="vertical"
          align="center"
          direction="row"
          round="small"
          pad={{ horizontal: "small" }}
          border={{
            side: "all",
          }}
        >
          <Location color="brand" />
          <TextInput
            plain
            {...getInputProps({
              placeholder: "Location...",
              className: "searchLocation-input",
            })}
            suggestions={suggestions.map(
              (suggestion) => suggestion.description
            )}
            onSelect={(e) => setSearchLocation(e.suggestion)}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" && suggestions[0]) ||
                (e.key === "Tab" && suggestions[0])
              ) {
                setSearchLocation(suggestions[0].description);
              }
            }}
          />
        </Box>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationFilter;

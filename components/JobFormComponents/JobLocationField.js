import React from "react";
import { Box, FormField, TextInput, Text } from "grommet";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const getGeoData = async (val) => {
  const geoData = await geocodeByAddress(val);
  const latLng = await getLatLng(geoData[0]);
  return latLng;
};

const JobLocationField = ({ handleObject, location }) => {
  const searchOptions = {
    types: ["geocode"],
    componentRestrictions: {
      country: "ru",
    },
  };

  return (
    <PlacesAutocomplete
      name="location"
      value={location}
      searchOptions={searchOptions}
      onChange={(val) => handleObject({ location: val, latLng: {} })}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <>
          <FormField
            label="LOCATION*"
            onBlur={async () =>
              suggestions[0] &&
              handleObject({
                location: suggestions[0].description,
                latLng: await getGeoData(suggestions[0].description),
              })
            }
          >
            <TextInput
              plain
              {...getInputProps({
                placeholder: "Your position's location",
                className: "location-input",
              })}
              suggestions={suggestions.map(
                (suggestion) => suggestion.description
              )}
              onSelect={async (e) => {
                handleObject({
                  location: e.suggestion,
                  latLng: await getGeoData(e.suggestion),
                });
              }}
              onKeyDown={async (e) => {
                if (
                  (e.key === "Enter" && suggestions[0]) ||
                  (e.key === "Tab" && suggestions[0])
                ) {
                  handleObject({
                    location: suggestions[0].description,
                    latLng: await getGeoData(suggestions[0].description),
                  });
                }
              }}
            />
          </FormField>
          <Box>
            <Text size="xsmall">Enter the location for this job.</Text>
          </Box>
        </>
      )}
    </PlacesAutocomplete>
  );
};

export default JobLocationField;

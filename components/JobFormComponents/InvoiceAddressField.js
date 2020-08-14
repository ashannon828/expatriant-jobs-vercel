import React from "react";
import { Box, FormField, TextInput, Text } from "grommet";
import PlacesAutocomplete from "react-places-autocomplete";

const InvoiceAddressField = ({ handleObject, client_address }) => {
  const searchOptions = {
    types: ["address"],
  };

  return (
    <PlacesAutocomplete
      name="client_address"
      value={client_address}
      searchOptions={searchOptions}
      onChange={(val) => handleObject({ client_address: val })}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <>
          <FormField
            label="INVOICE ADDRESS"
            onBlur={async () => {
              console.log(suggestions);
              suggestions[0] &&
                handleObject({
                  client_address: suggestions[0].description,
                });
            }}
          >
            <TextInput
              plain
              {...getInputProps({
                placeholder: "Your company's invoice address",
                className: "client_address-input",
              })}
              suggestions={suggestions.map(
                (suggestion) => suggestion.description
              )}
              onSelect={async (e) => {
                handleObject({
                  client_address: e.suggestion,
                });
              }}
              onKeyDown={async (e) => {
                if (
                  (e.key === "Enter" && suggestions[0]) ||
                  (e.key === "Tab" && suggestions[0])
                ) {
                  handleObject({
                    client_address: suggestions[0].description,
                  });
                }
              }}
            />
          </FormField>
          <Box>
            <Text size="xsmall">
              If you include your company's address, we'll include it on the
              stripe invoice. We cannot change this later.
            </Text>
          </Box>
        </>
      )}
    </PlacesAutocomplete>
  );
};

export default InvoiceAddressField;

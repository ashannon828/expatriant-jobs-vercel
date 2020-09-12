import React from "react";
import { Box, Heading, Select, Text } from "grommet";

const JobCategoryField = ({ handleChange, category }) => {
  return (
    <>
      <Box
        direction="row"
        pad={{ top: "medium", bottom: "small" }}
        align="center"
      >
        <Heading pad="none" margin="none" level={4}>
          Primary Category
        </Heading>
        <Box pad={{ left: "10px" }}>
          <Select
            name="category"
            value={category}
            options={[
              "Sales, Marketing, and Business Development",
              "Finance",
              "Operations",
              "Translation, Copywriting, and Editing",
              "Teaching",
              "Nanny, and Governor",
              "Software Development",
              "Data Analysis",
              "Design",
              "Technical Support",
              "Customer Support",
              "Other",
            ]}
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Text size="xsmall">This tag will help categorize your job post.</Text>
    </>
  );
};
export default JobCategoryField;

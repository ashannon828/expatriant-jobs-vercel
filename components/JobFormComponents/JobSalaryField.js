import React from "react";
import { Box, Select, TextInput } from "grommet";

export default function JobSalaryField({ currency, amount, handleChange }) {
  return (
    <Box direction="row">
      <Select
        plain={true}
        name="currency"
        value={currency}
        required={true}
        placeholder="RUB"
        options={["RUB", "USD", "EUR", "GBP"]}
        onChange={handleChange}
      />
      <Box fill={true} pad={{ left: "10px" }}>
        <TextInput
          plain={true}
          name="amount"
          value={amount}
          type="number"
          placeholder="Your position's salary"
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
}

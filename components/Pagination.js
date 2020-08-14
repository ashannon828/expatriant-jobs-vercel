import React from "react";
import { Box, Button, Text } from "grommet";
import { Previous, Next } from "grommet-icons";
import Link from "next/link";

const Pagination = ({ urlQuery, page, nbPages, hitsPerPage }) => {
  return (
    <Box direction="column" align="center">
      <Box direction="row" justify="center">
        <Box pad="xsmall">
          <Link
            href={{
              pathname: "/jobs",
              query: {
                ...urlQuery,
                ...(page - 1 >= 0 && {
                  start: (page - 1) * hitsPerPage,
                }),
              },
            }}
          >
            <Button
              alignSelf="center"
              primary
              plain={false}
              icon={<Previous />}
            />
          </Link>
        </Box>
        <Box pad="xsmall">
          <Link
            href={{
              pathname: "/jobs",
              query: {
                ...urlQuery,
                ...(page + 1 < nbPages && {
                  start: (page + 1) * hitsPerPage,
                }),
              },
            }}
          >
            <Button alignSelf="center" primary plain={false} icon={<Next />} />
          </Link>
        </Box>
      </Box>
      <Box>
        <Text size="small">{`Page ${
          nbPages > 0 ? page + 1 : nbPages
        } of ${nbPages}`}</Text>
      </Box>
    </Box>
  );
};

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default React.memo(Pagination, areEqual);

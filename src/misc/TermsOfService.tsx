import { Box, Grommet, Markdown } from "grommet"
import React from 'react'
import { theme } from "../theme"


const tos = `
  WiP
`;

function TermsOfService() {
  return (
    <Grommet theme={theme}>
      <Box align="center">
        <Markdown>
          {tos}
        </Markdown>
      </Box>
    </Grommet>
  )
}

export default TermsOfService;

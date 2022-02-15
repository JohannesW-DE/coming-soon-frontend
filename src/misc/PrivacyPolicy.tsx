import { Box, Grommet, Markdown } from "grommet"
import React from 'react'
import { theme } from "../theme"


const pp = `
  WiP
`;

function PrivacyPolicy() {
  return (
    <Grommet theme={theme}>
        <Box align="center">
        <Markdown>
          {pp}
        </Markdown>
        </Box>
    </Grommet>
  )
}

export default PrivacyPolicy;

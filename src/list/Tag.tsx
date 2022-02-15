import { Box, Text } from 'grommet';
import React from 'react';

interface IProps {
  value: string;
}

function Tag({value}: IProps) {
  return (
    <Box background="background_foo" justify="center" alignSelf="center" height="25px" round pad={{ horizontal: 'small', vertical: 'xxsmall' }}>
      <Text color="white" size="xsmall">
        {value}
      </Text>
    </Box>
  )
}

export default Tag;
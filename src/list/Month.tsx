import { Card, Heading } from "grommet";
import React from 'react';

interface IProps {
  value: string;
}

function Month({value}: IProps) {
  return (
    <Card height='30px' background='background_dark_1' justify='center' margin={{bottom: 'medium'}} border={{side: 'all', size: 'xsmall', color: 'white'}}>
      <Heading level={5} size="small" alignSelf='center' color="text_dark_1">
        {value}
      </Heading>
    </Card>
  )
}

export default Month;
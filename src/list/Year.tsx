import { Card, Heading } from "grommet"
import React from 'react'

interface IProps {
  value: string;
}

function Year({value}: IProps) {
  return (
    <Card height='40px' background='background_dark_1' justify='center' margin={{bottom: 'medium', top: 'xxsmall'}} border={{side: 'all', size: 'xsmall', color: 'white'}}>
      <Heading level={4} size="small" alignSelf='center' color="text_dark_1">
        {value}
      </Heading>
    </Card>
  )
}

export default Year;
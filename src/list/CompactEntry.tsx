import { Card, CardBody, CardFooter, CardHeader, Text, Image, Box, Grid } from 'grommet';
import { format } from 'date-fns';
import React from 'react';

interface IProps {
  id: string,
  title: {
    name: string;
    season: number;
  },
  date: string,
  comment: string,
  overview: string,
  addedAt: Date, 
}

function CompactEntry({
  id,
  title: {
    name,
    season,
  },
  date,
  comment,
  overview,
  addedAt
}: IProps) {

  return (
    <Card width='large' background="background_dark_2">
      <CardHeader align="left" background="background_foo" height="30px">     
        <Text alignSelf="center" color="white" margin={{left: '15px'}} size="small">
          {date} - <b>{name}</b> {season !== - 1 && ` (Season ${season})`}
        </Text>
      </CardHeader>
      <CardBody pad="small">
        <Grid
          fill="horizontal"
          areas={[
            { name: 'poster', start: [0, 0], end: [0, 0] },
            { name: 'details', start: [1, 0], end: [1, 0] },
          ]}
          columns={['50px', 'flex']}
          rows={['flex']}
          gap="small"
        >
          <Box>
            <Box width="xxsmall">
              <Image
                fit="contain"
                src={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/${id}.jpg`}
                fallback={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/no_poster.png`}
              />
            </Box>
          </Box>
          <Box direction="column" gap="medium" alignContent="top">
            <Text size="small" color="text_dark_1">{overview}</Text>
            <Text style={{whiteSpace: 'pre-wrap'}} size="small">{comment}</Text>       
          </Box>
        </Grid>
      </CardBody>
    <CardFooter justify="end" background="background_foo" height="25px" pad={{left: '5px', right: '15px'}}>
      <Text color="white" textAlign="end" alignSelf="center" size="small">added: {format(addedAt, 'dd/MM/yyyy')}</Text>
    </CardFooter>
  </Card>
  )
}


export default CompactEntry;
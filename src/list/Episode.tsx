import React, { useState } from 'react';
import { Box, CheckBox, Grid, Text } from 'grommet';
import { format, fromUnixTime } from 'date-fns';
import { IEpisode } from './ListView.interface';
import { UserState } from './ListView';

interface IProps {
  episode: IEpisode;
  userState: UserState;
  onWatchedToggle: (id: number, watched: boolean) => void;
}

function Episode({ episode, userState, onWatchedToggle}: IProps) {
  const [showOverview, setShowOverview] = useState(false);

  const onSeenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onWatchedToggle(episode.id, event.target.checked)
  };

  const opacity = episode.watched_gql ? 0.7 : 1.0;

  return (
    <Box data-episode-id={episode.id} round="small" width="550px" direction="column" background="background_dark_1" animation="fadeIn">
      <Grid
        areas={[
          { name: 'number', start: [0, 0], end: [0, 1] },            
          { name: 'name', start: [1, 0], end: [1, 0] },
          { name: 'date', start: [2, 0], end: [2, 0] },            
          { name: 'overview', start: [1, 1], end: [2, 1] },            
        ]}
        columns={['120px', 'flex', '30px']}
        rows={['35px', 'flex']}
      >
        <Box gridArea="number" direction='row' gap="xsmall" justify="center" style={{opacity}} align="center" background="background_light_1" round={{'size': 'small', 'corner': 'left'}}>
          <Text size="xsmall">{format(fromUnixTime(+episode.air_date / 1000), 'dd/MM/yyyy')}</Text>
          -
          <Text color="white" size="small">#{episode.episode_number}</Text>
        </Box>
        <Box gridArea="name" justify="center" pad={{left: 'small'}} style={{opacity}} onClick={() => {setShowOverview(!showOverview)}} focusIndicator={false}>
          <Text >{episode.name}</Text>
        </Box>
        <Box gridArea="date" justify="center" style={{opacity}}>
          {userState === UserState.AUTHORIZED &&
          <CheckBox checked={episode.watched_gql} onChange={onSeenChange} />
          }
        </Box>
        {showOverview && episode.overview !== '' &&
        <Box border={{side:'top'}} style={{opacity}} gridArea="overview" pad={{left: 'small', right: 'small', bottom: 'small', top: 'small'}} animation={showOverview ? {type: 'fadeIn', duration: 700}: {type: 'fadeOut', duration: 700}}>
          <Text size="small">{episode.overview}</Text>
        </Box>
        }
      </Grid>
    </Box>
  );
}

export default Episode;

/* eslint-disable max-len */
import { gql, useMutation } from '@apollo/client';
import {
  Box, Image, Text, Grid, Tip, CheckBox,
} from 'grommet';
import React, { useState } from 'react';
import { IComingSoonMatch } from './ComingSoon.interface';

export const GQL_MUTATION_UPDATE_WATCHED = gql`
  mutation UpdateWatched($movieId: ID, $tvShowId: ID, $episode: Int, $watched: Boolean) {
    updateWatched(movieId: $movieId, tvShowId: $tvShowId, episode: $episode, watched: $watched)
  }
`;

export interface IUpdateWatchedVars {
  movieId?: string;
  tvShowId?: string;
  episode?: number;
  watched: boolean;
}

export interface IUpdateWatched {
  updateWatched: boolean;
}

interface IProps {
  entry: IComingSoonMatch,
  isFirst: boolean,
  isLast: boolean,
}

function Entry({
  entry,
  isFirst,
  isLast,
}: IProps) {
  const [hidePoster, setHidePoster] = useState(false);

  const onPosterError = () => {
    setHidePoster(true);
  };

  const [updateWatched] = useMutation<IUpdateWatched, IUpdateWatchedVars>(GQL_MUTATION_UPDATE_WATCHED);

  let overview = '';
  let posterId = '';

  let id = '';
  let top = '';
  let middle = '';
  let bottom = '';
  let isWatched = false;

  if (entry.movie) {
    posterId = entry.movie._id;
    id = entry.movie._id;

    top = entry.movie.title;

    overview = entry.movie.overview;

    isWatched = entry.movie.watched_gql;
  } else if (entry.episode && entry.tv_show) {
    posterId = entry.tv_show._id;
    id = entry.episode.id.toString();

    top = `${entry.episode.season_number}x${entry.episode.episode_number}`;
    middle = entry.tv_show.name;
    bottom = entry.episode.name;

    overview = entry.episode.overview;

    isWatched = entry.episode.watched_gql;
  }

  const [watched, setWatched] = useState(isWatched);

  const type = entry.movie ? 'movie' : 'tv';

  const onSeenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateWatched({
      variables: {
        movieId: entry.movie ? entry.movie._id : undefined,
        tvShowId: entry.tv_show ? entry.tv_show._id : undefined,
        episode: entry.episode?.id,
        watched: event.target.checked,
      },
    }).then((result) => {
      if (result.data?.updateWatched === true) {
        setWatched(!watched);
      }
    });
  };

  const opacity = watched ? 0.5 : 1.0;

  return (
    <Box data-entry-id={id} animation="fadeIn">
      {!hidePoster
        && (
        <Grid
          areas={[
            { name: 'poster', start: [0, 0], end: [0, 2] },
            { name: 'top_left', start: [1, 0], end: [1, 0] },
            { name: 'top_right', start: [2, 0], end: [2, 0] },
            { name: 'middle', start: [1, 1], end: [2, 1] },
            { name: 'bottom', start: [1, 2], end: [2, 2] },
          ]}
          columns={['50px', 'flex', '18px']}
          rows={['20px', 'flex', '']}
          gap={{ row: 'xsmall', column: 'small' }}
          border={!isLast ? 'bottom' : undefined}
          margin={{ top: !isFirst ? 'small' : undefined }}
          pad={{ bottom: !isLast ? 'small' : undefined }}
        >
          <Box gridArea="poster" alignContent="top" style={{ opacity }}>
            <Box>
              <Image hidden={hidePoster} fit="contain" src={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/${posterId}.jpg`} onError={onPosterError} />
            </Box>
          </Box>
          {overview && type === 'movie'
            ? (
              <Tip
                content={(
                  <Box width="medium">
                    <Text size="xsmall">{overview}</Text>
                  </Box>
            )}
              >
                <Text gridArea="top_left" color="text_dark_1" style={{ opacity }}>{top}</Text>
              </Tip>
            )
            : (
              <Text gridArea="top_left" color="text_dark_1" style={{ opacity }}>{top}</Text>
            )}
          <Box gridArea="top_right" style={{ opacity }}>
            <CheckBox checked={watched} onChange={onSeenChange} />
          </Box>
          <Text gridArea="middle" color="text_dark_1" size="small" weight="bold" style={{ opacity }}>{middle}</Text>
          {overview && type === 'tv'
            ? (
              <Tip
                content={(
                  <Box width="medium">
                    <Text size="xsmall">{overview}</Text>
                  </Box>
            )}
              >
                <Text gridArea="bottom" size="small" color="text_dark_1" style={{ opacity }}>{bottom}</Text>
              </Tip>
            )
            : (
              <Text gridArea="bottom" size="small" color="text_dark_1" style={{ opacity }}>{bottom}</Text>
            )}
        </Grid>
        )}
      {hidePoster
        && (
        <Box
          direction="column"
          border={!isLast ? 'bottom' : undefined}
          margin={{ top: !isFirst ? 'small' : undefined }}
          pad={{ bottom: !isLast ? 'small' : undefined }}
        >
          {overview && type === 'movie'
            ? (
              <Tip
                content={(
                  <Box width="medium">
                    <Text size="xsmall">{overview}</Text>
                  </Box>
            )}
              >
                <Text gridArea="top" color="text_dark_1">{top}</Text>
              </Tip>
            )
            : (
              <Text color="text_dark_1">{top}</Text>
            )}
          <Text color="text_dark_1">{middle}</Text>
          {overview && type === 'tv'
            ? (
              <Tip
                content={(
                  <Box width="medium">
                    <Text size="xsmall">{overview}</Text>
                  </Box>
            )}
              >
                <Text size="small" color="text_dark_1">{bottom}</Text>
              </Tip>
            )
            : (
              <Text color="text_dark_1">{bottom}</Text>
            )}
        </Box>
        )}
    </Box>
  );
}

export default Entry;

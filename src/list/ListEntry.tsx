import { useLazyQuery, useMutation } from '@apollo/client';
import { format, fromUnixTime, getUnixTime, isValid, parseISO } from 'date-fns';
import getYear from 'date-fns/getYear';
import { Button, Card, CardBody, CardFooter, CardHeader, Text, Image, Box, Grid, TextArea, Anchor, Tip, CheckBox } from 'grommet';
import { Add, Down, Edit, FormDown, FormUp, Trash, Up, Youtube } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { GQL_MUTATION_UPDATE_WATCHED, IUpdateWatched, IUpdateWatchedVars } from '../comingSoon/Entry';
import CompactEntry from './CompactEntry';
import Episode from './Episode';
import { GQL_GET_EPISODES } from './ListEntry.gql';
import { IQueryEpisodes, IQueryEpisodesVars } from './ListEntry.interface';
import { IEntry, UserState } from './ListView';
import { IEpisode, IExternalId, ISeason, IVideo, IWatchProvider } from './ListView.interface';
import Month from './Month';
import Tag from './Tag';
import Year from './Year';

interface IProps {
  entry: IEntry,
  compact: boolean,
  showAdd: boolean,
  userState: UserState,
  showYear: boolean,
  showMonth: boolean,
  remove: (entry: IEntry) => void,
  updateComment: (entryId: string, text: string) => void,
  add: (entry: IEntry) => void,
}

function ListEntry({
  entry,
  compact,
  showAdd,
  userState,
  showYear,
  showMonth,
  remove,
  updateComment,
  add,    
}: IProps) {

  if (!entry.movie && !entry.tvShow) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return (<></>)
  }
  const defaultPriority = 10;
  const maxPriority = 500;

  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(entry.comment ? entry.comment : '')
  const [showAll, setShowAll] = useState(false);
  const [displayPriority, setDisplayPriority] = useState(defaultPriority);

  const [updateWatched] = useMutation<IUpdateWatched, IUpdateWatchedVars>(GQL_MUTATION_UPDATE_WATCHED);    
  const [queryEpisodes, episodesQuery] = useLazyQuery<IQueryEpisodes, IQueryEpisodesVars>(GQL_GET_EPISODES);

  const [episodes, setEpisodes] = useState<IEpisode[]>([]);

  const [movieWatched, setMovieWatched] = useState(entry.movie && entry.movie.watched_gql);

  const onCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.currentTarget.value);
  }

  // merged variables
  let id: string = ''
  let tmdbLink: string = ''
  let title: string = ''
  let overview: string = ''
  let date: string = ''
  let genres: string[] = [];
  let videos: IVideo[] = [];
  let externalIds: IExternalId[] = [];
  let season: number = -1;
  let watchProviders: IWatchProvider[] = [];

  let currentSeason: ISeason | null = null;

  if (entry.movie) {
    id = entry.movie._id
    title = entry.movie.title
    overview = entry.movie.overview;
    date = (entry.date && isValid(entry.date)) ? format(entry.date, 'dd/MM/yyyy') : '??/??/????'
    genres = entry.movie.genres;
    videos = entry.movie.videos;
    externalIds = entry.movie.external_ids;
    tmdbLink = `https://www.themoviedb.org/movie/${entry.movie.tmdb_id}`;
    watchProviders = entry.movie.watch_providers_gql;

  } else if (entry.tvShow) {
    id = entry.tvShow._id;
    season = entry.season ? entry.season : -1;    
    title = entry.tvShow.name;
    overview = entry.tvShow.overview;
    // date
    const s = entry.tvShow.seasons.find((e) => e.season_number === entry.season);
    if (s) {
      currentSeason = s;
    }
    date = (entry.date && isValid(entry.date)) ? format(entry.date, 'dd/MM/yyyy') : '??/??/????'
    genres = entry.tvShow.genres;
    videos = entry.tvShow.videos;
    externalIds = entry.tvShow.external_ids;
    tmdbLink = `https://www.themoviedb.org/tv/${entry.tvShow.tmdb_id}`;    
    watchProviders = entry.tvShow.watch_providers_gql;        
  }
  
  const type = entry.movie ? 'movie' : 'tv'; // maybe 4 convenience

  const genreTags = genres?.map((e) => <Tag key={e} value={e} />);

  const videoElements = videos.filter((e) => e.type === 'Trailer').map((e) => (
      <Anchor key={e.key} href={`https://www.youtube.com/watch?v=${e.key}`}>
        <Box>
          <Tip content={ <Text size="xsmall">{e.name} ({format(parseISO(e.published_at), 'dd/MM/yyyy')})</Text> }>
            <Youtube color="red"/>
          </Tip>
        </Box>
      </Anchor>
    ));

  const watchProviderElements = watchProviders.filter((e) => e.display_priority < displayPriority).slice(0, 25).map((e) => {
    let tipContent = e.type !== 'free' ? `${e.name} (${e.iso_3166_1})` : `${e.name} (${e.iso_3166_1}) (${e.type})`;

    if (e.type === 'rent' && watchProviders.find((wp) => (wp.logo === e.logo && wp.iso_3166_1 === e.iso_3166_1 && wp.type === 'buy'))) {
      return null;
    }
    if (e.type === 'buy' && watchProviders.find((wp) => (wp.logo === e.logo && wp.iso_3166_1 === e.iso_3166_1 && wp.type === 'rent'))) {
      tipContent = `${e.name} (${e.iso_3166_1}) (buy, rent)`;
    }    

    return (
      <Tip key={`${e.logo}${e.iso_3166_1}${e.type}`} content={(
        <Box>
          <Text size="xsmall">{tipContent}</Text>
        </Box>
        )}>      
        <Box data-wp-id={`${e.logo}-${e.iso_3166_1}`} width="25px" animation="fadeIn">
          <Image fit="contain" src={`${process.env.REACT_APP_BACKEND_BASE_URL}/logo/${e.logo}.jpg`} />  
        </Box>
      </Tip>
    )
  })

  const linkElements = externalIds.filter((e) => e.name === 'imdb').map((e) => {
    const href = `https://www.imdb.com/title/${e.id}/` 
    return (
      <Anchor href={href} key={e.id}>
        <Box width="40px">
          <Image src={`${process.env.REACT_APP_BACKEND_BASE_URL}/imdb.svg`}/>
        </Box>
      </Anchor>
    )
  }).concat(
    (
      <Anchor href={tmdbLink} key="tmdb">
        <Box width="40px">
          <Image src={`${process.env.REACT_APP_BACKEND_BASE_URL}/tmdb.svg`}/>
        </Box>
      </Anchor>
    )
  );

  const onAddClick = () => add(entry);
  const onRemoveClick = () => remove(entry);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  }

  const preloadEpisodes = () => {
    if (episodesQuery.data === undefined) { // only preload once
      queryEpisodes({ variables: { tvShowId: id, season} });
    }
  }

  const onWatchedToggle = async (episodeId: number, watched: boolean) => {
    const result = await updateWatched({
      variables: {
        movieId: undefined,
        tvShowId: id,
        episode: episodeId,
        watched,
      }
    });
    if (result.data?.updateWatched) {
      queryEpisodes({ variables: { tvShowId: id, season} });
    }
  }

  const onMovieWatchedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateWatched({
      variables: {
        movieId: id,
        tvShowId: undefined,
        episode: undefined,
        watched: event.target.checked,
      }
    }).then((result) => {
      if (result.data?.updateWatched) {
        setMovieWatched(!movieWatched);
      }
    }) 
  }

  const eList = episodes?.map((e) => (
      <Episode key={e.id} userState={userState} episode={e} onWatchedToggle={onWatchedToggle}/>
    ))

  const cinemaDates = entry.movie?.release_dates.map((e) => (
      <Box key={e.iso_3166_1} round="xxsmall" direction="row" background="background_dark_1" animation="fadeIn" height="20px">
        <Box pad="xsmall" justify="center" align="center" background="background_light_1" round={{'size': 'xxsmall', 'corner': 'left'}}>
          <Text size="xsmall">{e.iso_3166_1}</Text>
        </Box>
        <Box pad="xsmall" justify="center" align="center" background="background_foo" round={{'size': 'xxsmall', 'corner': 'right'}}>
          <Text color="white" size="small">{format(fromUnixTime(+e.release_date / 1000), 'dd/MM/yyyy')}</Text>
        </Box>        
      </Box>
    ))

  useEffect(() => {
    const toShow = currentSeason?.episodes.map((e) => e.episode_number);

    if (showAll) {
      if (episodesQuery.data && episodesQuery.data.episodes !== undefined) {
        setEpisodes(episodesQuery.data.episodes);
      }
    } else if (episodesQuery.data && toShow) {
        setEpisodes(episodesQuery.data.episodes.filter(e => toShow.includes(e.episode_number)));
      } else if (currentSeason) {
          setEpisodes(currentSeason.episodes);
        }
  }, [showAll, episodesQuery.data])


  const toggleWatchProviders = () => {
    if (displayPriority === defaultPriority) {
      setDisplayPriority(maxPriority);
    } else {
      setDisplayPriority(defaultPriority);
    }
  }

  if (compact) {
    return (
      <CompactEntry
        key={id}
        id={id}
        title={{
          name: title, 
          season
        }}
        date={date}
        comment={comment}
        overview={overview}
        addedAt={entry.addedAt}
      />
    )
  // eslint-disable-next-line no-else-return
  } else {
    return (
      <>
        {showYear && entry.date &&
        <Year key={getYear(entry.date)} value={getYear(entry.date).toString()} />
        }
        {showYear && !entry.date &&
        <Year key='unknown' value='Date not yet known' />
        }        
        {showMonth && entry.date &&
        <Month key={getUnixTime(entry.date)} value={format(entry.date, 'LLLL')} />
        }        
        <Card width='large' background="background_dark_2" border data-entry-id={type === 'movie' ? id : `${id}-${season}`}>
          <CardHeader align="left" background="background_foo" height="xxsmall">
            <Grid
              fill
              areas={[
                { name: 'title', start: [0, 0], end: [0, 0] },
                { name: 'icons', start: [1, 0], end: [1, 0] },
              ]}
              columns={['auto', '200px']}
              rows={['flex']}
            >          
              <Text alignSelf="center" color="white" margin={{left: '15px'}}>
                {date} - <b>{title}</b> {season !== -1 && `(Season ${season})`}
              </Text>
              {userState !== UserState.NOTHING &&
              <Box direction="row" justify="end" pad={{'right': '20px'}} gap="small">
                {userState === UserState.AUTHORIZED && entry.movie &&
                <CheckBox checked={movieWatched} onChange={onMovieWatchedChange} />
                }
                {userState === UserState.AUTHORIZED &&
                <Box justify="center">
                  <Button id="edit" plain={false} icon={<Edit color="white" size="14px"/>} onClick={() => {setEditing(true)}} style={{padding: '8px', borderRadius: '10px'}}/>
                </Box>
                }
                {userState === UserState.AUTHORIZED &&
                  <Box justify="center">               
                    <Button id="remove" plain={false} icon={<Trash color="white" size="14px"/>} onClick={onRemoveClick} style={{padding: '8px', borderRadius: '10px'}}/>
                  </Box>
                }             
                {showAdd &&
                <Box justify="center" >
                  <Button id="add" plain={false} icon={<Add color="white" size="14px"/>} onClick={onAddClick} style={{padding: '8px', borderRadius: '10px'}}/>
                </Box>            
                }
              </Box>
              }
            </Grid>
          </CardHeader>
          <CardBody pad="medium">
            <Grid
              fill="horizontal"
              areas={[
                { name: 'poster', start: [0, 0], end: [0, 0] },
                { name: 'details', start: [1, 0], end: [1, 0] },
              ]}
              columns={['113px', 'flex']}
              rows={['flex']}
              gap="small"
            >
              <Box gridArea='poster' direction="column">
                <Box width="xsmall">
                  <Image
                    fit="contain"
                    src={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/${id}.jpg`}
                    fallback={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/no_poster.png`}
                  />
                </Box>
                {watchProviderElements && watchProviderElements.length > 0 &&
                <>
                  <Text size="small" color="white" margin={{top: 'medium'}}><i>watch via</i></Text>
                  <Box width="95px" height="1px" background="white" />
                  <Box width="95px" margin={{right: '20px', top: '5px'}}>  
                    <Grid columns="18px" gap="xsmall">
                      {watchProviderElements.map((wp) => wp)}
                    </Grid> 
                    {(watchProviders.length > watchProviderElements.length && (displayPriority === defaultPriority) || (displayPriority === maxPriority)) &&
                    <Button id="expand-wp" plain alignSelf="center" size="small" icon={displayPriority === maxPriority ? <FormUp /> : <FormDown />} onClick={toggleWatchProviders}
                    style={{padding: '5px', border: '10px'}} />                  
                    }                                                    
                  </Box>
                </>
                }
                {type === 'movie' && cinemaDates && cinemaDates.length > 0 &&
                <>
                  <Text size="small" color="white" margin={{top: 'xxsmall'}}><i>in cinemas</i></Text>
                  <Box width="95px" height="1px" background="white" />                  
                  <Box direction="column" gap="xsmall" align="left" justify="start" margin={{top: '5px', right: '15px'}}>                   
                    {cinemaDates}
                  </Box>
                </>
                }
              </Box>
              <Box gridArea="details" direction="column" gap="medium" alignContent="top">
                <Text size="medium" color="text_dark_1">{overview}</Text>
                <Grid
                  fill="horizontal"
                  areas={[
                    { name: 'genres', start: [0, 0], end: [0, 0] },
                    { name: 'links', start: [1, 0], end: [1, 0] },
                  ]}
                  columns={['flex', '200px']}
                  rows={['flex']}
                  gap="small"
                >
                  <Box direction="row" gap="xsmall" height="35px">
                    {genreTags}
                  </Box>
                  {(videoElements.length > 0 || linkElements.length > 0) &&            
                  <Box direction="row" gap="small" align="center" justify="end"  height="35px">   
                    {videoElements}
                    {linkElements}                          
                  </Box>
                  }                    
                </Grid>
                {!editing && entry.comment &&
                <Text size="small" color="text_dark_1" style={{whiteSpace: 'pre-wrap'}}><i>{entry.comment}</i></Text>
                }
                {editing &&
                <Box direction="column" gap="small" alignContent="top">
                  <Box height="100px">
                    <TextArea fill id="comment" placeholder="comment..." value={comment} size="small" onChange={onCommentChange} style={{whiteSpace: 'pre-wrap'}} spellCheck={false}/>
                  </Box>
                  <Box direction="row" gap="small" justify="end">
                    <Button id="save" label="Save" onClick={() => {
                      if (id) {
                        updateComment(entry.id, comment);
                        setEditing(false)}}
                      }
                    />
                    <Button id="cancel" label="Cancel" onClick={ () => {setEditing(false)} } />
                  </Box>
                </Box>   
                }
                {type === 'tv' &&
                (
                <Box gap="small">
                  {(showAll || (episodes.length > 0 && episodes[0].episode_number > 1)) &&
                  <Button id="expand-ep-upper" plain={false} alignSelf="center" size="small" icon={showAll? <Down /> : <Up />} onMouseEnter={preloadEpisodes} onClick={toggleShowAll}
                  style={{padding: '5px', border: '10px'}} />
                  }
                  <Box align="center" gap="xsmall">
                    {eList}
                  </Box>  
                  <Box width="small" alignSelf="center">
                  {(showAll || (episodes.length > 1 && currentSeason && episodes[1].episode_number < currentSeason.episode_count)) &&
                  <Button id="expand-ep-lower" plain={false} alignSelf="center" size="small" icon={showAll? <Up /> : <Down />} onMouseEnter={preloadEpisodes} onClick={toggleShowAll}
                  style={{padding: '5px', border: '10px'}} />                  
                  }
                  </Box>              
                </Box>    
                )       
                }            
              </Box>
            </Grid>
          </CardBody>
          <CardFooter justify="end" background="background_foo" height="30px" pad={{left: '5px', right: '15px'}}>
            <Text color="white" textAlign="end" alignSelf="center" size="small">added: {format(entry.addedAt, 'dd/MM/yyyy')}</Text>
          </CardFooter>
        </Card>
      </>        
    )
  }
}

export default ListEntry;
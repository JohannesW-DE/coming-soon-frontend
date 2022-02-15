import { useQuery } from '@apollo/client';
import { fromUnixTime, getYear } from 'date-fns';
import { Box, TextInput, Notification, Spinner } from 'grommet';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { IEntry } from '../ListView';
import { GQL_QUERY_MULTI_SEARCH, GQL_QUERY_SUGGESTIONS } from './Search.gql';
import { IMultiSearch, IMultiSearchVars, ISuggestions, ISuggestionsVars } from './Search.interface';
import Suggestion, { ISuggestion } from './Suggestion';
import SuggestionX from './SuggestionX';

interface ISuggentionChild {
  label: ReactElement;
  value: string;
}

const SUGGESTIONS_MIN_QUERY_LENGTH = 3;

interface IProps {
  entries: IEntry[];
  onSuggestionClick: (type: string, id: string, season?: number) => void
}

// extract imdb link
export function extractIMDB(text: string) {
  const imdbRx = /(?<imdb_id>tt\d+)\/?/;

  const imdbResult = imdbRx.exec(text);
  if (imdbResult?.groups) {
    return imdbResult.groups.imdb_id;
  } 
  return null;
}

// extract tmdb link
export function extractTMDB(text: string) {
  const tmdbRx = /themoviedb\.org\/(?<type>tv|movie)\/(?<tmdb_id>\d+)+/;

  const tmdbResult = tmdbRx.exec(text);
  if (tmdbResult?.groups) {
    return {type: tmdbResult.groups.type, id: tmdbResult.groups.tmdb_id};
  } 
  return null; 
}

function Search({
    entries,
    onSuggestionClick,
  }: IProps) {

  const suggestionQuery = useQuery<ISuggestions, ISuggestionsVars>(GQL_QUERY_SUGGESTIONS);
  const multiSearchQuery = useQuery<IMultiSearch, IMultiSearchVars>(GQL_QUERY_MULTI_SEARCH, {
    notifyOnNetworkStatusChange: true,
  });
  /*
  const [addMovie, addMovieMutation] = useMutation<IAddMovieToList, IAddMovieToListVars>(GQL_MUTATION_ADD_MOVIE_TO_LIST); 
  const [addTvShow, addTvShowMutation] = useMutation<IAddTvShowToList, IAddTvShowToList>(GQL_MUTATION_ADD_TV_SHOW_TO_LIST);
  */
 
  const [suggestionChildren, setSuggestionChildren] = useState<ISuggentionChild[] | null>(null);
  const [query, setQuery] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');  
  const [notificationVisible, setNotificationVisible] = useState(false);

  const typingDelay = 300; // user is considered to have stopped typing after x milliseconds
  // special case: using backspace to modify the query, value needs to be >500(?) since otherwise the query runs before the second char was cleared
  const typingDelayWithBackspace = 555;
  const [typing, setTyping] = useState(false); // is the user considered to be typing
  const [lastCharPressed, setLastCharPressed] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);

  const [timer, setTimer] = useState<number>(0);

  const startTypingTimer = (delay: number = 0) => {
    const id = window.setTimeout(
      () => {
        setTyping(false); 
      }, delay);   
    setTimer(id);    
  }

  const onClick = (type: string, id: string, season?: number) => {
    onSuggestionClick(type, id, season);
  }
 

  const onLookingForClicked = () => {
    if (searchRef.current?.value) {
      multiSearchQuery.refetch({ query: searchRef.current.value }).then((result) => {
        if (result.data) {
          let message = `${result.data.multiSearch.name} (${result.data.multiSearch.year})`;
          if (result.data.multiSearch.count === 2) {
            message += ` & one other result`;
          } else if (result.data.multiSearch.count >= 2) {
            message += ` & ${result.data.multiSearch.count - 1} additional results`;
          }
          message += ' added!';
          setNotificationMessage(message);
          setTyping(true);          
          setTyping(false);
        }   
      })
    }
  }


  // watch for typing change and fetch suggestions
  useEffect(() => {
    if (typing) {
      setSuggestionChildren(null);
    }
    if (!typing) {
      if (query.length >= SUGGESTIONS_MIN_QUERY_LENGTH) {
        suggestionQuery.refetch({ query }).then((result) => {
          
          const children: ISuggentionChild[] = [];

          const suggestions: ISuggestion[] = [];

          result.data?.suggestions.movies?.forEach((movie) => {
            const suggestion = {
              id: movie._id,
              type: 'movie',
              title: movie.title,
              year: movie.year,
              tagline: movie.tagline,
              popularity: movie.popularity,
              entry: entries.find((e) => e.movie && e.movie._id === movie._id),
            }

            suggestions.push(suggestion);
          });
    
          result.data?.suggestions.tvShows?.forEach((tvShow) => {
            const suggestion = {
              id: tvShow._id,
              type: 'tv',
              title: tvShow.name,
              year: getYear(fromUnixTime(+tvShow.first_air_date / 1000)),
              tagline: tvShow.tagline,
              popularity: tvShow.popularity,               
              seasons: tvShow.seasons.map((e) => ({number: e.season_number, airDate: e.air_date})),
              entry: entries.find((e) => e.tvShow && e.tvShow._id === tvShow._id),
            }

            suggestions.push(suggestion);
          });

          suggestions.sort((a, b) => b.popularity - a.popularity).forEach((e) => {
            children.push({
              label: (
                <Suggestion
                  key = {e.id}
                  id = {e.id}
                  type = {e.type}
                  title = {e.title}
                  year = {e.year}
                  tagline = {e.tagline}
                  popularity = {e.popularity}
                  seasons= {e.seasons}
                  entry = {e.entry}              
                  onClick = {onClick}
                />
              ),
              value: e.id
            });
          });         

          if (children.length === 0) {
            let text = 'no match :('
            if (extractIMDB(query) || extractTMDB(query)) {
              text += '\nclick here to try adding the movie / tv show to the database'
            }
            children.push({
              label: (
                <SuggestionX
                  text={text}
                  onClick={onLookingForClicked}
                />
              ),
              value: 'search',          
            })
          }

          setSuggestionChildren(children);          
        });
      } else {
        setSuggestionChildren(null);
      }
    }
  }, [typing]);
  
  
  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    // typing stuff
    setTyping(true);
    clearTimeout(timer)
    if (lastCharPressed === 'Backspace') {
      startTypingTimer(typingDelayWithBackspace);
    } else {
      startTypingTimer(typingDelay);
    }
  }

  // show notification if there is a new message
  useEffect(() => {
    if (notificationMessage) {
      setNotificationVisible(true);
    }
  }, [notificationMessage]);

  const onNotificationClose = () => {
    setNotificationVisible(false)
  }

  const buildSpinner = (): ISuggentionChild[] => {
    if (query.length >= SUGGESTIONS_MIN_QUERY_LENGTH) {
      return [
        {
          label: (
            <Box height="70px" align="center" justify="center" background="background_dark_2">  
              <Spinner
                border={[
                  { side: 'all', color: 'white', size: 'small' },
                  { side: 'right', color: 'background_foo', size: 'small' },
                  { side: 'top', color: 'background_foo', size: 'small' },
                  { side: 'left', color: 'text_dark_1', size: 'small' },
                ]}
              />
            </Box>
          ),
          value: 'loading',
        }
      ]
    }
    return [];
  }
  
  // handle key presses of TextInput
  const onKeyDown = (event: React.KeyboardEvent) => setLastCharPressed(event.key);   
  const onKeyUp = (event: React.KeyboardEvent) => setLastCharPressed(event.key);

  return (
    <Box align="center" justify="start" pad={{top: 'large', bottom: 'large'}}>
      <Box width="700px">
        <TextInput id="search" placeholder="add movie or tv show ..." dropProps={{elevation: 'medium', background: 'white'}}
          ref={searchRef}
          value={query}
          onChange={onQueryChange}
          onSuggestionSelect={undefined}
          suggestions={(!suggestionChildren || multiSearchQuery.loading) ? buildSpinner() : suggestionChildren}
          onKeyDownCapture={onKeyDown}
          onKeyUpCapture={onKeyUp}
          spellCheck={false}
        />
      </Box>
      {notificationVisible && 
      <Notification toast status="normal" title="Search successful"
        message={notificationMessage} onClose={onNotificationClose}
      />
      }
    </Box>
  );
}

export default Search;
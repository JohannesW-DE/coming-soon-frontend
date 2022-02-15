/* eslint-disable no-else-return */
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { fromUnixTime, getMonth, getYear, isAfter, isBefore, format } from 'date-fns';
import { Anchor, Box, Button, CheckBox, Grommet, Layer, List, Select, Text, Tip } from 'grommet';
import { Edit, HelpOption } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../App';
import { theme } from '../theme';
import ListEdit from './edit/ListEdit';
import ListEntry from './ListEntry';
import { GQL_MUTATION_ADD_MOVIE_TO_LIST, GQL_MUTATION_ADD_TV_SHOW_TO_LIST, GQL_MUTATION_REMOVE_ENTRY_FROM_LIST, GQL_MUTATION_UPDATE_COMMENT, GQL_MUTATION_UPDATE_POSITIONS, GQL_QUERY_COMPARE_AGAINST_LIST, GQL_QUERY_LIST } from './ListView.gql';
import { ICompareListElement, IQueryList, IListEntryMovie, IListEntryTvShow, IQueryListVars, IMutationAddMovieToList, IMutationAddMovieToListVars, IMutationAddTvShowToList, IMutationAddTvShowToListVars, IMutationRemoveEntryFromList, IMutationRemoveEntryFromListVars, IMutationUpdateComment, IMutationUpdateCommentVars, IMutationUpdatePositions, IMutationUpdatePositionsVars, IQueryListAsComparison, IQueryListAsComparisonVars } from './ListView.interface';
import Search from './search/Search';
import Tag from './Tag';


const GQL_MUTATION_UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark($listId: ID!, $bookmarked: Boolean) {
    updateBookmark(listId: $listId, bookmarked: $bookmarked)
  }
`;

const listViewTheme = deepMerge(theme, {
  global: {
    colors: {
      focus: 'transparent',
    },
  },     
  button: {
    extend: () => `
      background: #242c34;
      color: #9ab;
      border-width: 1px;      
      &:hover {
        background: #242c34;
        color: white;
        border-width: 1px;
      } 
      &:focus {
        background: #242c34;
        color: white;
        border-width: 1px;
      }        
    `,
  },
});

export interface IEntry {
  id: string;
  showYear: boolean;
  showMonth: boolean;
  movie?: IListEntryMovie,
  tvShow?: IListEntryTvShow,
  season?: number,
  comment?: string,
  position?: number,
  addedAt: Date,
  date: Date | null,
}

enum SortOrder {
  ReleaseDate,
  Position,
  Added,
}

export enum UserState {
  NOTHING,
  AUTHENTICATED,
  AUTHORIZED,
}

function sortEntries(entries: IEntry[], by: SortOrder): IEntry[] {
  const years: number[] = [];
  const months: string[] = [];

  switch(by) {
    case SortOrder.ReleaseDate:
      return entries.sort((a, b) => {
        if (a.date === b.date) {
          return 0;
        } else if (a.date === null) {
          return 1;
        } else if (b.date === null) {
          return -1;
        } else {
          return isBefore(b.date, a.date) ? 1 : -1;
        }        
      }).map((e) => {
        let showYear = false;
        let showMonth = false;

        if (e.date) {
          if (!years.includes(getYear(e.date))) {
            years.push(getYear(e.date));
            showYear = true;
          }
          if (!months.includes(`${getYear(e.date)}${getMonth(e.date)}`)) {
            months.push(`${getYear(e.date)}${getMonth(e.date)}`)
            showMonth = true;
          }
        } else if (!years.includes(-1)) {
          years.push(-1);
          showYear = true;
        }

        return {...e, showYear, showMonth}; 
      });
    case SortOrder.Position:
      return entries.sort((a: IEntry, b: IEntry) => { 
        if (!a.position && !b.position) {
          return 0;
        } else if (a.position && !b.position) {
          return -1;
        } else if (!a.position && b.position) {
          return 1;
        } else if (a.position && b.position) {
            return a.position - b.position;
          } else {
            return 0;
          }
      })   
    case SortOrder.Added:      
      return entries.sort((a, b) => (isAfter(b.addedAt, a.addedAt) ? 1 : -1)).map((e) => ({...e, showYear: false, showMonth: false}));
    default:
      break;
  }

  return []; // unreachable
}


const SelectTextInput = styled(Select)`
  background: #242c34;
  color: #99aabb;
  &:focus {
    background: #242c34;
    color: #99aabb;
  }
  &:hover {
    background: #242c34;
    color: #99aabb;
  }
`;


function ListViewSortable() {
  const params = useParams();
  const listId = params.id ? params.id : '';

  // determine UserState
  const [userState, setUserState] = useState<UserState>(UserState.NOTHING);

  const auth = useAuth();

  const getListQuery = useQuery<IQueryList, IQueryListVars>(GQL_QUERY_LIST, { variables: { id: listId } });
  
  const [removeEntryFromList] = useMutation<IMutationRemoveEntryFromList, IMutationRemoveEntryFromListVars>(GQL_MUTATION_REMOVE_ENTRY_FROM_LIST);
  const [updatePositions] = useMutation<IMutationUpdatePositions, IMutationUpdatePositionsVars>(GQL_MUTATION_UPDATE_POSITIONS);
  const [updateComment] = useMutation<IMutationUpdateComment, IMutationUpdateCommentVars>(GQL_MUTATION_UPDATE_COMMENT);

  const [addTvShowToList] = useMutation<IMutationAddTvShowToList, IMutationAddTvShowToListVars>(GQL_MUTATION_ADD_TV_SHOW_TO_LIST);
  const [addMovieToList] = useMutation<IMutationAddMovieToList, IMutationAddMovieToListVars>(GQL_MUTATION_ADD_MOVIE_TO_LIST);

  const [queryCompareAgainstEntries] = useLazyQuery<IQueryListAsComparison, IQueryListAsComparisonVars>(GQL_QUERY_COMPARE_AGAINST_LIST);
  const [updateBookmark] = useMutation(GQL_MUTATION_UPDATE_BOOKMARK);

  const [compareAgainst, setCompareAgainst] = useState<string>('');
  const [compareListElements, setCompareListElements] = useState<ICompareListElement[]>([]);

  const [compact, setCompact] = useState(false);
  const [sorting, setSorting] = useState(false);

  const [onOrdered, setOnOrdered] = useState<React.Dispatch<React.SetStateAction<IEntry[]>> | undefined>(undefined); 
  const [ordered, setOrder] = useState<IEntry[]>([]);

  const [sort, setSort] = useState('0');

  const compareAgainstOptions = auth?.user?.lists.filter(e => e._id !== listId).map(e => ({label: e.name, value: e._id}));

  // clean-up on param change
  useEffect(() => {
    setCompareAgainst('');
    setCompareListElements([]);
  }, [params]);

  useEffect(() => {
    if (auth?.user && getListQuery.data?.list) {
      if (getListQuery.data?.list.owner._id === auth?.user?._id) {
        setUserState(UserState.AUTHORIZED);
      } else {
        setUserState(UserState.AUTHENTICATED);
      }
    }
  }, [auth, getListQuery.data])

  // warum nicht fkt nachm call? 
  useEffect(() => {
    if (getListQuery.data && getListQuery.data.list) {
      const result: IEntry[] = [];

      // TODO: REMOVE SHOW YEAR
      getListQuery.data.list.entries?.forEach((e) => {

        let date: Date | null = null;

        if (e.movie) {
          date = fromUnixTime(+e.movie.release_date / 1000)
        } else if (e.tv_show) {
          const seasonAirDate = e.tv_show.seasons.find((s) => s.season_number === e.season)?.air_date;
          if (seasonAirDate) {
            date = fromUnixTime(+seasonAirDate / 1000)
          }
        }

        result.push({
          id: e._id,
          showYear: false,
          showMonth: false,
          movie: e.movie,
          tvShow: e.tv_show,
          comment: e.comment,
          position: e.position,
          addedAt: new Date(+e.added_at),
          date,
          season: e.season,
        })
      });

      setOrder(sortEntries(result, +sort));
    }
  }, [getListQuery.data]);

  const onSortingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked} = event.target
    setOnOrdered(checked ? () => setOrder : undefined)
    if (checked) {
      setSorting(true);
      setSort('1');      
      setOrder(sortEntries(ordered, SortOrder.Position));
    } else {
      setSorting(false);
      setSort('0');
      setOrder(sortEntries(ordered, SortOrder.ReleaseDate));
    }    
  }

  const onCompactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked} = event.target
    setCompact(checked);
  }

  const save = () => {
    updatePositions({ variables: { listId, ids: ordered.map((e) => e.id) } }).then(() => {
      getListQuery.refetch();
    });
  }


  const onUpdateComment = (entryId: string, comment: string) => {
    updateComment({ variables: { listId, entryId, comment }}).then(() => {
      getListQuery.refetch();
    })
  }

  const onCompareAgainstChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCompareAgainst(event.target.value);

    queryCompareAgainstEntries({ variables: { id: event.target.value } }).then((result) => {
      if (!result.error && result.data) {
        const elements: ICompareListElement[] = [];

        result.data.listAsComparison.entries.forEach((e) => {
          if (e.movie) {
            elements.push({id: e.movie._id});
          }
          if (e.tv_show && e.season) {
            elements.push({id: e.tv_show._id, season: e.season});
          }
        });

        setCompareListElements(elements);
      }
    });
  }
  
  const onSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value)
    // sortEntries(ordered, +event.target.value);
    setOrder(sortEntries(ordered, +event.target.value));
  }

  // looped through from Suggestion via Search
  const onSuggestionClick = (type: string, id: string, season?: number) => {
    if (type === 'movie') {
      addMovieToList({ variables: { listId, movieId: id } }).then(() => {
        getListQuery.refetch();
      })
    } else if (type === 'tv') {
      addTvShowToList({ variables: { listId, tvShowId: id, seasonNumber: season } }).then(() => {
        getListQuery.refetch();
      })
    }
  }

  // add to another list after click on the add button of a ListEntry
  const onListEntryAddClick = (entry: IEntry) => {
    if (entry.movie) {
      addMovieToList({ variables: { listId: compareAgainst, movieId: entry.movie._id } }).then((result) => {
        if (result.data && !result.errors) {
          if (result.data.addMovieToList) {
            if (entry.movie) {
              setCompareListElements([...compareListElements, {id: entry.movie._id}]);
            }
          }
        }
      });
    } else if (entry.tvShow) {
      addTvShowToList({ variables: { listId: compareAgainst, tvShowId: entry.tvShow._id, seasonNumber: entry.season } }).then((result) => {
        if (result.data && !result.errors) {
          if (result.data.addTvShowToList) {
            if (entry.tvShow) {
              setCompareListElements([...compareListElements, {id: entry.tvShow._id, season: entry.season}]);
            }
          }
        }
      });
    }
  }

  const remove = (entry: IEntry) => {
    removeEntryFromList({ variables: { listId, entryId: entry.id } }).then(() => {
      getListQuery.refetch();
    });
  }

  const sortOptions = ['release date', 'ranking', 'added'].map((e, i) => ({value: i.toString(), label: e}));

  const isOwner = getListQuery.data?.list?.owner._id === auth?.user?._id;

  const isBookmarked = auth?.user?.bookmarks.map(e => e.list._id).includes(listId);

  const onBookmarkClick = () => {
    updateBookmark({ variables: { listId, bookmarked: !isBookmarked }}).then((result) => {
      if (result.data.updateBookmark) {
        auth?.refresh(() => {});
      }
    })
  }

  const onDragStart = (event: React.DragEvent) => event.dataTransfer.setData("id", listId);

  // figure other if the entry can be added to the currently selected compareAgainst list
  const isAddable = (entry: IEntry) => {
    if (compareAgainst === '') {
      return false;
    }

    return !compareListElements.some((e) => {
      if (entry.movie && entry.movie._id === e.id) {
        return true;
      } else if (entry.tvShow && entry.tvShow._id === e.id && entry.season === e.season) {
        return true;
      }
      return false;
    })
  }

  const [showEditLayer, setShowEditLayer] = useState(false);

  const onEditLayerClose = (updated: boolean) => {
    if (updated) {
      getListQuery.refetch();
    }
      setShowEditLayer(false);
  }

  if (getListQuery.data === undefined || getListQuery.data.list === null) {
    return (
      <Grommet theme={listViewTheme} full>
      {!getListQuery.loading &&
        <Box justify='center' align="center" fill="horizontal" margin={{'top': '200px'}}>
          <Text size="large" color="text_dark_1">This list does not exist (anymore) or is set to private!</Text>
        </Box>
      }
      </Grommet>
    )
  } else {
    return (
      <Grommet theme={listViewTheme} full="min">
        {showEditLayer && (
        <Layer animation="fadeIn" modal onEsc={() => {onEditLayerClose(false)}} position='top' margin={{top: '200px'}}>
          <ListEdit
            id={listId}
            name={getListQuery.data.list.name}
            description={getListQuery.data.list.description}
            url={getListQuery.data.list.url}
            isPublic={getListQuery.data.list.is_public}
            onClose={(updated) => onEditLayerClose(updated)}/>
        </Layer>
        )}      
        <Box direction="column">
          <Box direction="column" align="center" pad={{'top': 'xlarge', 'bottom': 'large'}} gap="medium">
            <Tag value={getListQuery.data?.list.is_public ? 'public' : 'private'} />            
            <Text size="xxlarge" color="text" onDragStart={onDragStart} draggable>{getListQuery.data?.list.name}</Text>
            {getListQuery.data?.list.description && 
            <Text size="medium" color="text" style={{whiteSpace: 'pre-wrap'}}><i>{getListQuery.data.list.description}</i></Text>
            }
            {getListQuery.data?.list.url && 
            <Text size="small" color="text" style={{whiteSpace: 'pre-wrap'}}><i>{getListQuery.data.list.url}</i></Text>
            }    
            {isOwner &&
            <Edit color="text" onClick={() => {setShowEditLayer(true)}}/>
            }
            {!isOwner && auth?.user &&
            <Button size="small" label={isBookmarked ? 'un-bookmark' : 'bookmark'} onClick={() => {onBookmarkClick()}}/>
            }
          </Box>            
          {userState === UserState.AUTHORIZED &&
            <Box direction='row' align='center' justify='center' gap="xsmall">
              <Search entries={ordered} onSuggestionClick={onSuggestionClick} />
              <Tip content={(
                  <Box width="medium">
                    <Text size="xsmall">It is possible to use IMDB or TMDB links as input. This even allows for trying to add tv shows or movies that are missing so far!</Text>
                  </Box>
              )}>
                <HelpOption color="text_dark_1"/>
              </Tip>
            </Box>
          }
          <Box justify="center" direction="row" gap="medium" margin={{top: 'large'}}>
            <CheckBox toggle checked={compact} onChange={onCompactChange} label={
              <Box justify="center"><Text color="text_dark_1" size="small">compact view</Text></Box>
            } />
            {userState === UserState.AUTHORIZED &&
            <CheckBox toggle checked={sorting} onChange={onSortingChange} 
              label={<Box justify="center"><Text color="text_dark_1" size="small">ranking view</Text></Box>}
            />   
            }
            {!sorting &&
            <SelectTextInput
              data-select="sort"
              plain={false}            
              id="sort"
              name="sort"
              labelKey="label"
              valueKey={{ key: 'value', reduce: true }}
              value={sort}
              focusIndicator={false}              
              options={sortOptions}
              onChange={(event) => onSortChange(event)}
            />
            }
            {!sorting && userState >= UserState.AUTHENTICATED && compareAgainstOptions &&
            <SelectTextInput
              plain={false}
              id="compareAgainst"
              name="compareAgainst"
              placeholder="compare with own list"
              labelKey="label"
              valueKey={{ key: 'value', reduce: true }}
              value={compareAgainst}
              options={compareAgainstOptions}
              focusIndicator={false}
              clear={{
                'position': "top",
                'label': "clear..."
              }}
              onChange={(event) => onCompareAgainstChange(event)}
            />
            }
            {sorting &&
            <Button alignSelf='center' label="Save ranking" onClick={save} size="small"/>
            }
          </Box>
          <Box align="center" pad="large" focusIndicator>
            <List data={ordered} onOrder={onOrdered} border={false}>
              {(e: IEntry) => {
                const id = e.movie ? e.movie?._id : `${e.tvShow?._id}-${e.season}`; // '-season' to be unique!
                return (
                  <ListEntry 
                    key={id}
                    userState={userState}
                    showYear={e.showYear}
                    showMonth={e.showMonth}                    
                    entry={e}               
                    compact={(compact || (compareAgainst !== '' && !isAddable(e)) || sorting)}
                    showAdd={isAddable(e)}
                    add={onListEntryAddClick}
                    remove={remove}
                    updateComment={onUpdateComment}                                  
                  />
                )
              }
              }
            </List>
            <Text color="white" size="small" margin={{top: '50px'}}><i>last update: {format(fromUnixTime(+getListQuery.data.list.updated_at / 1000), 'dd/MM/yyyy')}</i></Text>
          </Box>
      
        </Box>
        <Box align="center">
          <Text color="white" size="small" margin={{top: '50px', bottom: '50px'}}>all movie & tv related data provided by <Anchor color="white" href="https://www.themoviedb.org/">TMDB</Anchor> & <Anchor color="white" href="https://www.justwatch.com/">JustWatch</Anchor></Text> 
        </Box>
      </Grommet>
    )
  }
}

export default ListViewSortable
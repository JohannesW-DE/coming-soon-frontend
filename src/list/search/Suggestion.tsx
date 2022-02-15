/* eslint-disable react/require-default-props */
import { format } from "date-fns";
import fromUnixTime from "date-fns/fromUnixTime";
import { Box, Image, Text, Tip } from "grommet";
import { Checkmark } from "grommet-icons";
import React, { useState } from "react";
import { IEntry } from "../ListView";

interface ISuggesionSeason {
  number: number;
  airDate: string;
}

export interface ISuggestion {
  id: string;
  type: string;
  title: string;
  year: number;
  entry: IEntry | undefined;
  seasons?: ISuggesionSeason[];
  tagline: string;
  popularity: number;
}

interface ISeasonTagProps {
  season: number,
  airDate: string,
  checked: boolean,
  onClick: (event: React.MouseEvent<HTMLElement>, season: number) => void,
}

function SeasonTag({
  season,
  airDate,
  checked,
  onClick,
}: ISeasonTagProps) {
  const date = airDate !== '' ? airDate : 'n/a' 

  return (
    <Tip
      dropProps={{ align: { top: 'bottom'}}}
      content={
        <Text size="xsmall">air date: {date}</Text>
      }
    >
      <Box gap="xsmall" direction="row" background="background_dark_1" justify="center" alignSelf="center" height="25px" round="xsmall" pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}>
        <Box>
          <Text color="white" size="xsmall" onClick={(event) => { onClick(event, season) }}>
            Season {season}
          </Text>
        </Box>
        {checked &&
        <Box align="center" justify="center" pad={{bottom: '2px'}}>
          <Checkmark size="small"/>
        </Box>
        }
      </Box>
    </Tip>
  )
}

interface ISuggestionProps {
  id: string,
  type: string,
  title: string,
  year: number,
  tagline: string,
  entry: IEntry | undefined,
  seasons?: ISuggesionSeason[],
  popularity: number,
  onClick: (type: string, id: string, season?: number) => void
}


function Suggestion({
  id,
  type,
  title,
  year,
  tagline,
  entry,
  seasons,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  popularity,
  onClick
}: ISuggestionProps) {

  const onSomewhereClick = () => {
    onClick(type, id);
  }

  const onSeasonClick = (event: React.MouseEvent<HTMLElement>, season: number) => {
    event.stopPropagation(); 
    event.nativeEvent.stopImmediatePropagation(); 
    onClick(type, id, season);
  }

  const elements = seasons?.filter(e => e.number > 0).map((e: any) => {
    const airDate = e.airDate ? format(fromUnixTime(+e.airDate / 1000),'dd/MM/yyyy') : '';
    const checked = entry && entry.season === e.number;
    return (
      <SeasonTag
        data-suggestion-id={`${e.id}-${e.number}`}
        key={e.number}
        season={e.number}
        airDate={airDate}
        checked={checked || false}
        onClick={onSeasonClick}
      />
    )
  })

  const textColor = 'text_dark_1'
  const backgroundColor = 'background_dark_2';
  const hoveredTextColor = 'white';

  const [hovered, setHovered] = useState(false);

  const showCheckmark = type === 'movie' && entry !== undefined

  return (
    <Box data-suggestion-id={id}
      direction="row" gap="small" pad="small" height="100px" 
      background={!hovered ? backgroundColor: 'background_foo'}
      onClick={onSomewhereClick}
      onMouseEnter={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}      
    >
      <Box width="60px">
        <Image fit="contain" 
          src={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/${id}.jpg`}
          fallback={`${process.env.REACT_APP_BACKEND_BASE_URL}/poster/no_poster.png}`}
        />
      </Box>
      <Box fill>
        <Text color={!hovered ? textColor: hoveredTextColor}>
          <strong>{title}</strong>&nbsp;({year})
        </Text>
        <Text size="small" color={textColor}>
          <i>{tagline}</i>
        </Text>
        <Box direction="row" gap="xsmall" pad={{'top': '19px', 'bottom': 'small'}} >
          {elements}
        </Box>
      </Box>  
      <Box width="60px" align="center" justify="center">
        {showCheckmark &&
        <Checkmark />
        }
      </Box>           
    </Box>
  )
}

export default Suggestion;
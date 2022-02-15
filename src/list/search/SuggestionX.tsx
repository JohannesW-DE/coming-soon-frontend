import { Box, Text } from 'grommet';
import React, { useState } from 'react';

interface IProps {
  text: string;
  onClick: () => void;
}

function SuggestionX({text, onClick}: IProps) {
  const [hovered, setHovered] = useState(false);
  
  const textColor = 'text_dark_1'
  const backgroundColor = 'background_dark_2';
  const hoveredTextColor = 'white';

  const onHandleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick();
  }

  return (
    <Box height="40px" align="center" justify="center"
      background={!hovered ? backgroundColor: 'background_foo'}
      onMouseEnter={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}  
     >  
      <Text id="multisearch" color={!hovered ? textColor: hoveredTextColor} alignSelf="center" size="small" onClick={onHandleClick}><i>{text}</i></Text>
    </Box>
  )
}

export default SuggestionX;
import { format } from 'date-fns';
import React from 'react';
import { Card, CardBody, CardHeader, Text } from 'grommet';
import { IComingSoonMatch } from './ComingSoon.interface';
import Entry from './Entry';

interface IProps {
  date: Date;
  isToday: boolean;
  isPlaceholder: boolean;
  entries: IComingSoonMatch[];
}

function Day({ date, isToday, isPlaceholder, entries }: IProps) {
  const elements = entries.map((e, index) => {
    let key = '';
    if (e.episode) {
      key = e.episode.id.toString();
    } else if (e.movie) {
      key = e.movie._id;
    }
    return (
      <Entry
        key={key}
        entry={e}
        isFirst={index === 0}
        isLast={index === entries.length - 1}
      />
    );
  });

  const opacity = isPlaceholder ? 0.8 : 1;

  return (
    <Card
      data-day-id={format(date, 'yyyyMMdd')}
      pad="small"
      fill="vertical"
      style={{ opacity }}
      border
      background="background_dark_2"
    >
      <CardHeader
        background={isToday ? 'background_light_1' : 'background_foo'}
        round="xsmall"
        justify="center"
      >
        <Text weight={isToday ? 'normal' : 'normal'} color="white">
          {format(date, 'eeee, do')}
        </Text>
      </CardHeader>
      <CardBody margin={{ top: 'small' }}>{elements}</CardBody>
    </Card>
  );
}

export default Day;

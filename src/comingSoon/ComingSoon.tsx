/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import {
  useLazyQuery,
} from '@apollo/client';
import {
  Box, Grid, RangeInput, Text,
} from 'grommet';
import { Next, Previous } from 'grommet-icons';
import React, {
  useEffect, useState,
} from 'react';
import {
  startOfMonth, startOfISOWeek, endOfMonth, endOfISOWeek, addDays, eachDayOfInterval,
  isSameDay, fromUnixTime, getUnixTime, isSameMonth, format, addMonths, subMonths,
} from 'date-fns';
import Day from './Day';

import { IComingSoon, IComingSoonVars } from './ComingSoon.interface';
import { GQL_QUERY_COMING_SOON } from './ComingSoon.gql';

const getNumberFromLocalStorage = (key: string, def: number): number => {
  const item = localStorage.getItem(key);
  if (!item) {
    return def;
  }
  return +item;
};

enum Side {
  FROM,
  TO,
}

function ComingSoon() {
  const MAX_DAYS_BEFORE = 7;
  const MAX_DAYS_AFTER = 14;
  const DEFAULT_DAYS_BEFORE = 1;
  const DEFAULT_DAYS_AFTER = 5;

  const [range, setRange] = useState<{ from: number, to: number }>({
    from: getNumberFromLocalStorage('calendar.from', -DEFAULT_DAYS_BEFORE),
    to: getNumberFromLocalStorage('calendar.to', DEFAULT_DAYS_AFTER),
  });

  const [calendarMonth, setCalendarMonth] = useState<Date | null>(null);
  const [days, setDays] = useState<JSX.Element[]>([]);
  const [queryComingSoon, comingSoonQuery] = useLazyQuery<IComingSoon, IComingSoonVars>(GQL_QUERY_COMING_SOON);

  const [prefetched, setPrefetched] = useState(false);

  useEffect(() => {
    let from: Date;
    let to: Date;
    if (!calendarMonth) {
      from = addDays(new Date(), range.from - 1); // why -1?
      to = addDays(new Date(), range.to);
    } else {
      from = startOfISOWeek(startOfMonth(calendarMonth));
      to = endOfISOWeek(endOfMonth(calendarMonth));
    }
    queryComingSoon({
      variables: {
        from: getUnixTime(from).toString(),
        to: getUnixTime(to).toString(),
      },
    });
  }, [calendarMonth]);

  useEffect(() => {
    if (!comingSoonQuery.data) {
      return;
    }

    const elements: JSX.Element[] = [];
    const today = new Date();

    let dates: Date[] = [];

    if (!calendarMonth) {
      dates = eachDayOfInterval(
        { start: addDays(today, range.from), end: addDays(today, range.to) },
      );
    } else {
      dates = eachDayOfInterval(
        { start: startOfISOWeek(startOfMonth(calendarMonth)), end: endOfISOWeek(endOfMonth(calendarMonth)) },
      );
    }

    for (const date of dates) {
      const entries = comingSoonQuery.data.comingSoon.matches.filter((e) => {
        if (e.episode && e.tv_show) {
          if (isSameDay(fromUnixTime(+e.episode.air_date / 1000), date)) {
            return true;
          }
        }
        if (e.movie) {
          if (isSameDay(fromUnixTime(+e.movie.release_date / 1000), date)) {
            return true;
          }
        }
        return false;
      });

      elements.push(
        (
          <Day
            key={getUnixTime(date)}
            date={date}
            isPlaceholder={calendarMonth !== null && !isSameMonth(date, calendarMonth)}
            isToday={isSameDay(date, today)}
            entries={entries}
          />
        ),
      );

      setDays(elements);
    }
  }, [comingSoonQuery.data, range]);

  const onRangeChange = (side: Side, newValue: number) => {
    if (side === Side.FROM) {
      setRange({ from: newValue, to: range.to });
      localStorage.setItem('calendar.from', newValue.toString());
    } else if (side === Side.TO) {
      setRange({ from: range.from, to: newValue });
      localStorage.setItem('calendar.to', newValue.toString());
    }
  };

  const preFetch = async () => {
    if (!prefetched) {
      const today = new Date();
      await queryComingSoon({
        variables: {
          from: getUnixTime(addDays(today, -MAX_DAYS_BEFORE - 1)).toString(),
          to: getUnixTime(addDays(today, MAX_DAYS_AFTER)).toString(),
        },
      });
      // just assume prefetch worked?
      setPrefetched(true);
    }
  };

  return (
    <Box direction="column" margin={{ top: 'large' }} gap="medium">
      <Box direction="row" gap="large" justify="center" animation="fadeIn" margin={{ bottom: 'large' }}>
        <Text
          alignSelf="center"
          size="medium"
          color="text_dark_1"
          weight={!calendarMonth ? 'bold' : 'normal'}
          onClick={() => { setCalendarMonth(null); }}
        >
          Coming Soonish ™
        </Text>
        <Text
          alignSelf="center"
          size="medium"
          color="text_dark_1"
          weight={calendarMonth ? 'bold' : 'normal'}
          onClick={() => { setCalendarMonth(new Date()); }}
        >
          Calendar
        </Text>
      </Box>
      {calendarMonth
      && (
      <Box direction="column" gap="medium" animation="fadeIn">
        <Box direction="row" alignSelf="center" gap="medium" pad="medium" round="medium">
          <Box align="center" justify="center">
            <Previous
              id="previous"
              color="white"
              size="large"
              onClick={() => { setCalendarMonth(subMonths(calendarMonth, 1)); }}
            />
          </Box>
          <Box direction="column" align="center" width="small" gap="xsmall">
            <Text
              color="white"
              onClick={() => { setCalendarMonth(new Date()); }}
            >
              {format(calendarMonth, 'MMMM')}
            </Text>
            <Text size="small" color="white">
              {format(calendarMonth, 'yyyy')}
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Next
              id="next"
              color="white"
              size="large"
              onClick={() => { setCalendarMonth(addMonths(calendarMonth, 1)); }}
            />
          </Box>
        </Box>

      </Box>
      )}
      {!calendarMonth
      && (
      <Box direction="row" alignSelf="center" gap="large" animation="fadeIn">
        <Box width="small" alignSelf="center" gap="small">
          <Text alignSelf="center" color="text" size="small">show</Text>
          <Text alignSelf="center" color="text">{range.from === -1 ? 'yesterday' : `last ${Math.abs(range.from)} days`}</Text>
          <RangeInput
            id="from"
            min={-MAX_DAYS_BEFORE}
            max={-1}
            value={range.from}
            onChange={(event) => onRangeChange(Side.FROM, +event.target.value)}
            onMouseEnter={preFetch}
          />
        </Box>
        <Box width="small" alignSelf="center" gap="small">
          <Text alignSelf="center" color="text" size="small">and</Text>
          <Text alignSelf="center" color="text">{range.to === 1 ? 'tomorrow' : `next ${range.to} days`}</Text>
          <RangeInput
            id="to"
            min={1}
            max={MAX_DAYS_AFTER}
            value={range.to}
            onChange={(event) => onRangeChange(Side.TO, +event.target.value)}
            onMouseEnter={preFetch}
          />
        </Box>
      </Box>
      )}
      <Box pad="large">
        <Grid columns="220px" gap="small">
          {days.map((day) => day)}
        </Grid>
      </Box>
    </Box>
  );
}

export default ComingSoon;

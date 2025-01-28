import { add, format, startOfDay, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { match } from 'ts-pattern';
import { IconChevronDown, IconChevronUp, IconFocus } from '@/assets/icons';
import { useNow } from '@/hooks/useNow';
import { locale } from '@/i18n';
import * as styles from './Calendar.css';
import { useCalendarInput } from './hooks/useCalendarInput';

type CalendarDateProps = { calendarDate: Date; calendarMonth: number; today: Date };
const CalendarDate = ({ calendarDate, calendarMonth, today }: CalendarDateProps) => {
  const kind = useMemo(() => {
    if (calendarMonth !== calendarDate.getMonth() + 1) {
      return 'inactive' as const;
    }

    if (calendarDate.getTime() === today.getTime()) {
      return 'today' as const;
    }

    if (calendarDate.getDay() % 6 === 0) {
      return 'holiday' as const;
    }

    return 'active' as const;
  }, [calendarDate, calendarMonth, today]);

  return <span css={styles.calendarDateStyle(kind)}>{calendarDate.getDate()}</span>;
};

type CalendarMonthProps = {
  calendarYear: number;
  calendarMonth: number;
  today: Date;
};

const CalendarMonth = ({ calendarYear, calendarMonth, today }: CalendarMonthProps) => {
  const startOfCalendar = useMemo(
    () => startOfWeek(new Date(calendarYear, calendarMonth - 1, 1), { locale: locale().date }),
    [calendarYear, calendarMonth]
  );
  const startDay = startOfCalendar.getDay();

  return (
    <div css={styles.calendarMonthStyle}>
      <div css={styles.calendarHeaderStyle}>
        {Array.from({ length: 7 }).map((_, i) => (
          <span css={styles.calendarHeaderDayStyle} key={i}>
            {'SMTWTFS'[(startDay + i) % 7]}
          </span>
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, weekIndex) => (
        <div css={styles.calendarWeekStyle} key={weekIndex}>
          {Array.from({ length: 7 }).map((_, dateIndex) => (
            <CalendarDate
              key={dateIndex}
              today={today}
              calendarDate={add(startOfCalendar, { days: weekIndex * 7 + dateIndex })}
              calendarMonth={calendarMonth}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const Calendar = () => {
  const now = useNow(60_000);
  const today = useMemo(() => startOfDay(now), [now]);

  const {
    inputDisplay,
    inputValue,
    onMouseDown,
    onFocus,
    onKeyDown,
    onBlur,
    onReset,
    year,
    setYear,
    month,
    setMonth,
  } = useCalendarInput(now);

  const onClickPrevMonth = () =>
    match(month)
      .with(1, () => (setYear(year - 1), setMonth(12)))
      .otherwise(() => setMonth(month - 1));

  const onClickNextMonth = () =>
    match(month)
      .with(12, () => (setYear(year + 1), setMonth(1)))
      .otherwise(() => setMonth(month + 1));

  return (
    <div css={styles.containerStyle}>
      <header css={styles.headerStyle}>
        <h1 css={styles.titleStyle}>{format(now, 'HH:mm:ss')}</h1>
        <div css={styles.descriptionStyle}>
          <span>{format(now, 'PPP', { locale: locale().date })}</span>
          <span css={styles.descriptionDividerStyle} />
          <span>{format(now, 'ccc', { locale: locale().date })}</span>
        </div>
      </header>
      <section css={styles.calendarStyle}>
        <div css={styles.calendarControlStyle}>
          <label css={styles.calendarSelectStyle}>
            {inputDisplay}
            <input
              css={styles.calendarSelectInputStyle}
              onMouseDown={onMouseDown}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              onContextMenu={onReset}
              value={inputValue}
            />
          </label>
          <div css={styles.calendarButtonsStyle}>
            <button css={styles.calendarButtonStyle} onClick={onReset}>
              <IconFocus />
            </button>
            <button css={styles.calendarButtonStyle} onClick={onClickPrevMonth}>
              <IconChevronUp />
            </button>
            <button css={styles.calendarButtonStyle} onClick={onClickNextMonth}>
              <IconChevronDown />
            </button>
          </div>
        </div>
        <CalendarMonth calendarYear={year} calendarMonth={month} today={today} />
      </section>
    </div>
  );
};

import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { match, P } from 'ts-pattern';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import type { KeyboardEvent, MouseEvent } from 'react';

const asCalendarKey = (year: number, month: number) =>
  `${year.toString().padStart(4, '0')}${month.toString().padStart(2, '0')}`;

const parseCalendarKey = (calendarKey: string) =>
  match(calendarKey.length)
    .with(P.union(1, 2, 3, 4), () => ({ year: parseInt(calendarKey, 10), month: null }))
    .with(P.union(5, 6), () => ({
      year: parseInt(calendarKey.slice(0, 4), 10),
      month: parseInt(calendarKey.slice(4), 10),
    }))
    .otherwise(() => ({ year: null, month: null }));

const isValid = (parsed: {
  year: number | null;
  month: number | null;
}): parsed is { year: number; month: number } => {
  const { year, month } = parsed;
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    year! >= 1970 &&
    year! < 2100 &&
    month! >= 1 &&
    month! <= 12
  );
};

export const useCalendarInput = (now: number) => {
  const [year, setYear] = useState(() => new Date(now).getFullYear());
  const [month, setMonth] = useState(() => new Date(now).getMonth() + 1);

  const calendarKey = useMemo(() => asCalendarKey(year, month), [year, month]);
  const defaultCalendarKey = useMemo(() => format(now, 'yyyyMM'), [now]);
  const [calendarKeyDraft, setCalendarKeyDraft] = useState(defaultCalendarKey);

  useEffect(() => {
    setCalendarKeyDraft(calendarKey);
  }, [calendarKey]);

  useEffect(() => {
    if (!calendarKey || calendarKey === calendarKeyDraft) {
      return;
    }

    const parsed = parseCalendarKey(calendarKeyDraft);
    if (isValid(parsed)) {
      const timeoutId = setTimeout(() => {
        setYear(parsed.year);
        setMonth(parsed.month);
      }, 400);
      return () => clearTimeout(timeoutId);
    }
  }, [calendarKey, calendarKeyDraft]);

  const { t } = useTranslation();
  const inputDisplay = useMemo(() => {
    const draft = parseCalendarKey(calendarKeyDraft);
    return t('calendar.input', {
      year: (draft.year ?? 0).toString().padStart(4, '0'),
      month: (draft.month ?? 0).toString().padStart(2, '0'),
    });
  }, [calendarKeyDraft]);

  const onMouseDown = useLatestCallback((e: MouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.matches(':focus-within')) {
      e.currentTarget.blur();
      e.preventDefault();
      return;
    }
  });

  const onFocus = useLatestCallback(() => {
    setCalendarKeyDraft('');
  });

  const onKeyDown = useLatestCallback((e: KeyboardEvent<HTMLInputElement>) => {
    match(e.key)
      .with(P.union('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), () => {
        setCalendarKeyDraft(prevDraft => prevDraft + e.key);
        e.preventDefault();
      })
      .with('Backspace', () => {
        setCalendarKeyDraft(prevDraft => prevDraft.slice(0, -1));
        e.preventDefault();
      })
      .with(P.union('Escape', 'Enter'), () => e.currentTarget.blur())
      .otherwise(() => {
        e.preventDefault();
      });
  });

  const onBlur = useLatestCallback(() => {
    const parsed = parseCalendarKey(calendarKeyDraft);
    if (isValid(parsed)) {
      setYear(parsed.year);
      setMonth(parsed.month);
      return;
    }

    setCalendarKeyDraft(calendarKey);
  });

  const onReset = useLatestCallback((e: MouseEvent<HTMLElement>) => {
    const date = new Date(now);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    e.currentTarget.blur();
    e.preventDefault();
  });

  return {
    inputDisplay,
    inputValue: calendarKeyDraft,
    onMouseDown,
    onFocus,
    onKeyDown,
    onBlur,
    onReset,
    year,
    setYear,
    month,
    setMonth,
  };
};

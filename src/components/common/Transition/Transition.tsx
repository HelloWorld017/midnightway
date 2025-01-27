import { useState, useRef, useLayoutEffect } from 'react';
import * as styles from './Transition.css';
import type { Interpolation, Theme } from '@emotion/react';
import type { ReactNode } from 'react';

const useReferenceByKey = <T,>(key: string, value: T) => {
  const ref = useRef({ key, value });
  if (ref.current.key !== key) {
    ref.current = { key, value };
    return ref.current;
  }

  ref.current.value = value;
  return ref.current;
};

type TransitionProps = {
  kind: string;
  tagName?: keyof ReactJSX.IntrinsicElements;
  className?: string;
  enterStyle?: Interpolation<Theme>;
  leaveStyle?: Interpolation<Theme>;
  children: ReactNode;
};

const enum TransitionState {
  ENTER = 0,
  ACTIVE = 1,
  LEAVE = 2,
}

export const Transition = ({
  kind,
  tagName: TagName = 'div',
  className,
  enterStyle,
  leaveStyle,
  children,
}: TransitionProps) => {
  const [elements, setElements] = useState<
    Record<string, { state: TransitionState; element: { value: ReactNode } }>
  >({});

  const onAnimationEnd = (key: string) => () => {
    if (elements[key].state !== TransitionState.LEAVE) {
      const nextElement = { ...elements[key], state: TransitionState.ACTIVE };
      setElements(prevElements => ({ ...prevElements, [key]: nextElement }));
      return;
    }

    setElements(prevElements => {
      const nextElements = { ...prevElements };
      delete nextElements[key];
      return nextElements;
    });
  };

  const latestChildren = useReferenceByKey(kind, children);
  useLayoutEffect(() => {
    const key = Math.random().toString(36).slice(2, 7);
    setElements(prevElements => ({
      ...prevElements,
      [key]: {
        element: latestChildren,
        state: TransitionState.ENTER,
      },
    }));

    return () => {
      setElements(prevElements => ({
        ...prevElements,
        [key]: {
          ...prevElements[key],
          state: TransitionState.LEAVE,
        },
      }));
    };
  }, [kind]);

  return (
    <>
      {Object.entries(elements).map(([key, child]) => (
        <TagName
          key={key}
          className={className}
          css={[
            child.state === TransitionState.ENTER && (enterStyle ?? styles.defaultEnterStyle),
            child.state === TransitionState.LEAVE && (leaveStyle ?? styles.defaultLeaveStyle),
          ]}
          onAnimationEndCapture={onAnimationEnd(key)}
          onTransitionEndCapture={onAnimationEnd(key)}
        >
          {child.element.value}
        </TagName>
      ))}
    </>
  );
};

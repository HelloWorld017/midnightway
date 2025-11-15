import {
  animated,
  config as springConfig,
  useTransition as useSpringTransition,
} from '@react-spring/web';
import { match } from 'ts-pattern';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { Toolkit } from './Toolkit';

export const Overlay = () => {
  const overlayItems = useRepo(repo.overlay.overlayItems);
  const transitions = useSpringTransition(overlayItems ?? [], {
    keys: item => item.kind,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: (_item, _index, state) =>
      state === ('enter' as typeof state) ? springConfig.stiff : {},
  });

  return (
    <>
      {transitions((style, item) => (
        <animated.div style={style}>
          {match(item)
            .with({ kind: 'toolkit' }, toolkit => <Toolkit state={toolkit.state} />)
            .exhaustive()}
        </animated.div>
      ))}
    </>
  );
};

import { IconBell, IconCalendar, IconSlidersHorizontal } from '@/assets/icons';
import { Transition } from '@/components/common/Transition';
import { useState } from 'react';
import { Calendar } from '../../Calendar';
import { ControlCenter } from '../../ControlCenter';
import { Notification } from '../../Notification';
import * as styles from '../../Toolkit.css';

const tabs = {
  'calendar': { icon: <IconCalendar strokeWidth={2.5} />, element: <Calendar /> },
  'control-center': {
    icon: <IconSlidersHorizontal strokeWidth={2.5} />,
    element: <ControlCenter />,
  },
  'notification': { icon: <IconBell strokeWidth={2.5} />, element: <Notification /> },
};

export const Main = () => {
  const [tab, setTab] = useState<keyof typeof tabs>('calendar');

  return (
    <div css={styles.mainStyle}>
      <aside css={styles.asideStyle}>
        {(Object.keys(tabs) as (keyof typeof tabs)[]).map(key => (
          <button
            key={key}
            css={styles.asideItemStyle(tab === key)}
            type="button"
            aria-label={key}
            onClick={() => setTab(key)}
          >
            {tabs[key].icon}
          </button>
        ))}
      </aside>
      <main css={styles.contentStyle}>
        <Transition kind={tab} css={styles.transitionContentStyle}>
          <div css={styles.scrollerStyle}>{tabs[tab].element}</div>
        </Transition>
      </main>
    </div>
  );
};

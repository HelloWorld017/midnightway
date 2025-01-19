import { useMemo } from 'react';
import { IconSetWorkspace } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { SizeAnimated } from '@/components/common/SizeAnimated';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarWorkspace.css';

type BarWorkspaceProps = {
  activeWorkspace: { id: number; name: string } | null;
  isIdle: boolean;
};

export const BarWorkspace = ({ activeWorkspace, isIdle }: BarWorkspaceProps) => {
  const focusedClient = useRepo(repo.hyprland.focusedClient.$pick('class', 'title', 'workspace'));
  const activeWorkspaceNumber = useMemo(() => {
    const name = activeWorkspace?.name;
    const number = name && parseInt(name, 10);
    if (Number.isInteger(number)) {
      return number as number;
    }

    return null;
  }, [activeWorkspace?.name]);

  return (
    <div css={styles.workspaceStyle}>
      {activeWorkspace && (
        <IconSetWorkspace
          css={styles.iconStyle}
          kind={activeWorkspaceNumber ?? -1}
          fallback={<span css={styles.iconFallbackStyle}>{activeWorkspace?.name}</span>}
        />
      )}
      <SizeAnimated css={styles.clientAnimateContainerStyle}>
        <div css={styles.clientContainerStyle}>
          <span css={styles.clientLabelStyle}>
            {(!isIdle && (focusedClient?.title || focusedClient?.class)) || 'Idle'}
          </span>
        </div>
      </SizeAnimated>
    </div>
  );
};

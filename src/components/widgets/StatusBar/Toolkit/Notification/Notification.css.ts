import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = css`
  padding: 0.8rem;
`;

export const sectionStyle = css`
  display: flex;
  flex-direction: column;
  padding-bottom: 1.6rem;
`;

export const sectionHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.4rem;
`;

export const sectionTitleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2rem;
`;

export const trayListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
`;

export const notificationClearAllStyle = (isVisible: boolean) => (theme: Theme) => css`
  cursor: pointer;
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 0.8rem;
  padding: 0.2rem;
  margin: -0.2rem;
  opacity: ${+isVisible};
  transition: ${transition(theme, ['opacity'])};
  transform: translateZ(0);

  &:hover {
    opacity: ${isVisible ? 0.8 : 0};
  }

  ${!isVisible &&
  css`
    pointer-events: none;
  `}
`;

export const notificationListStyle = css`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 10.8rem;
`;

export const notificationItemStyle = css`
  padding: 0.2rem 0;
`;

export const noItemsStyle = (isEnabled: boolean) => (theme: Theme) => css`
  position: absolute;
  inset: 0;
  padding: 4.8rem 1.2rem;
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  letter-spacing: -0.02em;
  line-height: 1.2rem;
  opacity: ${+isEnabled};
  pointer-events: none;
  user-select: none;
  transition: ${transition(theme, ['opacity'])};
`;

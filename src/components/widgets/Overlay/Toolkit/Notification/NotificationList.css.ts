import { css } from '@emotion/react';

export const notificationListStyle = css`
  position: relative;
  min-height: 14.4rem;
`;

export const notificationListInnerStyle = css`
  display: flex;
  flex-direction: column;
  margin: -0.2rem 0;
`;

export const notificationItemStyle = css`
  padding: 0.4rem 0;

  *:first-of-type > & {
    padding-top: 0;
  }

  *:last-of-type > & {
    padding-bottom: 0;
  }
`;

import { css } from '@emotion/react';

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-height: 100%;
`;

export const columnsContainerStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  padding-top: 1.6rem;
  flex: 1 0 auto;
`;

export const columnStyle = css`
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 0;
  min-width: 0;
  gap: 0.4rem;
`;

export const powerMenuStyle = css`
  margin-top: 2rem;
  flex: 0 0 auto;
`;

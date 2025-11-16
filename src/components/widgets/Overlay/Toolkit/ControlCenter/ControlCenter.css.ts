import { css } from '@emotion/react';

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-height: 100%;
  padding: 1rem;
`;

export const columnsContainerStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding-top: 1.2rem;
  flex: 1 0 auto;
`;

export const columnStyle = css`
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 0;
  min-width: 0;
  gap: 0.6rem;
`;

export const powerMenuStyle = css`
  margin-top: 2.4rem;
  flex: 0 0 auto;
`;

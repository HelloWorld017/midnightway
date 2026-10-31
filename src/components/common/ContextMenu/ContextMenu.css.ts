import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const frameStyle = (theme: Theme) => css`
  position: fixed;
  z-index: 1000;
  box-sizing: border-box;
  width: max-content;
  min-width: min(12rem, calc(100vw - 16px));
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 16px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.3rem;
  background: ${theme.surface.bgOverlay};
  border: 1px solid ${theme.surface.fillLine};
  border-radius: 0.7rem;
  box-shadow: 0 0.4rem 1.6rem #0003;
  outline: none;
`;

export const listStyle = css`
  display: flex;
  flex-direction: column;
`;

export const itemStyle = (theme: Theme) => css`
  appearance: none;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  width: 100%;
  min-height: 2rem;
  margin: 0;
  padding: 0.4rem 0.65rem;
  border: 0;
  border-radius: 0.4rem;
  background: transparent;
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.2rem;
  letter-spacing: -0.02em;
  text-align: left;
  cursor: pointer;
  outline: none;

  &:hover:not(:disabled),
  &:focus-visible,
  &[aria-expanded='true'] {
    background: ${theme.surface.bgElevated};
  }

  &:active:not(:disabled) {
    background: ${theme.surface.bgElevatedActive};
  }

  &:disabled {
    color: ${theme.surface.fillSecondary};
    opacity: 0.5;
    cursor: default;
  }
`;

export const labelStyle = css`
  min-width: 0;
  overflow-wrap: anywhere;
`;

export const chevronStyle = css`
  flex: 0 0 auto;
  font-size: 1.3rem;
  line-height: 1rem;
`;

export const submenuStyle = css`
  position: relative;
`;

export const sectionStyle = (theme: Theme) => css`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  &:not(:first-child) {
    margin-top: 0.3rem;
    padding-top: 0.3rem;
    border-top: 1px solid ${theme.surface.fillLine};
  }

  & + :not(&) {
    margin-top: 0.3rem;
    padding-top: 0.3rem;
    border-top: 1px solid ${theme.surface.fillLine};
  }
`;

export const sectionLabelStyle = (theme: Theme) => css`
  padding: 0.35rem 0.65rem;
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 0.7rem;
  line-height: 1rem;
  overflow-wrap: anywhere;
`;

export const fallbackStyle = (theme: Theme) => css`
  display: block;
  padding: 0.6rem 0.65rem;
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 0.85rem;
`;

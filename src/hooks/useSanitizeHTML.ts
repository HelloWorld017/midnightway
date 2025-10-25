import DOMPurify from 'dompurify';
import { useMemo } from 'react';

export const useSanitizeHTML = (html: string) => {
  const markup = useMemo(
    () => ({ dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(html) } }),
    [html]
  );

  return markup;
};

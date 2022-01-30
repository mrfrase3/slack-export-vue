import sanitizeHtml from 'sanitize-html';

export const sanitise = (value = ''): string => sanitizeHtml(value, { allowedTags: [] });

export const highlight = (value = '', search = '~-~', className = 'hightlight'): string => {
  const sanitised = sanitise(value);
  const strippedSearch = search.replace(/[^\w- ]/g, '').trim();
  if (!strippedSearch) return sanitised;
  const regex = new RegExp(strippedSearch, 'gi');
  return sanitised.replace(regex, (match: string) => `<span class="${className}">${match}</span>`);
};

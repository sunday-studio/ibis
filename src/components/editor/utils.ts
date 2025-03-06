export function getEditorContent(content: string) {
  try {
    const parsedContent = JSON.parse(content);

    if (parsedContent?.root?.children?.length > 0) {
      return content;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export type FontFamily =
  | 'HypatiaSansPro'
  | 'Inter'
  | 'InstrumentSans'
  | 'Ojuju'
  | 'PlusJakartaSans';

export function getFontFamily(fontFamily?: FontFamily) {
  switch (fontFamily) {
    case 'HypatiaSansPro':
      return 'font-hypatia-sans-pro';
    case 'Inter':
      return 'font-inter';
    case 'InstrumentSans':
      return 'font-instrument-sans';
    case 'Ojuju':
      return 'font-ojuju';
    case 'PlusJakartaSans':
      return 'font-plus-jakarta-sans';

    default:
      return 'font-plus-jakarta-sans';
  }
}

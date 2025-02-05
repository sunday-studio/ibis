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

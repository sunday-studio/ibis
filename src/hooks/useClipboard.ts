export const useClipboard = (text: string) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  return {
    copy: copyToClipboard,
  };
};

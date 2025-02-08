import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateQueries = (queryKeys: string[]) => {
  const queryClient = useQueryClient();

  return () => {
    for (const queryKey of queryKeys) {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  };
};

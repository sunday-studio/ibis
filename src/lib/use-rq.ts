import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateQueries = (queryKeys: string[]) => {
  const queryClient = useQueryClient();

  return () => {
    for (const queryKey of queryKeys) {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  };
};



export async function rq<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Database error occurred');
  }
}
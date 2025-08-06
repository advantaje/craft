import { useState, useCallback } from 'react';

interface UseApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiCallReturn<T, P> extends UseApiCallState<T> {
  execute: (params: P) => Promise<void>;
  reset: () => void;
}

export function useApiCall<T, P = void>(
  apiFunction: (params: P) => Promise<T>
): UseApiCallReturn<T, P> {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (params: P) => {
      setState({ data: null, loading: true, error: null });
      
      try {
        const result = await apiFunction(params);
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        setState({ 
          data: null, 
          loading: false, 
          error: error instanceof Error ? error : new Error('An error occurred')
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
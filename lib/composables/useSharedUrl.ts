import { useSearchParams } from 'next/navigation';

export const useSharedUrl = () => {
  const params = useSearchParams();

  const getSharedUrl = () => {
    for (const key of ['title', 'description', 'name', 'text', 'url']) {
      const param = params.get(key);
      if (param?.startsWith('http')) {
        return param;
      }
    }
  };

  return {
    url: getSharedUrl(),
  };
};

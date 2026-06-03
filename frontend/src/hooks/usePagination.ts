import { useState, useCallback, useEffect } from 'react';
import { useGetMessagesQuery } from '@/store/api';
import { DEFAULT_PAGE_SIZE, DEFAULT_OFFSET } from '@/constants/sizes';

export function usePagination(roomId?: number) {
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const limit = DEFAULT_PAGE_SIZE;

  // The hook triggers a fetch automatically based on the changing offset
  const { data: messages = [], isFetching } = useGetMessagesQuery(
    { roomId: roomId!, limit, offset },
    { skip: !roomId },
  );

  // Reset offset when room changes
  useEffect(() => {
    setOffset(0);
  }, [roomId]);

  const loadMore = useCallback(() => {
    if (!isFetching) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  }, [isFetching, limit]);

  return {
    messages,
    loadingMessages: isFetching,
    loadMore,
  };
}

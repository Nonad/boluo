import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import { get } from '@/api/request';
import { LoadMessages } from '@/actions/chat';
import Button from '@/components/atoms/Button';
import Icon from '../atoms/Icon';
import rotateIcon from '@/assets/icons/rotate-cw.svg';

function LoadMoreButton() {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const channelId = useSelector((state) => state.chat!.channel.id);
  const before = useSelector((state) => state.chat!.messageBefore);
  const finished = useSelector((state) => state.chat!.finished);
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
  const dispatch = useDispatch();
  const button = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    button.current?.click();
  }, []);

  if (finished) {
    return null;
  }
  const loadMore = async () => {
    const limit = 128;
    setLoading(true);
    const result = await get('/messages/by_channel', { channelId, before, limit });
    setLoading(false);
    if (!result.isOk) {
      console.error(result.value);
      return;
    }
    const messages = result.value;
    let finished = true;
    if (messages.length >= limit) {
      messages.pop();
      finished = false;
    }
    dispatch<LoadMessages>({ type: 'LOAD_MESSAGES', messages, finished });
  };
  return (
    <Button data-small ref={button} onClick={loadMore} disabled={loading}>
      {loading ? <Icon sprite={rotateIcon} loading /> : '载入更多'}
    </Button>
  );
}

export default LoadMoreButton;
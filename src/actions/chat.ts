import { ChannelWithRelated } from '@/api/channels';
import { Message } from '@/api/messages';
import { ChannelEvent } from '@/api/events';
import { Id } from '@/utils/id';
import { Dispatch } from '@/store';
import { get } from '@/api/request';
import { throwErr } from '@/utils/errors';
import { connect as apiConnect } from '@/api/connect';
import { ChatState } from '@/reducers/chat';
import { List, Map } from 'immutable';

export interface LoadChat {
  type: 'LOAD_CHAT';
  channelWithRelated: ChannelWithRelated;
  connection: WebSocket;
}

export interface CloseChat {
  type: 'CLOSE_CHAT';
  id: Id;
}

export interface LoadMessages {
  type: 'LOAD_MESSAGES';
  messages: Message[];
  finished: boolean;
}

export interface ChannelEventReceived {
  type: 'CHANNEL_EVENT_RECEIVED';
  event: ChannelEvent;
}

export interface ChatLoaded {
  type: 'CHAT_LOADED';
  chat: ChatState;
}

function connect(dispatch: Dispatch, id: Id, eventAfter: number): WebSocket {
  const connection = apiConnect(id, 'CHANNEL', eventAfter);
  connection.onmessage = (wsMsg) => {
    const event = JSON.parse(wsMsg.data) as ChannelEvent;
    dispatch({ type: 'CHANNEL_EVENT_RECEIVED', event });
  };
  connection.onerror = (e) => {
    console.warn(e);
  };
  return connection;
}

export const loadChat = (id: Id) => async (dispatch: Dispatch) => {
  const result = await get('/channels/query_with_related', { id });
  if (result.isErr) {
    throwErr(dispatch)(result.value);
    return;
  }
  const { channel, members, colorList } = result.value;
  const messageBefore = new Date().getTime();
  const eventAfter = messageBefore - 24 * 60 * 60 * 1000;
  const connection = connect(dispatch, channel.id, eventAfter);
  const chat: ChatState = {
    colorMap: Map<Id, string>(Object.entries(colorList)),
    itemList: List(),
    itemMap: Map(),
    messageBefore,
    eventAfter,
    finished: false,
    heartbeatMap: Map(),
    channel,
    connection,
    members,
  };
  dispatch({ type: 'CHAT_LOADED', chat });
};

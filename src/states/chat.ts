import { Channel, Member } from '../api/channels';
import { List, Map } from 'immutable';
import { Id, newId } from '../id';
import { Message } from '../api/messages';
import { Preview } from '../api/events';

export interface MessageChatItem {
  id: Id;
  type: 'MESSAGE';
  message: Message;
  date: Date;
}

export interface PreviewChatItem {
  type: 'PREVIEW';
  preview: Preview;
  date: Date;
  id: Id;
}

export interface EmptyItem {
  type: 'EMPTY';
  date: Date;
  id: Id;
}

export type ChatItem = MessageChatItem | PreviewChatItem | EmptyItem;

export const newPreviewChatItem = (preview: Preview): PreviewChatItem => ({
  type: 'PREVIEW',
  preview,
  date: new Date(preview.start),
  id: preview.id,
});

export const newMessageChatItem = (message: Message): MessageChatItem => ({
  type: 'MESSAGE',
  date: new Date(message.orderDate),
  id: message.id,
  message,
});

export const newEmptyItem = (date: Date): EmptyItem => ({ type: 'EMPTY', date, id: newId() });

export interface PreviewEntry {
  type: 'PREVIEW';
  date: Date;
  id: Id;
}

export interface MessageEntry {
  type: 'MESSAGE';
  date: Date;
}

export type ItemMap = Map<Id, PreviewEntry | MessageEntry>;

export interface Chat {
  channel: Channel;
  members: Member[];
  colorMap: Map<Id, string>;
  itemList: List<ChatItem>;
  itemMap: ItemMap;
  finished: boolean;
  messageBefore: number;
  eventAfter: number;
}

export const addMessageToItemMap = (itemMap: ItemMap, message: Message): ItemMap =>
  itemMap.set(message.id, { type: 'MESSAGE', date: new Date(message.orderDate) });

export const addPreviewToItemMap = (itemMap: ItemMap, preview: Preview): ItemMap =>
  itemMap.set(preview.senderId, { type: 'PREVIEW', date: new Date(preview.start), id: preview.id });

export const findItem = (itemList: List<ChatItem>, date: Date, id: Id): [number, ChatItem] => {
  let i = 0;
  for (const item of itemList) {
    if (item.id === id) {
      return [i, item];
    } else if (item.date < date) {
      throw new Error('failed to find item');
    }
    i += 1;
  }
  throw new Error('failed to find item');
};

export const queryMessageEntry = (itemMap: ItemMap, messageId: Id): MessageEntry | undefined => {
  const result = itemMap.get(messageId);
  if (result === undefined) {
    return undefined;
  } else if (result.type !== 'MESSAGE') {
    throw new Error('Unexpected entry');
  } else {
    return result;
  }
};

export const queryPreviewEntry = (itemMap: ItemMap, senderId: Id): PreviewEntry | undefined => {
  const result = itemMap.get(senderId);
  if (result === undefined) {
    return undefined;
  } else if (result.type !== 'PREVIEW') {
    throw new Error('Unexpected entry');
  } else {
    return result;
  }
};
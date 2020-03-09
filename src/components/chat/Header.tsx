import React from 'react';
import { Chat } from '../../states/chat';
import { JoinChannelButton } from '../JoinChannelButton';
import { MemberIcon } from '../icons';
import { cls } from '../../classname';
import { useMember } from './ChannelChat';
import { ChannelSettings } from './ChannelSettings';

interface Props {
  chat: Chat;
  toggleMemberList: () => void;
  isMemberListOpen: boolean;
}

export const Header = React.memo<Props>(({ chat, isMemberListOpen, toggleMemberList }) => {
  const member = useMember();
  return (
    <div className="p-2 border-b h-14 flex items-center justify-between">
      <div>
        <div className="text-lg">{chat.channel.name}</div>
        <div className="hidden md:inline text-sm w-full flex-shrink truncate text-gray-700 py-1">
          {chat.channel.topic}
        </div>
      </div>
      <div>
        <JoinChannelButton className="text-xs p-1 h-8" channel={chat.channel} />
        {member.space?.isAdmin && <ChannelSettings channel={chat.channel} />}
        <button
          onClick={toggleMemberList}
          className={cls('btn h-8 text-xs p-1 ml-1', { 'btn-down': isMemberListOpen })}
        >
          <MemberIcon />
        </button>
      </div>
    </div>
  );
});
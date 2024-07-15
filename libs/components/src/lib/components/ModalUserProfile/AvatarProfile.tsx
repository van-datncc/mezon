import React from 'react';
import Avatar from './Avatar';

type AvatarProfileProps = {
  avatar?: string;
  username?: string;
  userToDisplay: any;
};

const AvatarProfile = ({ avatar, username, userToDisplay }: AvatarProfileProps) => {
  return (
    <div className="text-black ml-[50px]">
      <Avatar
        src={avatar}
        alt={username}
        placeholder={userToDisplay ? undefined : './assets/images/anonymous-avatar.jpg'}
        isUser={!!userToDisplay}
      />
    </div>
  );
};

export default React.memo(AvatarProfile);

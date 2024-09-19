import { AvatarImage, Icons } from '@mezon/components';
import { selectMemberClanByGoogleId } from '@mezon/store-mobile';
import { NameComponent } from '@mezon/ui';
import { IChannelMember, getAvatarForPrioritize, getNameForPrioritize } from '@mezon/utils';
import Hls from 'hls.js';
import { getColorAverageFromURL } from 'libs/components/src/lib/components/SettingProfile/AverageColor';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface MediaPlayerProps {
    src: string;
}

function HLSPlayer({ src }: MediaPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            // Check if HLS is supported
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(videoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoElement.play().catch((error) => {
                        console.error('Error playing video:', error);
                    });
                });

                // Clean up when component is unmounted
                return () => {
                    hls.destroy();
                };
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                // HLS support natively
                videoElement.src = src;
                videoElement.addEventListener('loadedmetadata', () => {
                    videoElement.play().catch((error) => {
                        console.error('Error playing video:', error);
                    });
                });
            } else {
                // Fallback for other video formats
                videoElement.src = src;
                videoElement.addEventListener('loadedmetadata', () => {
                    videoElement.play().catch((error) => {
                        console.error('Error playing video:', error);
                    });
                });
            }
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            muted
            style={{ width: '100%' }}
            controlsList="nodownload noremoteplayback noplaybackrate"
            disablePictureInPicture
        />
    );
}

export type UserListStreamChannelProps = {
    readonly memberJoin: IChannelMember[];
};

function UserListStreamChannel({ memberJoin }: UserListStreamChannelProps) {
    const [displayedMembers, setDisplayedMembers] = useState<IChannelMember[]>(memberJoin || []);

    useEffect(() => {
        const handleSizeWidth = () => {
            let membersToShow = memberJoin || [];
            if (window.innerWidth < 900) {
                membersToShow = membersToShow.slice(0, 4);
            } else if (window.innerWidth < 1000) {
                membersToShow = membersToShow.slice(0, 5);
            }
            else if (window.innerWidth < 1200) {
                membersToShow = membersToShow.slice(0, 6);
            }
            else if (window.innerWidth > 1200) {
                membersToShow = membersToShow.slice(0, 8);
            }
            setDisplayedMembers(membersToShow);
        };

        handleSizeWidth();

        window.addEventListener('resize', handleSizeWidth);

        return () => {
            window.removeEventListener('resize', handleSizeWidth);
        };
    }, [memberJoin]);

    return displayedMembers.map((item: IChannelMember) => {
        return (
            <div key={item.id} className='w-[250px] h-[100px] min-w-[100px] min-h-[100px]'>
                <UserItem user={item} />
            </div>
        );
    });
}

function UserItem({ user }: { user: IChannelMember }) {
    const member = useSelector(selectMemberClanByGoogleId(user.user_id ?? ''));
    const name = getNameForPrioritize(member?.clan_nick, member?.user?.display_name, member?.user?.username);
    const avatar = getAvatarForPrioritize(member?.clan_avatar, member?.user?.avatar_url);

    const checkUrl = (url: string | undefined) => {
        if (url !== undefined && url !== '') return true;
        return false;
    };

    const [color, setColor] = useState<string>('');

    useEffect(() => {
        const getColor = async () => {
            if (checkUrl(member?.user?.avatar_url)) {
                const url = member?.user?.avatar_url;
                const colorImg = await getColorAverageFromURL(url || '');
                if (colorImg) setColor(colorImg);
            }
        };

        getColor();
    }, [member?.user?.avatar_url]);
    return (
        <div
            className="relative w-full h-full flex p-1 justify-center items-center gap-3 cursor-pointer rounded-lg"
            style={{ backgroundColor: color ? color : 'grey' }}
        >
            <div className="w-14 h-14 rounded-full">
                <div className="w-14 h-14">
                    {member ? (
                        <AvatarImage
                            alt={member?.user?.username || ''}
                            userName={member?.user?.username}
                            className="min-w-14 min-h-14 max-w-14 max-h-14"
                            src={avatar}
                        />
                    ) : (
                        <Icons.AvatarUser />
                    )}
                </div>
            </div>
            <div className='absolute left-1 bottom-1'>
                {member ? (
                    <NameComponent id="" name={name || ''} />
                ) : (
                    <p className="text-sm font-medium dark:text-[#AEAEAE] text-colorTextLightMode">{user.participant} (guest)</p>
                )}
            </div>
        </div>
    );
}

type ChannelStreamProps = {
    hlsUrl?: string;
    memberJoin: IChannelMember[];
};

export default function ChannelStream({ hlsUrl, memberJoin }: ChannelStreamProps) {
    return (
        <div className="w-full flex flex-col gap-6">
            {hlsUrl ? (
                <div className="min-h-40 items-center flex justify-center">
                    <div className="w-9/12">
                        <HLSPlayer src={hlsUrl} />
                    </div>
                </div>
            ) : (
                <div className='bg-white min-h-[500px] text-5xl text-black flex justify-center items-center'>
                    No stream today
                </div>)}
            <div className='w-full flex gap-2 justify-center'>
                <UserListStreamChannel memberJoin={memberJoin}></UserListStreamChannel>
            </div>
        </div>
    )
}

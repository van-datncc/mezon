import * as Icons from '../Icons';
import { InputField } from '@mezon/ui';

export type ServerHeaderProps = {
  name?: string;
  type: string;
  bannerImage?: string;
};

function ServerHeader({ name, type, bannerImage }: ServerHeaderProps) {
  return (
    <>
      {type === 'direct' ? (
        <div className="px-4  border-b-1 border-bgPrimary h-12 font-title font-semibold text-white">
          <InputField
            type="text"
            placeholder="Find or start a conversation"
            className="h-[10px] text-[10px] w-full bg-bgTertiary border-borderDefault"
          />
        </div>
      ) : (
        <>
          <div className={`${bannerImage ? 'h-[136px]' : 'h-[49px]'} relative`}>
            {bannerImage && (<img src={bannerImage} alt='imageCover' className='h-full w-full' />)}
            <div className="cursor-pointer w-[272px] px-4 pt-4 pb-5 left-0 top-0 absolute flex-row justify-center items-center gap-2 inline-flex">
              <p className="grow shrink basis-0 h-8 text-white text-lg  font-bold font-['Manrope']">
                {name?.toLocaleUpperCase()}
              </p>
              <button className="w-6 h-8 relative flex flex-col justify-center">
                <Icons.ArrowDown />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ServerHeader;

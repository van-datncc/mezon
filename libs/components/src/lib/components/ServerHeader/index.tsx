import { Check, Chevron, Verified } from '@mezon/components'
import * as Icons from '../Icons'
import { InputField } from '@mezon/ui';

export type ServerHeaderProps = {
  name?: string;
  type: string
}

function ServerHeader({ name, type }: ServerHeaderProps) {
  return (
    <>
      {type === 'direct' ? (
        <div className="px-4 border-b-2 border-bgPrimary h-12 font-title font-semibold text-white">
          <InputField type='text' placeholder='Find or start a conversation' className='h-[10px] text-[10px] w-full bg-bgTertiary border-borderDefault' />
        </div>
      ) : (
        <div className="flex items-center px-4 border-b-2 border-bgPrimary h-12 font-title text-[15px] font-semibold text-white hover:bg-gray-550/[0.16] shadow-sm transition">
          <div className="relative mr-1 w-4 h-4">
            <Verified className="absolute w-4 h-4 text-gray-550" />
            <Check className="absolute w-4 h-4" />
          </div>
          {name}
          <Chevron className="ml-auto w-[18px] h-[18px] opacity-80" />
        </div>
      )} </>
  )
}

export default ServerHeader

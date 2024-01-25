import * as Icons from '../../Icons';
import { ChannelTypeEnum } from '@mezon/utils';
import React, { useState } from 'react';

interface ChannelTypeProps {
  type: number;
}


export const ChannelTypeComponent: React.FC<ChannelTypeProps> = ({ type }) => {
  return (
    <button className="Frame403 self-stretch px-2 py-3 bg-stone-900 rounded-lg justify-center items-center gap-4 inline-flex hover:bg-stone-800">
        <div className="ChannelChat w-6 h-6 relative">
          {type === ChannelTypeEnum.TEXT ? (
            <Icons.Hashtag defaultSize="w-6 h-6" />
          ) : type === ChannelTypeEnum.VOICE ? (
            <Icons.Speaker defaultSize="w-6 h-6" />
          ) : type === ChannelTypeEnum.FORUM ? (
            <Icons.Forum defaultSize="w-6 h-6" />
          ) : type === ChannelTypeEnum.ANNOUNCEMENT ? (
            <Icons.Announcement defaultSize="w-6 h-6" />
          ) : (
            []
          )}
        </div>
        <div className="Frame402 grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
          <div className="Text self-stretch text-stone-300 text-base font-bold font-['Manrope'] leading-normal">
            {type === ChannelTypeEnum.TEXT ? (
              <p>Text</p>
            ) : type === ChannelTypeEnum.VOICE ? (
              <p>Voice</p>
            ) : type === ChannelTypeEnum.FORUM ? (
              <p>Forum</p>
            ) : type === ChannelTypeEnum.ANNOUNCEMENT ? (
              <p>Announcement</p>
            ) : (
              ''
            )}
          </div>
          <div className="SendMessagesImagesGifsEmojiOpinionsAndPuns self-stretch text-zinc-400 text-sm font-normal font-['Manrope'] leading-[18.20px]">
            {type === ChannelTypeEnum.TEXT ? (
              <p> Send messages, images, GIFs, emoji, opinions, and puns</p>
            ) : type === ChannelTypeEnum.VOICE ? (
              <p> Hang out together with voice, video, and screen share</p>
            ) : type === ChannelTypeEnum.FORUM ? (
              <p>Create a space for organized discussions</p>
            ) : type === ChannelTypeEnum.ANNOUNCEMENT ? (
              <p>Important updates for people in and out of the server</p>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="RadioButton p-0.5 justify-start items-start flex">
          <div className="Wrapper w-5 h-5 relative">
            <div className="Plate w-5 h-5 left-0 top-0 absolute justify-start items-start inline-flex">
              <div className="Circle grow shrink basis-0 self-stretch bg-stone-900 rounded-full border border-blue-600" />
            </div>
            <div className="Ellipse w-3 h-3 left-[4px] top-[4px] absolute bg-blue-600 rounded-full" />
          </div>
        </div>
    </button>
  );
};

// export default function FormElementsRadioPrimary() {
//   const [selectedOption, setSelectedOption] = useState('');

//   const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedOption(e.target.value);
//   };

//   return (
//     <>
//       {/*<!-- Component: Primary checkboxes --> */}
//       <fieldset className="flex gap-10">
//         <legend className="mb-6 text-slate-500">Primary radio group:</legend>
//         <div className="relative flex items-center">
//           <input
//             className="w-4 h-4 transition-colors bg-white border-2 rounded-full appearance-none cursor-pointer peer border-slate-500 checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
//             type="radio"
//             value="huey"
//             id="huey"
//             name="drone"
//             onChange={onValueChange}
//           />
//           <label
//             className="pl-2 cursor-pointer text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
//             htmlFor="huey"
//           >
//             Huey
//           </label>
//           <svg
//             className="absolute left-0 w-4 h-4 transition-all duration-300 scale-50 opacity-0 pointer-events-none fill-white peer-checked:scale-100 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
//             viewBox="0 0 16 16"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             aria-labelledby="title-1 description-1"
//             role="graphics-symbol"
//           >
//             <title id="title-1">Circle Shape</title>
//             <desc id="description-1">
//               Circle shape to indicate whether the radio input is checked or
//               not.
//             </desc>
//             <circle cx="8" cy="8" r="4" />
//           </svg>
//         </div>
//         <div className="relative flex items-center">
//           <input
//             className="w-4 h-4 transition-colors bg-white border-2 rounded-full appearance-none cursor-pointer peer border-slate-500 checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
//             type="radio"
//             value="dewey"
//             id="dewey"
//             name="drone"
//             onChange={onValueChange}
//           />
//           <label
//             className="pl-2 cursor-pointer text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
//             htmlFor="dewey"
//           >
//             Dewey
//           </label>
//           <svg
//             className="absolute left-0 w-4 h-4 transition-all duration-300 scale-50 opacity-0 pointer-events-none fill-white peer-checked:scale-100 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
//             viewBox="0 0 16 16"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             aria-labelledby="title-2 description-2"
//             role="graphics-symbol"
//           >
//             <title id="title-2">Circle Shape</title>
//             <desc id="description-2">
//               Circle shape to indicate whether the radio input is checked or
//               not.
//             </desc>
//             <circle cx="8" cy="8" r="4" />
//           </svg>
//         </div>
//         <div className="relative flex items-center">
//           <input
//             className="w-4 h-4 transition-colors bg-white border-2 rounded-full appearance-none cursor-pointer peer border-slate-500 checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
//             type="radio"
//             value="louie"
//             id="louie"
//             name="drone"
//             onChange={onValueChange}
//           />
//           <label
//             className="pl-2 cursor-pointer text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
//             htmlFor="louie"
//           >
//             Louie
//           </label>
//           <svg
//             className="absolute left-0 w-4 h-4 transition-all duration-300 scale-50 opacity-0 pointer-events-none fill-white peer-checked:scale-100 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
//             viewBox="0 0 16 16"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             aria-labelledby="title-3 description-3"
//             role="graphics-symbol"
//           >
//             <title id="title-3">Circle Shape</title>
//             <desc id="description-3">
//               Circle shape to indicate whether the radio input is checked or
//               not.
//             </desc>
//             <circle cx="8" cy="8" r="4" />
//           </svg>
//         </div>
//       </fieldset>
//       {/*<!-- End Primary checkboxes --> */}
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
const SettingRightClan = ({ onUserProfileClick }: { onUserProfileClick?: () => void }) => {
    const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

//   useEffect(() => {
//     const timerInterval = setInterval(() => {
//       setSeconds((prevSeconds) => (prevSeconds + 1) % 60);
//       setMinutes((prevMinutes) => (prevMinutes + 1) % 60 === 0 ? prevMinutes + 1 : prevMinutes);
//     }, 1000);
//     return () => clearInterval(timerInterval);
//   }, []);
  const handleUserProfileButtonClick = () => {
    if (onUserProfileClick) {
        onUserProfileClick();
    }
  };
    return (
        
        <div className="overflow-y-auto flex flex-col flex-1 shrink min-w-0 bg-bgSecondary w-1/2 pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
            <div className="mt-[16px] pl-[90px] text-white">
                        <h1 className="text-2xl font-medium">Profiles</h1>
                        <button className="pt-1 text-white mt-[20px] font-medium text-xl" onClick={handleUserProfileButtonClick}>User Profile</button>
                        <button className="pt-1 text-white mt-[20px] font-medium text-xl ml-[16px] border-b-2 border-blue-500">Clan Profile</button>
                        <div className="flex mt-[30px]">
                            <p>Show who you are with different profiles for each of your clans</p>
                            <a href="" className="ml-2 text-blue-500"> Learn more about Clan Profiles</a>
                        </div>
                        <p className="mt-[20px]">CHOOSE A CLAN</p>
                        <select
                            name="clan"
                            className="block w-full mt-1 bg-black border border-black text-white rounded p-2"
                        >
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
            <div className="flex-1 flex mt-[10px] pl-[90px] ">
                <div className="w-1/2 text-white">
                    <div className="mt-[20px]">
                        <label className="font-normal">CLAN NICKNAME</label>
                        <br />
                        <input type="text"className="rounded-[3px] w-full text-white border border-black px-4 py-2 mt-2 focus:outline-none focus:border-white-500 bg-black"placeholder="Enter display name"/>
                    </div>
                    <div className="mt-[20px]">
                        <label className="font-normal">CLAN NICKNAME</label>
                        <br />
                        <input type="text"className="rounded-[3px] w-full text-white border border-black px-4 py-2 mt-2 focus:outline-none focus:border-white-500 bg-black"placeholder="Enter display name"/>
                    </div>
                    <p>You don't have permission to change you nickname in this server</p>
                    <div className="mt-[20px]">
                        <label className="font-normal">PRONOUNS</label>
                        <br />
                        <input type="text"className="rounded-[3px] w-full text-white border border-black px-4 py-2 mt-2 focus:outline-none focus:border-white bg-black"placeholder="Add your pronoun"/>
                    </div>
                </div>
                <div className="w-1/2 text-white">
                    <p className="ml-[30px] mt-[30px]">PREVIEW</p>
                    <div className="bg-black h-[542px] ml-[30px] mt-[10px] rounded-[10px] flex flex-col relative">
                        <div className="h-1/6 bg-green-500 rounded-tr-[10px] rounded-tl-[10px]"></div>
                        <div className="text-black ml-[50px]">
                            <img src="https://i.postimg.cc/3RSsTnbD/3d63f5caeb33449b32d885e5aa94bbbf.jpg" alt="" className="w-[100px] h-[100px] rounded-[50px] bg-bgSecondary mt-[-50px] ml-[-25px]"/>
                        </div>
                        <div className="bg-bgSecondary w-5/6 h-2/3 mt-[20px] ml-[35px]  rounded-[20px]">
                        <div className="w-[300px] mt-[16px] ml-[16px]">
                        <p className="text-xl font-medium">anh.nguyendiep</p>
                        <p>anh.nguyendiep</p>
                        </div>
                        <div className="w-[300px] mt-[50px] ml-[16px]">
                            <p>CUSTOMIZING MY PROFILE</p>
                            <div className='flex'>
                            <img src="https://i.postimg.cc/3RSsTnbD/3d63f5caeb33449b32d885e5aa94bbbf.jpg" alt="" className="w-[100px] h-[100px] rounded-[8px] mt-[16px]"/>
                            <div className='mt-[40px] ml-[20px]'>
                                <p>User Profile</p>
                                <p>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
                            </div>
                            </div>
                        </div>
                        <div className="w-[300px] mt-[40px] ml-[16px]">
                        <button className='w-5/6 h-[50px] ml-[30px] bg-black rounded-[8px]'> 
                                Example button
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
                {/* <div className="w-1/3 text-black ml-[50px]">
                    <button className="bg-white w-[30px] h-[30px] rounded-[50px] font-bold">X</button>
                    <p className="text-white mt-[10px]">ESC</p>
                </div> */}
        </div>
    )

}
export default SettingRightClan;
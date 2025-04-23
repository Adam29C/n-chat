import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VisiblityReplay } from '../../../Redux/features/user/userSlice';

const ReplayMessage = ({ setShowReplayBox, ShowReplayBox }) => {
  const [first, setfirst] = useState('block');
  const dispatch = useDispatch();

  const showReplay = useSelector((state) => state.user.showReplay);
  const details = useSelector((state) => state.user.details);

  console.log('showReplay', showReplay);

  return (
    <div>
      <div
        className={` flex justify-center items-center bg-gray-200 ${showReplay ? 'block' : 'hidden'}`}
      >
        <div className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] flex justify-between items-center   rounded-full shadow min-w-[250px]">
          <div className="flex items-center justify-between bg-gray-400 rounded-[1vw]  p-3 w-full">
            <div className="flex flex-col">
              <span className="text-green-900 font-semibold text-sm">
                {details?.username}
              </span>
              <span className="text-black text-base">{details?.message}</span>
            </div>
            <button
              className="text-gray-600 hover:text-black"
              onClick={() => dispatch(VisiblityReplay(false))}
            >
              ✖
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayMessage;

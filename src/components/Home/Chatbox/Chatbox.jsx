import React, { useState } from 'react';
import ChatUser from './ChatUser';
import Messages from './Messages';
import MessageSend from './MessageSend';
import { useSelector } from 'react-redux';
import AiMessageBox from '../Ai/AiMessageBox';
import { base_url } from '../../../utils/api_config';
import { FiSend } from 'react-icons/fi';
import { ImCross } from 'react-icons/im';
import socketIOClient from 'socket.io-client';
import PreviewSendingInfo from './PreviewSendingInfo';
import ReplayMessage from './ReplayMessage';
import socket from '../../../utils/Socket';

const Chatbox = () => {
  // const socket = socketIOClient(base_url);

  const showSelectedUserBtn = useSelector(
    (state) => state.showSelectedBtn.value
  );
  const darkMode = useSelector((state) => state.darkTheme.value);
  const authUser = useSelector((state) => state.user.authUser);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const selectAi = useSelector((state) => state.ai.selectAi);
  const PreviewImage = useSelector((state) => state.user.PreviewImage);

  const [first, setfirst] = useState('testing');
  const [ShowReplayBox, setShowReplayBox] = useState(true);

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <>
      {selectAi ? (
        <AiMessageBox />
      ) : !selectedUser ? (
        <div
          className={`w-[100%] md:inline-block  md:w-[60%] lg:w-[76%] h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-200'}  ${showSelectedUserBtn ? 'inline-block' : 'hidden'} `}
        >
          <div className="w-[100%] h-full flex items-center justify-center">
            <div className="flex flex-col root-color">
              <img src={'./images/company-logo.svg'} alt="profile" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-[100%] h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} ${showSelectedUserBtn ? 'inline-block' : 'hidden'} md:inline-block  md:w-[60%] lg:w-[76%]`}
        >
          <ChatUser />

          <PreviewSendingInfo />
          <div className="overflow-y-auto hide_scrollbar max-h-[10vh] md:max-h-[81vh] lg:max-h-[75vh]  ">
            {!PreviewImage && (
              <Messages
                setfirst={setfirst}
                first={first}
                socket={socket}
                setShowReplayBox={setShowReplayBox}
                ShowReplayBox={ShowReplayBox}
              />
            )}
          </div>

          <ReplayMessage />

          <div className=" w-full fixed bottom-0 md:static md:bottom-0 lg:static lg:z-0 ">
            <MessageSend setfirst={setfirst} first={first} socket={socket} />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;

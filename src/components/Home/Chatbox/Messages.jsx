import { useDispatch, useSelector } from 'react-redux';
import MessageLoader from '../../Loader/MessageLoader';
import SingleMessage from './SingleMessage';
import { useEffect, useState } from 'react';
import { GetSelectedUserMessages } from '../../../utils/messageApiCall';
import toast, { Toaster } from 'react-hot-toast';
import { setMessage } from '../../../Redux/features/message/messageSlice';
import { base_url } from '../../../utils/api_config';
import socketIOClient from 'socket.io-client';
import { GetSOketChatHistory } from '../../../utils/Socket.Io';
import socket from '../../../utils/Socket';
import { setOtherUsers } from '../../../Redux/features/user/userSlice';

// import useGetSocketMessage from '../../../context/useGetSocketMessage';
const Messages = ({ first, ShowReplayBox, setShowReplayBox  }) => {
  const { _id, email, mobile, name, role } = JSON.parse(
    localStorage.getItem('info')
  );


  

  const [loading, setLoading] = useState(false);

  const [groupedMessages, setGroupedMessages] = useState([]);
  const [tewsting, settewsting] = useState([]);

  const darkMode = useSelector((state) => state.darkTheme.value);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const messages = useSelector((state) => state.message.messages);
  const otherUsers = useSelector((state) => state.user.otherUsers);

  let noReadedId = messages.filter((msg) => !msg.isRead).map((msg) => msg._id);

  const loadingMessages = useSelector((state) => state.message.loadingMessages);

  const dispatch = useDispatch();

  const adada = async () => {
    await GetSOketChatHistory(selectedUser, _id, (response) => {
      // dispatch(setMessage(response));
      // dispatch(setMessage([...messages, response]));
    });

    // let receiverId = selectedUser.userId;

    // socket.emit('join_room', `${_id}-${receiverId}`);

    // console.log('`${_id}-${receiverId}`', `${_id}-${receiverId}`);

    // socket.emit('get_messages', `${_id}-${receiverId}`);

    // socket.on('chat_history', async (data) => {
    //   dispatch(setMessage(data));
    // });
  };

  useEffect(() => {
    adada();
  }, []);

  // const groupByDate = () => {
  //   const grouped = messages
  //     ?.reduce((acc, msg) => {
  //       const date = msg.createTime.split('T')[0]; // "YYYY-MM-DD"
  //       if (!acc[date]) acc[date] = [];
  //       acc[date].push(msg);
  //       return acc;
  //     }, {})
  //     .filter((item, index, array) => array.map((i) => i._id !== item._id));

  //   const dates = Object.keys(grouped).sort();

  //   // Save dates (for rendering sections)
  //   settewsting(dates);

  //   // If needed, also save grouped data
  //   setGroupedMessages(grouped);
  // };

  // console.log('messages', messages);

  const groupByDate = () => {
    const grouped = messages.reduce((acc, msg) => {
      const date = msg.createTime.split('T')[0];
      acc[date] ??= [];
      const i = acc[date].findIndex((m) => m._id === msg._id);
      i === -1
        ? acc[date].push(msg)
        : new Date(msg.updatedTime) > new Date(acc[date][i].updatedTime) &&
          (acc[date][i] = msg);
      return acc;
    }, {});

    const dates = Object.keys(grouped).sort();

    // Save dates (for rendering sections)
    settewsting(dates);

    // If needed, also save grouped data
    setGroupedMessages(grouped);
  };

  useEffect(() => {
    groupByDate();
  }, [messages]);

  // const handleClick = () => {
  //   const targetElement = document.getElementById('scroll-down');

  //   if (targetElement) {
  //     targetElement.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // console.log('noReadedId', noReadedId);
  // const room_ID = `${_id}-${selectedUser?.userId}`;
  // useEffect(() => {
  //   console.log(' { room: roomId, messageIds: noReadedId }', {
  //     room: room_ID,
  //     messageIds: noReadedId,
  //   });
  //   // socket.emit('mark_read', { room: room_ID, messageIds: noReadedId });
  // }, [room_ID]);

  return (
    <>
      {/* <div className="" style={{ minHeight: "calc(91vh - 8vh)" }}> */}
      {/* <button onClick={handleClick}>111111sclick</button> */}

      {/* <div id="scroll-up"></div> */}
      <div
        className={`pt-3  ${darkMode ? 'bg-slate-900' : 'bg-gray-200'}  `}
        // style={{ minHeight: 'calc(89vh - 10vh)' }}
        style={{ minHeight: 'calc(96vh - 3vh)' }}
      >
        {loadingMessages ? (
          <MessageLoader />
        ) : (
          <>
            {messages?.length <= 0 ? (
              <div className="w-full h-60 flex items-center justify-center">
                <p className="text-base md:text-xl lg:text-2xl">
                  Say! Hi to start the conversation
                </p>
              </div>
            ) : (
              groupedMessages && (
                <>
                  {Object.keys(groupedMessages)
                    .sort()
                    .map((date) => (
                      <div key={date}>
                        <div className=" flex items-center justify-center ">
                          <span className="bg-gray-300 rounded-lg  px-3 py-1 gap-3">
                            {date}
                          </span>
                        </div>

                        {groupedMessages[date]?.map((item, index) => (
                          <SingleMessage
                            key={item._id || index}
                            data={item}
                            setShowReplayBox={setShowReplayBox}
                          />
                        ))}
                      </div>
                    ))}
                </>
              )
            )}
          </>
        )}
      </div>
      <Toaster />
      {/* <div id="scroll-down"></div> */}
    </>
  );
};

export default Messages;

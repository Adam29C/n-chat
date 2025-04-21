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

// import useGetSocketMessage from '../../../context/useGetSocketMessage';
const Messages = ({ first, ShowReplayBox, setShowReplayBox }) => {
  const { _id, email, mobile, name, role } = JSON.parse(
    localStorage.getItem('info')
  );

  const [loading, setLoading] = useState(false);
  const [tewsting, settewsting] = useState([]);
  const darkMode = useSelector((state) => state.darkTheme.value);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const messages = useSelector((state) => state.message.messages);

  const loadingMessages = useSelector((state) => state.message.loadingMessages);

  const dispatch = useDispatch();

  const adada = async () => {
    await GetSOketChatHistory(selectedUser, _id, (response) => {
      dispatch(setMessage(response));
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

  // let room_ID = `${_id}-${selectedUser.userId}`;

  // useEffect(() => {
  //   socket.emit('join_room', room_ID);

  //   socket.on('receive_message', (data) => {
  //     dispatch(setMessage([...messages, data]));
  //   });

  //   return () => {
  //     socket.off('receive_message');
  //     socket.off('new_message_notification');
  //   };
  // }, [room_ID]);

  // let room_ID = `${_id}-${selectedUser.userId}`;

  // useEffect(() => {
  //   socket.emit('join_room', room_ID);

  //   socket.on('receive_message', (data) => {
  //     dispatch(setMessage([...messages, data]));
  //   });

  //   return () => {
  //     socket.off('receive_message');
  //     socket.off('new_message_notification');
  //   };
  // }, [first]);

  // console.log('messages', messages);

  // useEffect(() => {
  //   adada();
  // }, [first]);

  // var socket = socketIOClient(base_url);
  // useEffect(() => {
  //   socket.on('send_message', async (data) => {});
  // }, [socket]);

  // useEffect(() => {
  //   settewsting(messages);
  // }, [messages]);

  return (
    <>
      {/* <div className="" style={{ minHeight: "calc(91vh - 8vh)" }}> */}
      <div
        className={`pt-3  ${darkMode ? 'bg-slate-900' : 'bg-gray-200'}  `}
        style={{ minHeight: 'calc(89vh - 10vh)' }}
        // style={{ minHeight: 'calc(91vh - 10vh)' }}
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
              messages?.map((item, index) => (
                <SingleMessage
                  key={item._id || index}
                  data={item}
                  setShowReplayBox={setShowReplayBox}
                />
              ))
            )}
          </>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default Messages;

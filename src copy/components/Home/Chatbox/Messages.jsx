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

// import useGetSocketMessage from '../../../context/useGetSocketMessage';
const Messages = ({ first, ShowReplayBox, setShowReplayBox }) => {
  const { _id, email, mobile, name, role } = JSON.parse(
    localStorage.getItem('info')
  );

  const [loading, setLoading] = useState(false);
  const darkMode = useSelector((state) => state.darkTheme.value);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const messages = useSelector((state) => state.message.messages);

  const loadingMessages = useSelector((state) => state.message.loadingMessages);

  const dispatch = useDispatch();

  const adada = async () => {
    var socket = socketIOClient(base_url);
    await GetSOketChatHistory(selectedUser, _id, (response) => {
      dispatch(setMessage(response));

      console.log('response', response);
    });

    let receiverId = selectedUser.userId;

    socket.emit('join_room', `${_id}-${receiverId}`);

    socket.emit('get_messages', `${_id}-${receiverId}`);

    socket.on('chat_history', async (data) => {
      console.log('data', data);

      dispatch(setMessage(data));
    });
  };

  useEffect(() => {
    adada();
  }, [first]);
  useEffect(() => {
    adada();
  }, []);

  // const socket = socketIOClient(base_url, { autoConnect: true });
  // const adada = async () => {
  //   await GetSOketChatHistory(selectedUser, _id, (response) => {
  //     dispatch(setMessage(response));
  //   });

  //   // if (selectedUser?._id) {
  //   let roomID = `${_id}-${selectedUser._id}`;
  //   // let roomID = `61fbd0cd41b0d43022cabf27-6787c70cbab5b27b93c07b65`;
  //   socket.emit('join_room', roomID);
  //   socket.emit('get_messages', roomID);
  //   // }
  // };

  // useEffect(() => {
  //   socket.connect();
  //   socket.on('chat_history', (data) => {
  //     console.log('data1212', data);

  //     dispatch(setMessage(data));
  //   });

  //   return () => {
  //     socket.off('chat_history');
  //     socket.disconnect();
  //   };
  // }, [first]);

  // useEffect(() => {
  //   adada();
  // }, [first]);
  // useEffect(() => {
  //   adada();
  // }, []);

  // // useEffect(() => {
  // //   adada();
  // // }, [first, selectedUser]);

  // // console.log('messages12121c', messages);

  useEffect(() => {
    const socket = socketIOClient(base_url, { autoConnect: true });

    if (!selectedUser?.userId || !_id) return;

    const receiverId = selectedUser.userId;
    const room = `${_id}-${receiverId}`;

    // Emit request to fetch the latest message
    socket.emit('message_receive', room);

    // Handler for receiving the latest message
    const handleLatestMessage = (data) => {
      console.log('Received latest message:', data);
      // Optionally dispatch to Redux or update local state
      // dispatch(setMessage(data || []));
    };

    // Handle any errors from the server
    const handleError = (err) => {
      console.error('Socket error:', err.message);
    };

    socket.on('latest_message', handleLatestMessage);
    socket.on('error', handleError);

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off('latest_message', handleLatestMessage);
      socket.off('error', handleError);
    };
  }, [selectedUser?.userId, _id]);

  return (
    <>
      {/* <div className="" style={{ minHeight: "calc(91vh - 8vh)" }}> */}
      <div
        className={`pt-3  ${darkMode ? 'bg-slate-900' : 'bg-gray-200'}  `}
        style={{ minHeight: 'calc(89vh - 10vh)' }}
        // style={{ minHeight: 'calc(91vh - 10vh)' }}
      >
        {loadingMessages ? (
          <>
            <MessageLoader />
          </>
        ) : (
          <>
            {messages?.length <= 0 ? (
              <div className="w-full h-60  flex items-center justify-center">
                <p className="text-base md:text-xl lg:text-2xl">
                  Say! Hi to start the conversation
                </p>
              </div>
            ) : (
              // messages.map((item, index) =>
              //   selectedUser?._id === item?.senderId ||
              //   selectedUser?.adminId === item?.receiverId ? (
              //     <SingleMessage key={index} data={item} />
              //   ) : null

              messages?.map((item, index) => (
                <>
                  <SingleMessage
                    key={index}
                    data={item}
                    setShowReplayBox={setShowReplayBox}
                  />
                </>
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

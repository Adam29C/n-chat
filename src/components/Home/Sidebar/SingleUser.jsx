import { useDispatch, useSelector } from 'react-redux';
import { showSelectedUser } from '../../../Redux/features/selectedUser/selectedUserBtnSlice';
import { setSelectedUsers } from '../../../Redux/features/user/userSlice';
import { useSocketContext } from '../../../context/SocketContext';
import { TiPin } from 'react-icons/ti';
import Formikform from '../../HelpersComponents/Form';
import { RxDragHandleDots2 } from 'react-icons/rx';
// import { toast, ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

GET_SELECTED_USERS_MASSAGES_API;
import { GetSelectedUserMessages } from '../../../utils/messageApiCall';
import {
  setLoadingMessages,
  setMessage,
} from '../../../Redux/features/message/messageSlice';
import { useEffect, useState } from 'react';
import { setSelectAi } from '../../../Redux/features/Ai/aiSlice';
import { base_url } from '../../../utils/api_config';
// import { useGetSocketMessage } from '../../../context/useGetSocketMessage';
import socketIOClient from 'socket.io-client';
import { GET_SELECTED_USERS_MASSAGES_API } from '../../../services/messages.service';
import { formatWhatsAppDate } from '../../../helpers/helpers';
import { useFormik } from 'formik';
import { setOtherUsers } from '../../../Redux/features/user/userSlice';

const SingleUser = ({ data, title }) => {
  const { _id, email, mobile, name, role } = JSON.parse(
    localStorage.getItem('info')
  );

  // const [message, setMessage] = useState([]);
  const [Create_roomId, setCreate_roomId] = useState('');
  const otherUsers = useSelector((state) => state.user.otherUsers);

  const darkMode = useSelector((state) => state.darkTheme.value);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const { socket1, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(data._id);
  const dispatch = useDispatch();

  const handleSelectedUser = async (test) => {
    const receiverId = data?._id;
    const socket = socketIOClient(base_url);

    setCreate_roomId(`${_id}-${receiverId}`);

    let ress = await socket.emit('user_connected', _id);

    await socket.emit('join_room', `${_id}-${receiverId}`);

    await socket.emit('get_messages', `${_id}-${receiverId}`);

    dispatch(setSelectedUsers(data));

    socket.on('chat_history', async (data) => {
      dispatch(setMessage(data));
    });

    // socket.emit('send_message', {
    //   sender: _id,
    //   receiver: receiverId,
    //   message: 'Hello, world! testing Ganu',
    //   replyName: null,
    //   replyMessage: null,
    //   images: '',
    //   audios: '',
    //   videos: '',
    //   // messType: "text",
    //   messStatus: 1,
    //   userName: name,
    //   room: `${_id}-${receiverId}`,
    //   dateTime: new Date().toISOString(),
    //   dateTimestamp: Date.now(),
    // });

    // socket.on('get_messages', (data) => {
    //   console.log('connection', data);

    //   // socket.emit('chat_history', messages);
    // });

    // socket.on('user_connected', (data) => {
    //   console.log('connection', data);
    // });

    dispatch(showSelectedUser(true));
    // dispatch(setSelectAi(false));
  };

  // useEffect(() => {
  //   // if (socket || Create_roomId && Create_roomId) {
  //   //   console.log("sdasd" ,);
  //   // }
  // }, [socket, Create_roomId]);

  // const avbc = async () => {
  //   const socket = socketIOClient(base_url);

  //   socket.on('chat_history', async (data) => {
  //     console.log('datadatadata', data);

  //     dispatch(setMessage(data));
  //   });
  // };
  // useEffect(() => {
  //   avbc();
  // }, [dispatch]);

  return (
    <>
      <div
        className={`flex  border py-3 ${darkMode ? (selectedUser?._id == data?._id ? 'bg-slate-700' : 'bg-slate-900 ') : selectedUser?._id == data?._id ? 'bg-slate-200' : ' bg-white '} rounded-md my-2`}
        onClick={() => handleSelectedUser(data?._id)}
      >
        <div className={`avatar ${isOnline && 'online'} px-2`}>
          <div className="w-12 rounded-full">
            <img src={'./images/default_profile.png'} alt="profile" />
          </div>
        </div>
        <div className="flex justify-between  items-center    rounded-lg">
          {/* Left Section */}
          <div className="text-sm w-full ellipsis ">
            <h1>{data?.name}</h1>
            <div className="flex flex-col">
              <span className="text-lg px-2 last-message-font">
                {data?.userName}
              </span>
            </div>
            <span className="text-emerald-600   px-2 font-sizes">
              {data?.lastMess}
            </span>
          </div>

          {/* Right Section (Ping & Time aligned to the right) */}

          {/* <input
            type="text"
            className="grow outline-none bg-transparent py-2 pl-4"
            placeholder="Search people"
            // value={search}
            // onChange={handleSearchInput}
          /> */}

          <div className="flex flex-col items-end text-right min-w-[50px]">
            {data.userPin === 1 && (
              <span>
                <TiPin className="text-2xl ping_icon" />
              </span>
            )}
            <span className="text-xs text-neutral-600">
              {formatWhatsAppDate(data.dateTimestamp)}
            </span>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default SingleUser;

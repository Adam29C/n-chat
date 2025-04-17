import { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { SendMessages } from '../../../utils/messageApiCall';
import { FaPlus } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { MdOutlineEmojiEmotions, MdSpatialAudioOff } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
// import { toast, Toaster } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import { sendMessages } from '../../../Redux/features/message/messageSlice';
import { base_url } from '../../../utils/api_config';
import socketIOClient from 'socket.io-client';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { AiOutlineAudio } from 'react-icons/ai';
import { IoVideocamOutline } from 'react-icons/io5';
import PreviewSendingInfo from './PreviewSendingInfo';
import { convertTimestamp } from '../../../utils/date.config';
import {
  VisiblityPreviewImage,
  VisiblityReplay,
  UploadDocument,
} from '../../../Redux/features/user/userSlice';
import Pophover from '../../HelpersComponents/Pophover';
import { GET_UPLOAD_DOCUMENT_LINK } from '../../../services/common.service';
import { apiRoutes } from '../../../utils/apiRoutes';
import logger from 'redux-logger';

const MessageSend = ({ setfirst, socket }) => {
  const modalRef = useRef(null);
  const { _id, email, mobile, name, role } = JSON.parse(
    localStorage.getItem('info')
  );
  const details = useSelector((state) => state.user.details);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const darkMode = useSelector((state) => state.darkTheme.value);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const showReplay = useSelector((state) => state.user.showReplay);

  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const VideofileInputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    setfirst(message);

    if (!selectedUser?.userId) {
      console.error('No user selected!');
      return;
    }

    let room_ID = `${_id}-${selectedUser.userId}`;
    let receiverId = selectedUser.userId;

    socket.emit('send_message', {
      sender: _id,
      receiver: receiverId,
      message: message || '',
      replyMessage: showReplay ? details?.message : null,
      replyName: showReplay ? details?.username : null,
      images: '',
      audios: '',
      videos: '',
      messStatus: 1,
      userName: name,
      room: room_ID,
      dateTime: convertTimestamp(new Date().toISOString()),
      dateTimestamp: Date.now(),
    });

    setMessage('');
    dispatch(VisiblityReplay(false));

    socket.emit('get_messages', room_ID);
  };

  useEffect(() => {
    socket.on('chat_history', (data) => {
      console.log('chat_history', data);

      dispatch(setMessage(data));
    });

    return () => {
      socket.off('chat_history');
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setPickerVisible(!isPickerVisible);
      }
    };

    if (isPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerVisible]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');

    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) return;

    const mediaUrl = URL.createObjectURL(file);
    const formData = new FormData();

    let abc = isVideo ? 'videos' : 'images';

    formData.append(abc, file);

    const response = await GET_UPLOAD_DOCUMENT_LINK(
      apiRoutes.GET_UPLOAD_DOCUMENT_LINK,
      formData
    );

    setImage(mediaUrl);
    dispatch(VisiblityPreviewImage(true));
    dispatch(
      UploadDocument({
        file: isVideo ? response.data.videos[0] : response.data.images[0],
        fileType: isVideo ? 'video' : 'image',
      })
    );
  };

  return (
    <>
      <form action="" onSubmit={handleSendMessage}>
        <div
          className={`h-[10vh] w-full flex justify-center items-center ${darkMode ? 'bg-slate-900' : 'bg-gray-200'}  `}
          ref={modalRef}
        >
          {isPickerVisible && (
            <div className="absolute bottom-20 md:bottom-32 lg:bottom-20 ">
              <Picker
                data={data}
                previewPosition="none"
                onEmojiSelect={(e) => {
                  // setCurrentEmoji(e.native);
                  setMessage(message + e.native);
                }}
              />
            </div>
          )}
          <div
            action=""
            className={`w-[90%] md:w-[80%] lg:w-[70%]  flex justify-between items-center ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-full shadow`}
          >
            <button
              className={`${darkMode ? 'bg-slate-700 hover:bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-300'} rounded-full  p-2 mx-1`}
              onClick={() => setPickerVisible(!isPickerVisible)}
              type="button"
            >
              <MdOutlineEmojiEmotions className="text-2xl" />
            </button>

            <div className="w-[90%] ml-0 mr-2 my-2 ">
              <input
                type="text"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                className={`outline-none py-1 px-2 rounded w-full bg-transparent`}
              />
            </div>
            {loading ? (
              <span className="flex items-center justify-center bg-blue-600 text-white rounded-full p-2 mx-1">
                <span className="loading loading-spinner"></span>
              </span>
            ) : (
              <>
                <div className="relative">
                  <button
                    ref={btnRef}
                    className="p-2 me-5"
                    onClick={() => setOpen(!open)}
                  >
                    <FaPlus className="text-2xl" />
                  </button>
                </div>

                <button
                  className={`${message == '' ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-800'}  rounded-full text-white p-2 mx-1`}
                  onClick={handleSendMessage}
                  disabled={message === ''}
                >
                  <IoMdSend className="text-2xl" />
                </button>
              </>
            )}
          </div>
        </div>
      </form>
      <Pophover
        customClass={' right-[5.25rem]  bottom-[2.25rem]'}
        setOpen={setOpen}
        open={open}
        body={
          <>
            <li
              className="px-3 flex items-center py-1"
              onClick={() => fileInputRef.current.click()}
            >
              <IoImagesOutline />
              <span className="mx-2 rounded-md">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageUpload(e);
                  setOpen(false);
                }}
                ref={fileInputRef}
                className="hidden"
              />
            </li>

            <li
              className="px-3 flex items-center py-1"
              onClick={() => VideofileInputRef.current.click()}
            >
              <IoVideocamOutline />
              <span className="mx-2 rounded-md">Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  handleImageUpload(e);
                  setOpen(false);
                }}
                ref={VideofileInputRef}
                className="hidden"
              />
            </li>
            {/* <li
                className="px-3 flex items-center  py-1"
                // onClick={() => setOpenModal(!OpenModal)}
              >
                <MdSpatialAudioOff />
                <span className="mx-2 rounded-md">Audio</span>
              </li> */}
          </>
        }
      />

      <Toaster />
    </>
  );
};

export default MessageSend;

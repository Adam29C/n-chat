import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import smoothscroll from 'smoothscroll-polyfill';
import { FaChevronDown, FaCircleNotch } from 'react-icons/fa';
import Pophover from '../../HelpersComponents/Pophover';
import {
  GetSocketRemoveMessage,
  GetSOketChatHistory,
  SocketIntiate,
} from '../../../utils/Socket.Io';
import { setMessage } from '../../../Redux/features/message/messageSlice';
import DialogBox from '../../HelpersComponents/DialogBox';
import { MdOutlineMessage } from 'react-icons/md';
import Search from '../Sidebar/Search';
import SingleUser from '../Sidebar/SingleUser';
import {
  VisiblityReplay,
  ManageReplayDetails,
} from '../../../Redux/features/user/userSlice';
import { FiMessageCircle } from 'react-icons/fi';

const SingleMessage = ({ data, setShowReplayBox }) => {
  const { _id, email, mobile, name, role } = JSON.parse(
    localStorage.getItem('info')
  );

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [OpenModal, setOpenModal] = useState(false);

  const darkMode = useSelector((state) => state.darkTheme.value);
  const authUser = useSelector((state) => state.user);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const otherUsers = useSelector((state) => state.user.otherUsers);
  const details = useSelector((state) => state.user.details);

  const scroll = useRef();
  const [hover, setHover] = useState(false);

  // const msgDate = new Date(data.dateTimestamp * 1000);

  const createdAt = new Date(data.createTime);
  const formatedTime = createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // console.log("formatedTime" ,createdAt);

  useEffect(() => {
    //  / scroll.current?.scrollIntoView({ behavior: 'smooth' });
    // setTimeout(() => {
    //   if (scroll.current) {
    //     window.scrollTo({
    //       top: scroll.current.offsetTop,
    //       behavior: 'smooth', // Smooth scrolling
    //     });
    //   }
    // }, 100); // Delay to allow the DOM to fully render
  }, []);

  const ShowHiddenTabs = () => {
    setOpen(!open);
  };

  const DeleteMessages = async () => {
    await GetSocketRemoveMessage(selectedUser, _id, data, (response) => {});
    // setOpenModal(!OpenModal);
    if (window.confirm('Do You Really Want To Remove This')) {
      setTimeout(async () => {
        GetSOketChatHistory(selectedUser, _id, async (response12) => {
          dispatch(setMessage(response12));
        });
      }, 1000);
      setOpen(!open);
    }
  };

  const showSoftDeletedMessage = (message) => {
    if (data.deletedFor.includes(selectedUser._id)) {
      return 'This Message Was Deleted';
    }
    return message;
  };

  const manageReplay = () => {
    dispatch(
      ManageReplayDetails({
        message: data?.message,
        username: selectedUser.userName,
      })
    );
    dispatch(VisiblityReplay(true));
  };

  const isDeletedForUser = data.deletedFor.includes(selectedUser._id);

  return (
    <div ref={scroll}>
      <Pophover
        customClass={_id === data.sender ? ' top-5  right-5' : ' left-5 top-5'}
        setOpen={setOpen}
        open={open}
        body={
          <>
            {_id === data.sender && (
              <li className="px-3 py-1" onClick={() => DeleteMessages(data)}>
                Delete
              </li>
            )}
            <li className="px-3 py-1" onClick={() => manageReplay()}>
              Reply
            </li>
            <li className="px-3 py-1" onClick={() => setOpenModal(!OpenModal)}>
              Forword
            </li>
          </>
        }
      />

      <div
        className={`chat  ${_id === data.sender ? 'chat-end ' : 'chat-start'}`}
      >
        {!data?.replyMessage ? (
          <>
            <div
              className={`max-w-[50%] chat-bubble relative px-4 py-2 flex items-center gap-2 shadow-md transition duration-200 
  ${'isSender' == 'isSender' ? 'bg-blue-500 text-white' : darkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <span className="flex-grow w-full">
                <div className="flex justify-end">
                  {hover && (
                    <FaChevronDown
                      onClick={ShowHiddenTabs}
                      className="opacity-100 right-0 transition-opacity duration-[2000ms] ease-in-out"
                    />
                  )}
                </div>
                {/* {console.log('data.images.length',  data.images[0] == '')}// */}
                { data.images[0] == ''  ? (
                  <span className="break-words whitespace-pre-wrap w-full max-w-full overflow-hidden ">
                    {showSoftDeletedMessage(data?.message)}
                  </span>
                ) : (
                  <img src={data.images[0]} alt="" height={20} width={200} />
                )} 
              </span>
            </div>
            <div className="chat-footer text-xs text-gray-500">
              {formatedTime}
            </div>
          </>
        ) : (
          !isDeletedForUser && (
            <>
              <div
                className="chat-bubble bg-blue-500 relative px-4 py-2 flex items-center gap-2 shadow-md transition duration-2000"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <span className="flex-grow">
                  <div className="chat-bubble border-l-2 bg-blue-700 border-indigo-500 text-left flex flex-col shadow-md transition duration-2000">
                    <span className="text-stone-950 text-xs">
                      {details?.username}
                    </span>

                    <span className="flex-grow">
                      <div className="flex justify-between">
                        {hover && (
                          <FaChevronDown
                            onClick={ShowHiddenTabs}
                            className="opacity-100 transition-opacity duration-[500ms] ease-in-out"
                          />
                        )}
                      </div>
                      <span className=" ">
                        {/* {showSoftDeletedMessage(data?.message)} */}
                      </span>
                    </span>
                    <span className="text-sm">
                      <img src={data?.images[0]} alt="" />
                      <span className="">
                        {showSoftDeletedMessage(data?.replyMessage)}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs">
                    {showSoftDeletedMessage(data?.message)}
                  </span>
                </span>
                {hover && (
                  <FaChevronDown
                    onClick={ShowHiddenTabs}
                    className="opacity-100 transition-opacity duration-[5000ms] ease-in-out"
                  />
                )}
              </div>
              <div className="chat-footer text-xs text-gray-500">
                {formatedTime}
              </div>
            </>
          )
        )}
      </div>

      <DialogBox
        // Modal_width={'65rem'}
        Modal_width={'40rem'}
        modal_id="my_modal_4"
        title={'Forword Message'}
        OpenModal={OpenModal}
        setOpenModal={setOpenModal}
        body={
          <>
            <Search />
            <div
              className={` overflow-y-auto hide_scrollbar px-3 max-h-[73vh] md:max-h-[78vh] lg:max-h-[72vh] ${false ? '' : darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}
            >
              {otherUsers?.map((item, index) => (
                <SingleUser data={item} key={index} />
              ))}
            </div>
          </>
        }
      />
    </div>
  );
};

export default SingleMessage;

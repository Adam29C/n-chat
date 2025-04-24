import { useDispatch, useSelector } from 'react-redux';
import AllUserLoader from '../../Loader/AllUserLoader';
import SingleUser from './SingleUser';
import { useEffect, useRef, useState, useCallback } from 'react';
import { GET_ALL_USERS_URI_API } from '../../../services/users.service';
import {
  newUpdatedUsers,
  setOtherUsers,
} from '../../../Redux/features/user/userSlice';
import socketIOClient from 'socket.io-client';
import { base_url } from '../../../utils/api_config';
import socket from '../../../utils/Socket';

const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.darkTheme.value);
  const otherUsers = useSelector((state) => state.user.otherUsers);

  let abc = 1;
  useEffect(() => {
    socket.on('update_user_list_entry', (updatedUser) => {
      const updatedList = otherUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
      dispatch(setOtherUsers(updatedList));
    });

    return () => {
      socket.off('update_user_list_entry');
    };
  }, [otherUsers]);

  const fetchData = useCallback(() => {
    if (!hasMore || loading || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    socket.emit('get_user_list', { page: page, limit: 10, search: '' });

    const handleUserList = (data) => {
      const newData = data.users || [];
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        dispatch(setOtherUsers([...otherUsers, ...newData]));
        setPage(data.page + 1);
      }

      setLoading(false);
      isFetchingRef.current = false;

      // cleanup handler
      socket.off('user_list', handleUserList);
    };

    socket.on('user_list', handleUserList);
  }, [page, hasMore, loading, otherUsers, dispatch]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchData();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchData, hasMore, loading]);
  return (
    <>
      <div
        className={`overflow-y-auto bg-slate-100 hide_scrollbar px-3 max-h-[83vh] md:max-h-[86vh] lg:max-h-[85vh] ${
          darkMode ? 'bg-slate-950' : 'bg-slate-100'
        }`}
      >
        {otherUsers?.map((item, index) => (
          <SingleUser data={item} key={item._id || index} abc={abc} />
        ))}

        <div
          ref={observerRef}
          style={{ height: '10px', background: 'transparent' }}
        ></div>

        {loading && (
          <>
            <AllUserLoader />
            <AllUserLoader />
            <AllUserLoader />
          </>
        )}
      </div>

      {otherUsers?.length === 0 && !loading && (
        <div className="w-full h-36 flex justify-center items-center">
          <p>No user found</p>
        </div>
      )}
    </>
  );
};

export default AllUsers;

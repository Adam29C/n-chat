// import { useDispatch, useSelector } from 'react-redux';
// import AllUserLoader from '../../Loader/AllUserLoader';
// import SingleUser from './SingleUser';
// import { useEffect, useRef, useState } from 'react';
// import { GetAllUserData } from '../../../utils/userApiCall';
// import { List } from 'react-virtualized';
// import { setOtherUsers } from '../../../Redux/features/user/userSlice';
// import AIButton from '../Ai/AIButton';
// import { GET_ALL_USERS_URI_API } from '../../../services/users.service';
// import socketIOClient from 'socket.io-client';
// import { base_url } from '../../../utils/api_config';
// import { formatWhatsAppDate } from '../../../helpers/helpers';

// const AllUsers = () => {
//   // const socket = socketIOClient(base_url);

//   // socket.emit('connection', 'Hello World');

//   // socket.on('connection', (data) => {
//   //   console.log('connection', data);
//   // });

//   const [data, setData] = useState([]); // API data store karega

//   console.log('data', data);

//   const [page, setPage] = useState(1); // Current page track karega
//   const [hasMore, setHasMore] = useState(true);

//   const [loading, setLoading] = useState(false);
//   const darkMode = useSelector((state) => state.darkTheme.value);
//   const otherUsers = useSelector((state) => state.user.otherUsers);
//   const dispatch = useDispatch();
//   const getAllUser = async () => {
//     setLoading(true);

//     const res = await GET_ALL_USERS_URI_API();
//     setLoading(false);
//     if (res?.status == 'error') {
//       dispatch(setOtherUsers([]));
//     } else {
//       dispatch(setOtherUsers(res?.data.users));
//     }
//   };

//   useEffect(() => {
//     // getAllUser();
//   }, []);

//   const observerRef = useRef(null);

//   // 📌 API se data fetch karna
//   const fetchData = async () => {
//     if (!hasMore || loading) return;
//     setLoading(true);

//     try {
//       const response = await GET_ALL_USERS_URI_API(page && page);

//       const newData = response.data.users;

//       setLoading(false);
//       if (response?.status == 'error') {
//         dispatch(setOtherUsers([]));
//       } else {
//         dispatch(setOtherUsers(response?.data.users));
//       }

//       if (newData.length === 0) {
//         setHasMore(false);
//       } else {
//         console.log('sdsddssdssds');

//         setData((prev) => [...prev, ...newData]);
//         setPage((prev) => prev + 1);
//       }
//     } catch (error) {
//       console.error('Error fetching data', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (loading) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           console.log('Sdsdsdds');

//           fetchData();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (observerRef.current) observer.observe(observerRef.current);

//     return () => {
//       if (observerRef.current) observer.unobserve(observerRef.current);
//     };
//   }, [loading, hasMore]);

//   console.log('observerRef', observerRef);

//   return (
//     <>
//       {/* <h1
//         className={`px-4 py-2 text-lg bold border-ts border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} `}
//       >
//         Chats
//       </h1> */}
//       <div
//         className={` overflow-y-auto hide_scrollbar px-3 max-h-[73vh] md:max-h-[78vh] lg:max-h-[72vh] ${false ? '' : darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}
//       >
//         {otherUsers?.map((item, index) => (
//           <SingleUser data={item} key={index} />
//         ))}
//         {/* {loading ? (
//           <>
//             <AllUserLoader />
//             <AllUserLoader />
//             <AllUserLoader />
//             <AllUserLoader />
//             <AllUserLoader />
//             <div className="hidden md:block lg:hidden">
//               <AllUserLoader />
//               <AllUserLoader />
//               <AllUserLoader />
//             </div>
//           </>
//         ) : (
//           <>
//             {otherUsers?.map((item, index) => (
//               <SingleUser data={item} key={index} />
//             ))}
//             <List
//               width={300}
//               height={300}
//               rowCount={list.length}
//               rowHeight={20}
//               rowRenderer={rowRenderer}
//             />
//           </>
//         )} */}
//       </div>
//       {/* </div> */}
//       {otherUsers?.length == 0 && (
//         <div className="w-full h-36 flex justify-center items-center ">
//           <p>No user found</p>
//         </div>
//       )}

//       <div
//         ref={observerRef}
//         style={{ height: '20px', background: 'transparent' }}
//       ></div>
//     </>
//   );
// };

// export default AllUsers;

import { useDispatch, useSelector } from 'react-redux';
import AllUserLoader from '../../Loader/AllUserLoader';
import SingleUser from './SingleUser';
import { useEffect, useRef, useState, useCallback } from 'react';
import { GET_ALL_USERS_URI_API } from '../../../services/users.service';
import { setOtherUsers } from '../../../Redux/features/user/userSlice';

const AllUsers = () => {
  const [data, setData] = useState([]); // Store API data
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkTheme.value);
  const otherUsers = useSelector((state) => state.user.otherUsers);

  let isFetching = false; // Prevent duplicate calls

  const fetchData = useCallback(async () => {
    if (!hasMore || loading || isFetching) return;

    isFetching = true;
    setLoading(true);

    try {
      const response = await GET_ALL_USERS_URI_API(page);

      const newData = response?.data?.users || [];
      if (response?.status === 'error' || newData.length === 0) {
        setHasMore(false);
      } else {
        // setData((prev) => [...prev, ...newData]);
        dispatch(setOtherUsers([...otherUsers, ...newData]));
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      isFetching = false;
    }
  }, [page, hasMore, loading]);

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

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchData, hasMore]);

  return (
    <>
      <div
        className={`  overflow-y-auto bg-slate-100 hide_scrollbar px-3 max-h-[83vh] md:max-h-[86vh] lg:max-h-[72vh] ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}
      >
        {otherUsers?.map((item, index) => (
          <SingleUser data={item} key={index} />
        ))}

        <div
          ref={observerRef}
          style={{ height: '10px', background: 'transparent' }}
        ></div>
        {/* {loading && (
          <>
            <AllUserLoader />
            <AllUserLoader />
            <AllUserLoader />
          </>
        )} */}
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

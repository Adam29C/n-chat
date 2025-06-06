import React from 'react';
import Search from './Search';
import AllUsers from './AllUsers';
import ProfileHeader from './ProfileHeader';
import { useSelector } from 'react-redux';
// import Logout from "./Logout";

const Sidebar = () => {
  const showSelectedUserBtn = useSelector(
    (state) => state.showSelectedBtn.value
  );
  const selectAi = useSelector((state) => state.ai.selectAi);
  const darkMode = useSelector((state) => state.darkTheme.value);
  return (
    <>
      <div
        className={` test-color   bg-slate-100 w-[100%] ${selectAi ? 'hidden' : showSelectedUserBtn ? 'hidden' : 'inline-block'}   md:inline-block md:w-[40%] lg:w-[30%] ${darkMode ? 'shadow-none ' : 'shadow-2xl  shadow-gray-300'} `}
      >
        <ProfileHeader />

        <div className="testing-ui">
          <Search />
          <AllUsers />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

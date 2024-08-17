/* eslint-disable react/prop-types */
import { getInitials } from "../../utils/helper";
const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) {
    return null; // or show a loading spinner
  }
  return (
    <>
      <div className='flex justify-between gap-4 sm:gap-3 sm:flex sm:items-center sm:justify-center'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
          {getInitials(userInfo.name)}
        </div>
        <div>
          <p className='text-sm font-medium'>{userInfo.name}</p>
          <button
            className='text-sm text-slate-700 underline'
            onClick={onLogout}
          >
            LogOut
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;

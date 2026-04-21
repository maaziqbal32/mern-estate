import { useSelector } from "react-redux"

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser?.avatar} alt="profile" className='w-32 h-32 rounded-full object-cover cursor-pointer self-center mx-auto mb-5' />
        <input id="username" type="text" placeholder='username' className='border border-gray-300 rounded-lg p-3' />
        <input id="email" type="email" placeholder='email' className='border border-gray-300 rounded-lg p-3' />
        <input id="password" type="password" placeholder='password' className='border border-gray-300 rounded-lg p-3' />
        <button className="uppercase p-3 bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 text-white" >update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 hover:underline cursor-pointer" >
           Delete Account
        </span>
        <span className="text-red-700 hover:underline cursor-pointer" >
           Sign Out
        </span>
      </div>
    </div>
  )
}

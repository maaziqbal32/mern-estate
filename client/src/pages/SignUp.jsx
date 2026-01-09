import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center py-7 font-semibold">Sign Up</h1>
      <form className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-3 rounded-lg w-full"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg w-full "
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 rounded-lg w-full"
          id="password"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg w-full uppercase hover:opacity-95 cursor-pointer disabled:opacity-80"
        >
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-5">
         <p>Have an Account?</p>
         <Link to="/sign-in">
            <span className="text-blue-700 border-b hover:text-blue-950">Sign in </span>
         </Link>
      </div>
    </div>
  );
}

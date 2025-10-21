import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between mx-auto max-w-6xl items-center p-3'>
                <Link to="/">
                    <h1 className='font-bold text-lg sm:text-xl'>
                        <span className='text-slate-500'> Empire </span>
                        <span className='text-slate-700'> Estate</span>
                    </h1>
                </Link>
                <form className='bg-slate-100 flex items-center gap-2 px-3 py-2 rounded-lg'>
                    <input type="text" placeholder='Search...' className='bg-transparent w-24 sm:w-64 focus:outline-none' />
                    <FaSearch className='text-slate-500' />
                </form>
                <ul className='flex gap-6'>
                 <Link to='/'><li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li></Link>
                 <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>About</li></Link>
                 <Link to='/sign-in'><li className='text-slate-700 hover:underline cursor-pointer'>Sign in</li></Link>
                </ul>
            </div>
        </header>

    );
};

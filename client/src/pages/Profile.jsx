import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react";
import { getStorage, ref } from "firebase/storage";
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const [updateUser , setUpdateUser] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      }
    );
    (error) => {
      setFileUploadError(true);
    };
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({ ...formData, avatar: downloadURL });
      });
    }

  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateUser(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={currentUser?.avatar} alt="profile" className='w-32 h-32 rounded-full object-cover cursor-pointer self-center mx-auto mb-5' />
        <p>
          {fileUploadError ?
            <span className="text-red-700">Error uploading file. Please try again.</span>
            : filePerc > 0 && filePerc < 100 ?
              <span className="text-blue-700">Uploading: {filePerc}%</span>
              : filePerc === 100 && <span className="text-green-700">Upload complete!</span>
          }
        </p>
        <input id="username"
          onChange={handleChange}
          defaultValue={currentUser.username} type="text" placeholder='username' className='border border-gray-300 rounded-lg p-3' />
        <input id="email"
          onChange={handleChange}
          defaultValue={currentUser.email} type="email" placeholder='email' className='border border-gray-300 rounded-lg p-3' />
        <input
          onChange={handleChange}
          id="password" type="password" placeholder='password' className='border border-gray-300 rounded-lg p-3' />
        <button
          disabled={loading}
          className="uppercase p-3 bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 text-white" >
          {loading ? 'Updating..' : 'update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 hover:underline cursor-pointer" >
          Delete Account
        </span>
        <span className="text-red-700 hover:underline cursor-pointer" >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-2">{error ? error : ''}</p>
      <p className="text-green-700">{updateUser ? 'User updated Successfully' : ''}</p>
    </div>
  )
}

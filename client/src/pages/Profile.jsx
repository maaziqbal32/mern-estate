import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react";
import { getStorage, ref } from "firebase/storage";

export default function Profile() {
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const { currentUser } = useSelector((state) => state.user);
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
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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

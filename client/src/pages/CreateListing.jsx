import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';

function CreateListing() {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uplaoding, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imgUrls: [],
    });

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imgUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            
            }).catch((err) => {
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
            })
        }else{
            setImageUploadError('You can upload a maximum of 6 images for per listing ');
            setUploading(false);
        }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
         setFormData({
            ...formData,
            imgUrls: formData.imgUrls.filter((_, i) => i !== index)
         })
    }
    return (
        <main className='max-w-4xl p-3 mx-auto'>
            <h1 className="text-3xl text-center mt-4 font-semibold mb-5">Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                {/* left side */}
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='w-full p-3 bg-white rounded-lg border border-gray-300 '
                        maxLength='62' minLength='10' id='name' required />
                    <textarea placeholder='Description' className='w-full p-3 bg-white rounded-lg border border-gray-300 '
                        id='description' required ></textarea>
                    <input type="text" placeholder='Address' className='w-full p-3 bg-white rounded-lg border border-gray-300 '
                        id='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2 align-center'>
                            <input type='checkbox' id='sale' className='w-5' />
                            <span>sell</span>
                        </div>
                        <div className='flex gap-2 align-center'>
                            <input type='checkbox' id='rent' className='w-5' />
                            <span>rent</span>
                        </div>
                        <div className='flex gap-2 align-center'>
                            <input type='checkbox' id='parking' className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2 align-center'>
                            <input type='checkbox' id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2 align-center'>
                            <input type='checkbox' id='offer' className='w-5' />
                            <span>offer</span>
                        </div>
                    </div>
                    {/* inputs with the numbers */}
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex items-center gap-2 '>
                            <input placeholder='0' type="number" id="bedrooms" min='1' max='10'
                                required id='price' required className='border border-gray-200 p-3 rounded-lg bg-white' />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2 '>
                            <input placeholder='0' type="number" id="bathrooms" min='1' max='10'
                                required id='price' required className='border border-gray-200 p-3 rounded-lg bg-white' />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2 '>
                            <input placeholder='0' type="number" id="regularPrice" min='1' max='10'
                                required id='price' required className='border border-gray-200 p-3 rounded-lg bg-white' />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className=' flex items-center gap-2 '>
                            <input placeholder='0' type="number" id="discountPrice" min='1' max='10'
                                required id='price' required className='border border-gray-200 p-3 rounded-lg bg-white' />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price </p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className='flex flex-col flex-1 gap-2'>
                    <p className='font-semibold'>Images:</p>
                    <span className='text-gray-600 text-normal ml-2'>The first image will be the cover (max 6)</span>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} type="file" id='images' accept='image/*' multiple required className='w-full p-3 bg-white rounded border border-gray-300 mt-2' />
                        <button disabled={uplaoding} onClick={handleImageSubmit} type='button' className='uppercase p-3 border border-green-700 text-green-700 rounded hover:shadow-xl cursor-pointer disabled:opacity-80' >
                            {uplaoding ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {imageUploadError && <p className='text-red-500 text-sm mt-1'>{imageUploadError}</p>}
                    {formData.imgUrls.length > 0 && formData.imgUrls.map((url , index)=>{
                       <div key={url} className='flex justify-between p-3 border items-center'>
                           <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded lg' />
                           <button type='buttton' onClick={() => handleRemoveImage(index)}>Delete</button>
                       </div>
                    })
                    }
                    <button className='p-3 bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 rounded-lg cursor-pointer mt-4 uppercase' >
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing;
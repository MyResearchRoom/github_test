import React, { useState } from 'react'
import { myImg } from '../assets/Images';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../commonComponent/Button';

const CreatePassword = () => {

    const[showPassword, setShowPassword] = useState(false);
    const[showConfirmPassword, setShowConfirmPassword] = useState (false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    const handleReset = (e) => {
        e.preventDefault()
    
        if(!password){
            toast.error("Password is required");
            return ;
        }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
    toast.error("Password must be at least 8 characters long and include at least one letter, one digit, and one special character.");
    return false;
  }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    toast.success("Password successfully reset!");
};

  return (
    <div className='relative w-full h-screen bg-white rounded-lg'>
        <img src={myImg.bgImage} alt='bgimage' className='w-full h-full'/>
          <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center text-[#4d5959]'>
            <div className='mt-20 space-y-6 text-[#043133] lg:w-[50%] sm:w-[80%] flex flex-col items-center'>
            <h1 className='text-center text-2xl font-semibold mb-10'>Create New Password</h1>
            
            {/* New Password */}
            <div className='space-y-1 flex flex-col w-[60%] '>
              <label className='font-semibold'>New Password:</label>
              <div className='relative'>
                <input
                 type={showPassword ? 'text' : 'password'}
                 placeholder='Enter New Password'
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className='p-2 w-[100%] bg-gray-100 outline-none'
                 />
                 {/* Eye Icon */}
                 <span
                 className='absolute top-3 right-6 cursor-pointer'
                 onClick={togglePasswordVisibility}
                 >
                    {showPassword ? <IoEyeOffOutline size={20}/> : <IoEyeOutline size={20}/>}
                 </span>
              </div>
            </div>
             
             {/* Confirm Password */}
             <div className='space-y-1 flex flex-col w-[60%]'>
             <label className='font-semibold'>Confirm Password:</label>
             <div className='relative'>
             <input
             type={showConfirmPassword ? 'text' : 'password'}
             placeholder='Re-enter New Password'
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             className='w-[100%] p-2  bg-gray-100 outline-none'
             /> 
             {/* Eye Icon */}
             <span
             className='absolute top-3 right-6 cursor-pointer'
             onClick={toggleConfirmPasswordVisibility}
             >
                {showConfirmPassword ? <IoEyeOffOutline size={20}/> : <IoEyeOutline size={20}/>}
             </span>
             </div>
             <p className='mt-2 text-[15px]'>Both Password must match.</p>
             </div>
             {/* Button */}
             <Button onClick={handleReset} className='p-2 text-[15px] font-semibold rounded-none w-[200px] text-white bg-[#835AA6]'>Reset Password</Button>
            </div>
          </div>
    </div>
  )
}

export default CreatePassword
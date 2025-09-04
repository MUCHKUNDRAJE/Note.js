import React from 'react'
import axios from 'axios'
import { motion } from "framer-motion"

type DeleteIdType = {
  id: string;
  title: string;
};

type TosterProps = {
  setDeletepopup: React.Dispatch<React.SetStateAction<boolean>>;
  Deleteid: DeleteIdType;
};

function Toster({ setDeletepopup, Deleteid }: TosterProps) {
  const ENV = "http://localhost:5000/api/tasks";

  const handledelete = () => {
    axios.delete(`${ENV}/deletetask/${Deleteid.id}`).then(() => {
      setDeletepopup(false)
    }).catch((err) => {
      console.error(err)
    })

    window.electronAPI.showNotification(
      "Note Deleted Successfully",
      `The note with Title "${Deleteid.title}" has been removed from your records.`,
    );
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ opacity: 0 }}
      className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-50 z-50 flex-col flex items-center justify-center w-[80%] p-3 bg-neutral-800'>
      <h1 className='Interbold'>Update</h1>
      <h1 className='text-xl'>
        Are you sure you want to Delete the Note "{Deleteid.title}"
      </h1>

      <div className=' w-full flex items-center justify-center gap-30 mt-10 '>
        <button onClick={handledelete} className='px-10 py-2  border-[0.4px] rounded hover:bg-white hover:text-black'>
          Yes
        </button>
        <button onClick={() => setDeletepopup(false)} className='px-10 py-2  border-[0.4px] rounded hover:bg-white hover:text-black'>
          No
        </button>
      </div>
    </motion.div>
  )
}

export default Toster
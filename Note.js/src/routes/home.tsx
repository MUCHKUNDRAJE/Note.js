import React, { useEffect } from 'react'
import { RiAddBoxFill, RiAddFill, RiChat1Fill, RiFileTextFill, RiFolder6Fill, RiMessage3Fill, RiPulseLine, RiSurgicalMaskLine } from '@remixicon/react'
import { useState } from 'react'
import { Reorder } from "motion/react"
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");




function Home() {
    const [items, setItems] = useState([])
    const [NewDoc, setNewDoc] = useState(String);
      const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/gettask")
            .then((response) => {
                setItems(response.data);
                console.log(items)
            })
            .catch((err) => console.log(err));
    
        // Listen for real-time updates from backend
        socket.on("tasksUpdated", (updatedTasks) => {
            setItems((prevItems) => {
                // Preserve the order by mapping previous items with new ones
                const prevMap = new Map(prevItems.map(item => [item.id, item]));
                return updatedTasks.map(task => prevMap.get(task.id) || task);
            });
        });
    
        return () => {
            socket.off("tasksUpdated"); // Cleanup on component unmount
        };
    }, []);
    
    const CreatenewDoc = (e:any) => {
        e.preventDefault();
       axios.post("http://localhost:5000/Createtask",{
           task_title: NewDoc,
       })
       .then((response)=>{
          console.log(response.data)
       })
       .catch((err:string) => console.log(err));  
    }

   
  return (
    <div id="Home"  className='h-screen w-full p-10 '>
     <h1  className='text-5xl mb-2 flex items-center justify-content gap-2'><RiFolder6Fill size={36}/> Docs</h1>
     <div className='w-full h-[0.2px] bg-zinc-700 rouned-xl'></div>

     <div className='min-h-96 w-full mt-2 flex flex-col gap-1'>


       <div   className='h-8 w-full transition-all duration-100 cursor-pointer flex items-center justify-between px-2 border-b-[0.2px] border-zinc-800'>
          
          <div className='flex items-center justify-center gap-2'>
            <RiAddFill size={20}/>
              <input 
              type="text"
              value={NewDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              placeholder='New Doc' className='outline-none w-[70vw] ' />
          </div>
             <button onClick={CreatenewDoc} className='bg-zinc-800 px-2 flex rounded-lg py-0.5 text-xs items-center justify-center hover:bg-[#435BEB] transition-all duration-100 cursor-pointer'> <RiAddFill size={20}/> Add</button>
        
        </div> 
     
     <Reorder.Group axis="y" values={items} onReorder={setItems}>
    {items.map((item) => (
      <Reorder.Item key={item.id} value={item}>
        <div onClick={() => navigate(`/task/${item.id}`)}  className='h-8 w-full hover:bg-[#435BEB] transition-all duration-100 cursor-pointer flex items-center justify-between px-2 border-b-[0.2px] border-zinc-800'>
          <div className='flex items-center justify-content gap-1'>
            <RiFileTextFill size={20}/>
            <h3>{item.task_title}</h3>
            <RiMessage3Fill className='opacity-50' size={15}/>
          </div>
          <div className='text-xs'><p>12 Mar 2025 3:30pm</p></div>
        </div>
      </Reorder.Item>
    ))}
</Reorder.Group>


        

     </div>

    </div>
  )
}

export default Home
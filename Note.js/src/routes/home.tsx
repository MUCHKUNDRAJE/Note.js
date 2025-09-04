import React, { useEffect } from "react";
import {

  RiAddFill,
 
  RiDeleteBinFill,
  RiFileTextFill,
  RiFolder6Fill,
  RiMessage3Fill,
 
} from "@remixicon/react";
import { useState } from "react";
import { Reorder } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Toster from "../components/toster";
import { AnimatePresence } from "framer-motion";
import Loader from "../components/loader";
const socket = io("http://localhost:5000");

const ENV = "http://localhost:5000/api/tasks";

type Task = {
  id: string;
  task_title: string;
  // add other fields if needed
};

type DeleteId = {
  id: string | null ;
  title: string;
};


function Home() {
  const [items, setItems] = useState<Task[]>([]);
  const [deletepopup, setDeletepopup] = useState<boolean>(false);

  const [deleteid, setDeleteid] = useState<DeleteId>({ id:null , title: "" });
  const [NewDoc, setNewDoc] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${ENV}/gettask`)
      .then((response) => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));

    // Listen for real-time updates from backend
    socket.on("tasksUpdated", (updatedTasks: Task[]) => {
      setItems((prevItems) => {
        // Preserve the order by mapping previous items with new ones
        const prevMap = new Map(prevItems.map((item) => [item.id, item]));
        return updatedTasks.map((task) => prevMap.get(task.id) || task);
      });
    });

    return () => {
      socket.off("tasksUpdated"); // Cleanup on component unmount
    };
  }, []);

  const CreatenewDoc = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios
      .post(`${ENV}/Createtask`, {
        task_title: NewDoc,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err: string) => console.log(err));

    window.electronAPI.showNotification(
      "Note Added Successfully",
      `The note has been added from your records.`,
   
    );
  };

  const handledelect = (id: string, task_title: string) => {
    setDeletepopup(true);
    setDeleteid({ id, title: task_title });
  };

  return (
    <>
      <AnimatePresence>
        {deletepopup && (
       <Toster setDeletepopup={setDeletepopup} Deleteid={{ ...deleteid, id: deleteid.id ?? "" }} />

        )}

        {items.length == 0 && <Loader />}
      </AnimatePresence>
      <div id="Home" className="h-screen w-full p-10 ">
        <h1 className="text-5xl mb-2 flex items-center justify-content gap-2">
          <RiFolder6Fill size={36} /> Docs
        </h1>
        <div className="w-full h-[0.2px] bg-zinc-700 rouned-xl"></div>

        <div className="min-h-96 w-full mt-2 flex flex-col gap-1">
          <div className="h-8 w-full transition-all duration-100 cursor-pointer flex items-center justify-between px-2 border-b-[0.2px] border-zinc-800">
            <div className="flex items-center justify-center gap-2">
              <RiAddFill size={20} />
              <input
                type="text"
                value={NewDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                placeholder="New Doc"
                className="outline-none w-[70vw] "
              />
            </div>
            <button
              onClick={CreatenewDoc}
              className="bg-zinc-800 px-2 flex rounded-lg py-0.5 text-xs items-center justify-center hover:bg-[#435BEB] transition-all duration-100 cursor-pointer"
            >
              {" "}
              <RiAddFill size={20} /> Add
            </button>
          </div>

          <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="group flex hover:bg-[#435BEB]">
                  <div
                    onClick={() => navigate(`/task/${item.id}`)}
                    className="h-8 w-full  transition-all duration-100 cursor-pointer flex items-center justify-between px-2 border-b-[0.2px] border-zinc-800"
                  >
                    <div className="flex items-center justify-content gap-1">
                      <RiFileTextFill size={20} />
                      <h3>{item.task_title}</h3>
                      <RiMessage3Fill className="opacity-50" size={15} />
                    </div>
                    <div className="text-xs">
                    
<p>
  {item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      new Date(item.createdAt)
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace("AM", "am")
        .replace("PM", "pm")
         .replace(" ", "")
    : "No date"}
</p>


                      
                       
                      
                    </div>
                  </div>
                  <div
                    onClick={() => handledelect(item.id, item.task_title)}
                    className="transition-all duration-100 flex items-center justify-center  border-b-[0.2px] border-zinc-800 "
                  >
                    <RiDeleteBinFill className="text-white hover:text-red-600  scale-75" />
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </>
  );
}

export default Home;

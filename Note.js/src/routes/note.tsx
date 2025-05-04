  import { Link } from "react-router-dom";
  import { useParams } from "react-router-dom";
  import { useState, useEffect, useRef } from "react";
  import jsPDF from "jspdf"
  import html2canvas from "html2canvas";
  import axios from "axios";
  import {
    RiArrowLeftCircleLine,
    RiArrowRightDoubleLine,
    RiBold,
    RiDownload2Fill,
    RiFileTextFill,
    RiH1,
    RiItalic,
    RiListCheck,
    RiUnderline,
  } from "@remixicon/react";
  import io from "socket.io-client";
  import Gimine from "../components/Gimine";
  

  const socket = io("http://localhost:5000");

  function Note() {
    const { id } = useParams(); // Get task ID from URL
    const [userid, setuserid] = useState(id);
    const editorRef = useRef(null);
    const [task, setTask] = useState(null);
    const [Content, setContent] = useState();
  
   
    const DownloadPDf =()=>{
      const content = document.getElementById("textableArea");
      const Title = document.getElementById("Title");
      const originalColor = content.style.color;
      const originalPadding = content.style.padding;
     
      content.style.color = "black";
      content.style.padding = "20px";
    

      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
        pdf.save("document.pdf"); // Download the PDF

        content.style.color = originalColor;
        
        content.style.padding = originalPadding;
      });


    }
 


    const handleTextInBox = (e: any) => {
      var content = e.currentTarget.innerHTML;
      setContent(content);
      socket.emit("updateTaskContent", { Id: userid, content: Content });
    };

    useEffect(() => {
      axios
        .post("http://localhost:5000/gettaskdetails", { id })
        .then((response) => setTask(response.data))
        .catch((error) => console.error("Error fetching task details:", error));
    }, [id]);

    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = task?.task || "";
      }
    }, [task?.task]); // Add Content to the dependency array

    if (!task) return <p>Loading...</p>;

    console.log(task);

    return (
      <>
        <div id="note" className="h-screen w-full px-8 py-2">
          <div className="mb-2 fixed w-full pr-20 top-[0%]   bg-[#191919] z-10 pb-3 ">
            <div className="mt-2">
              <Link to="/">
                <button className="opacity-20">
                  <RiArrowLeftCircleLine />
                </button>
              </Link>

              <div className="flex gap-5 items-center justify-between">
                <h4 className="flex items-center text-sm ">
                  <h1 className="opacity-30 flex">
                    Docs {<RiArrowRightDoubleLine size={20} />}
                  </h1>{" "}
                  <h1 className="opacity-100">{task.task_title}</h1>
                </h4>

                <div
                  id="menu-button-wrapper"
                  className="flex gap-2 items-center py-1 px-1 rounded-md bg-zinc-800"
                >
                  <button
                    className=" p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500 "
                    // onClick={wrapSelectionWithH2}
                    onClick={() =>
                      document.execCommand("formatBlock", true, "<h2>")
                    }
                  >
                    {<RiH1 size={20} />}
                  </button>

                  <button
                    className=" p-1  bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500 "
                    onClick={() => {
                      document.execCommand("bold");
                    }}
                  >
                    <RiBold size={20} />
                  </button>

                  <button
                    className=" p-1  bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500 "
                    onClick={() => {
                      document.execCommand("italic");
                    }}
                  >
                    <RiItalic size={20} />
                  </button>
                  <button
                    className=" p-1  bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500 "
                    onClick={() => {
                      document.execCommand("underline");
                    }}
                  >
                    <RiUnderline size={20} />
                  </button>
                  <button
                    className=" p-1  bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500 "
                    onClick={() => document.execCommand("insertHorizontalRule")}
                  >
                    Hr
                  </button>
                  <button
                    className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                    onClick={() => {
                      document.execCommand(
                        "insertHTML",
                        false,
                        `<div id ="list"> 
                          <h1 className =" text-2xl ">Topics List</h1>
                            <ul>
                                <li>1. Topic</li>
                                <li>2. Topic</li>
                                <li>3. Topic</li>
                                <li>4. Topic</li>
                            </ul>
                        </div>`
                      );
                    }}
                  >
                    <RiListCheck size={20} />
                  
                  </button>
                  <button
                    className=" p-1  bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500 "
                    onClick={DownloadPDf}
                  >
                    <RiDownload2Fill/>
                  </button>
                </div>
              </div>
            </div>
            <Gimine
              setContent={setContent}
              Content={Content}
              Texablebox={editorRef}
            />
            <h1
              className="text-5xl mt-3 outline-none flex  items-center  gap-1"
              contextMenu="true"
              id="Title"
            >
              {<RiFileTextFill size={40} />}
              <h1 className="text-5xl outline-none" contentEditable="true">
                {task.task_title}
              </h1>
            </h1>
          </div>

          <div
            id="textableArea"
            className=" relative w-full min-h-96 outline-none text-md mb-2 mt-36"
            ref={editorRef}
            contentEditable="true"
            aria-placeholder="Enter content"
            suppressContentEditableWarning
            onInput={handleTextInBox}
          
          >
          
          </div>
        </div>
      </>
    );
  }

  export default Note;

import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CustomFont from "../font/inter-ui-bold-001893789f7f342b520f29ac8af7d6ca.woff"
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import axios from "axios";
import {
  RiArrowLeftCircleLine,
  RiArrowLeftDoubleLine,
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
import Loader from "../components/loader";
import { motion, AnimatePresence } from "framer-motion";


const socket = io("http://localhost:5000");
const ENV = "http://localhost:5000/api/tasks";

interface TaskType {
  task_title: string;
  task: string;
  [key: string]: any;
}

function Note() {
  const { id } = useParams<{ id: string }>();
  const userid = id ?? "";


 const layout = [
    { i: "box1", x: 0, y: 0, w: 4, h: 6 },
    { i: "box2", x: 4, y: 0, w: 3.2, h: 6 },
    { i: "box3", x: 0, y: 6, w: 7.2, h: 6 },
     { i: "box4", x: 0, y: 6, w: 7.2, h: 6 },
    

  ];

  const [shrink, setshrink] = useState(true);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const TitleRef = useRef<HTMLDivElement | null>(null);

  const [task, setTask] = useState<TaskType | null>(null);
  const [Content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

const DownloadPDF = (title:string ) => {
  const content = document.getElementById("textableArea") as HTMLElement;
  if (!content) return;

  const originalColor = content.style.color;
  const originalPadding = content.style.padding;

  content.style.color = "black";
  content.style.padding = "20px";

  html2canvas(content, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // ✅ Register your custom font
    // pdf.addFileToVFS("CustomFont.ttf", CustomFont);
    // pdf.addFont("CustomFont.ttf", "CustomFont", "normal");
    // pdf.setFont("CustomFont");

    // ✅ Add title before content
    pdf.setFontSize(20);
    pdf.text(`${title}`, 105, 20, { align: "left" });

    // ✅ Add content image below the title
    pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight);

    pdf.save("document.pdf");

    content.style.color = originalColor;
    content.style.padding = originalPadding;
  });
};
  const handleTextInBox = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setTitle(newContent);
    socket.emit("updateTaskContent", { Id: userid, content: newContent });
  };

  const handleTitleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML.replace(/&nbsp;/g, " ");
    setContent(newContent);
    socket.emit("updateTitleContent", { Id: userid, title: newContent });
  };

  useEffect(() => {
    axios
      .post(`${ENV}/gettaskdetails`, { id })
      .then((response) => setTask(response.data))
      .catch((error) => console.error("Error fetching task details:", error));
  }, [id]);

  useEffect(() => {
    if (editorRef.current && task?.task) {
      editorRef.current.innerHTML = task.task;
      setContent(task.task);
    }
  }, [task?.task]);

  useEffect(() => {
    if (TitleRef.current && title) {
      TitleRef.current.innerHTML = title;
      setTitle(title);
    }
  }, [task?.task]);

  if (!task) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Loader />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div id="note" className="h-screen w-full px-8 py-2">
      <div id="title" className="mb-2 fixed w-full pr-20 top-0 bg-[#191919] z-10 pb-3">
        <div className="mt-2">
          <Link to="/">
            <button className="opacity-20">
              <RiArrowLeftCircleLine />
            </button>
          </Link>

          <div className="flex gap-5 items-center justify-between">
            <h4 className="flex items-center text-sm">
              <span className="opacity-30 flex">
                Docs <RiArrowRightDoubleLine size={20} />
              </span>
              <span className="opacity-100 ml-1">{task.task_title}</span>
            </h4>

            {/* Toolbar */}
            <div className="flex">
              <div
                id="menu-button-wrapper"
                className={`flex gap-2 items-center py-1 px-1 rounded-l-md bg-zinc-800 ${shrink ? "scale-x-0 " : "scale-x-100"
                  } origin-right transition-all`}
              >
                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                  onClick={() =>
                    document.execCommand("formatBlock", true, "<h2>")
                  }
                >
                  <RiH1 size={20} />
                </button>

                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                  onClick={() => document.execCommand("bold")}
                >
                  <RiBold size={20} />
                </button>

                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                  onClick={() => document.execCommand("italic")}
                >
                  <RiItalic size={20} />
                </button>

                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                  onClick={() => document.execCommand("underline")}
                >
                  <RiUnderline size={20} />
                </button>

                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                  onClick={() => document.execCommand("insertHorizontalRule")}
                >
                  Hr
                </button>

                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white rounded hover:bg-blue-500"
                  onClick={() =>
                    document.execCommand(
                      "insertHTML",
                      false,
                      `<div id="list"> 
                        <h2 class="text-2xl">Topics List</h2>
                        <ul>
                          <li>1. Topic</li>
                          <li>2. Topic</li>
                          <li>3. Topic</li>
                          <li>4. Topic</li>
                        </ul>
                      </div>`
                    )
                  }
                >
                  <RiListCheck size={20} />
                </button>

                <button
                  className="p-1 bg-zinc-800 cursor-pointer text-white hover:bg-blue-500"
                  onClick={() => DownloadPDF(title, Content)}
                >
                  <RiDownload2Fill />
                </button>
              </div>

              <button
                onClick={() => setshrink((prev) => !prev)}
                className={`p-1 bg-zinc-800 cursor-pointer text-white ${shrink ? "rounded-md" : "rounded-r-md"
                  } transition-all opacity-70 hover:bg-blue-500`}
              >
                <RiArrowLeftDoubleLine />
              </button>
            </div>
          </div>
        </div>

        <Gimine
          setContent={setContent}
          Content={Content}
          Texablebox={editorRef}
        />
  
        <div
          id="Title"
          className="text-5xl mt-3 outline-none flex items-center gap-1"
        >
          <RiFileTextFill size={40} />
          <span
            ref={TitleRef}
            className="text-5xl Interbold outline-none"
            contentEditable
            suppressContentEditableWarning
            onInput={handleTitleInput}
          >
            {task.task_title}
          </span>
        </div>
      </div>

      <div
        id="textableArea"
        className="relative w-full min-h-96 p-2  rounded outline-none text-md mb-2 mt-36"
        ref={editorRef}
        contentEditable
        spellCheck={false}
        aria-placeholder="Enter content"
        suppressContentEditableWarning
        onInput={handleTextInBox}
      />
        <div className="min-h-[100%] w-full bg-neutral-700 flex flex-col gap-3 rounded-2xl ">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="box1" className="bg-zinc-800 w-56  rounded text-white flex items-center justify-center">
          Box 1
        </div>
        <div key="box2" className="bg-zinc-800 w-56 rounded text-white flex items-center justify-center">
          Box 2
        </div>
        <div key="box3" className="bg-zinc-800 w-96 rounded text-white flex items-center justify-center">
          Box 3
        </div>
         <div key="box4" className="bg-zinc-800 w-96 rounded text-white flex items-center justify-center">
          Box 3
        </div>
      </GridLayout>
    </div>

    </div>
  );
}

export default Note;

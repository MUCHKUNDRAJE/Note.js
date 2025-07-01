import { useState } from "react";
import { RiSendPlane2Fill, RiBardFill } from "@remixicon/react";

 // 🔹 Replace with your actual API key
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function Gimine({setContent , Content ,Texablebox}) {
  const [Aianimation, setAianimation] = useState(true);
  const [userRequest, setUserRequest] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // 🔹 Toggle animation state
  function ToggleAnimation() {
    setAianimation(!Aianimation);
  }

  // 🔹 Send request to AI
  async function fetchAIResponse() {
    if (!userRequest.trim()) return; // Prevent empty requests
  console.log("Api call")
    const requestData = {
      contents: [{ parts: [{ text: `
You are an AI assistant for a Notepad + Notion-like app. Your responses must be in HTML format. Follow these guidelines:
1.Wrap everything in a div to ensure the text Does not has a black overlay effect Color the  background color to #191919 of the  .
2.If you include code, style it to look like VS Code using inline CSS:
3.Set the  background color to transparent Stictly follow this rule.
4.Use a monospace font and appropriate syntax highlighting colors.
5.Do not use absolute or fixed positioning for the div
6.Use standard HTML tags like h2, p, hr, and table where necessary.
7.Do not include any HTML explanations or sentences in your response—just provide the HTML content  .
8.Do not wrap the response in a triple backtick html or any other code block formatting.
9.Respond to the user's request: ${userRequest}.
        ` }] }],
    };

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.candidates?.length > 0) {
        const aiReply = data.candidates[0]?.content?.parts[0]?.text || "No response received";
        setAiResponse(aiReply);
        console.log("api called sucesully")
        if (Texablebox.current) {
          Texablebox.current.innerHTML = aiResponse || "";
        }
        console.log(aiResponse);
      } else {
        setAiResponse("No valid response from AI.");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiResponse("Error: Unable to fetch response.");
    }
  }

  return (
    <div>
      {/* AI Chatbox */}
      <div
        className={`h-10 rounded-full fixed bottom-3 right-3 flex items-center transition-all duration-200 bg-zinc-800 ${
          Aianimation ? "w-10 px-0" : "w-80 px-4"
        } justify-center z-50 gap-4`}
      >
        {!Aianimation && (
          <>
            <input
              type="text"
              placeholder="What can I do for you?"
              className="w-full outline-none bg-transparent text-white"
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
            />
            <RiSendPlane2Fill className="cursor-pointer text-white" onClick={fetchAIResponse} />
          </>
        )}
        <RiBardFill size={20} className="cursor-pointer text-white" onClick={ToggleAnimation} />
      </div>
    
     
     
      
      
  
    </div>
  );
}

export default Gimine;

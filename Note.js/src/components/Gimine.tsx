import { useState, MutableRefObject } from "react";
import { RiSendPlane2Fill, RiBardFill } from "@remixicon/react";

// const API_KEY: string  ;
const URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

interface GimineProps {
  setContent: (content: string) => void;
  Content: string;
  Texablebox: MutableRefObject<HTMLDivElement | null>;
}

function Gimine({ Texablebox }: GimineProps) {
  const [Aianimation, setAianimation] = useState<boolean>(true);
  const [userRequest, setUserRequest] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");

  // 🔹 Toggle animation state
  function ToggleAnimation(): void {
    setAianimation(!Aianimation);
  }

  console.log(aiResponse)

  // 🔹 Send request to AI
  async function fetchAIResponse(): Promise<void> {
    if (!userRequest.trim()) return;

    const requestData: {
      contents: Array<{
        parts: Array<{
          text: string;
        }>;
      }>;
    } = {
      contents: [
        {
          parts: [
            {
              text: `

You are an AI assistant for a Notepad + Notion-like app. Your responses must be in HTML format only. 
Follow these rules strictly:
1. Wrap everything inside a <div>.
2. Use Tailwind CSS for styling and responsiveness.
3. The background color must be transparent.
4. Use a monospace font and avoid absolute/fixed positioning.
5. For dashboards, create a responsive grid layout with Tailwind (like grid-cols-1 sm:grid-cols-2 md:grid-cols-3).
6. Use <h2>, <p>, <hr>, <table>, <div>, <section> appropriately.
7. Do NOT explain, just return clean HTML content (no code blocks like \`\`\`).
8. Respond to the user's request: ${userRequest}.


            `,
            },
          ],
        },
      ],
    };

    try {
      const response: Response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data: any = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const aiReply: string = data.candidates[0].content.parts[0].text;
        const cleaned: string = aiReply.replace('```html', '').replace('```', '');
        console.log(cleaned)
        setAiResponse(cleaned);
        if (Texablebox.current) {
          Texablebox.current.innerHTML = cleaned;
        }
      } else {
        setAiResponse("⚠️ No valid response from Gemini");
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
          Aianimation ? "w-10 px-0 " : "w-80 px-4 border-2"
        } justify-center z-50 gap-4` }
      >
        {!Aianimation && (
          <>
            <input
              type="text"
              placeholder="What can I do for you?"
              className="w-full  outline-none bg-transparent text-white"
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
            />
            <RiSendPlane2Fill
              className="cursor-pointer text-white"
              onClick={fetchAIResponse}
            />
          </>
        )}
        <RiBardFill
          size={20}
          className="cursor-pointer text-white"
          onClick={ToggleAnimation}
        />
      </div>
    </div>
  );
}

export default Gimine;

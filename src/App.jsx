import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Tag from "./tag";

function App() {
  const [count, setCount] = useState(0);
  const [typetext, setTypeText] = useState("");
  const handleInputChange = (e) => {
    setTypeText(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
        {/* <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          <div className="md:col-span-5 ">
            <Tag />
          </div>
          <div className="md:col-span-7 border border-green-600">Main content</div>
        </div> */}

        <div className="flex flex-1 overflow-hidden flex-row">
          <div className="w-2/5 h-full border-green-700 border-r relative z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 h-full w-100vh">
                {/* <div style="position: relative; width: 100%; height: 100%; overflow: hidden; pointer-events: auto; background-color: transparent;">
                  <div style="width: 100%; height: 100%;">
                    <canvas
                      style="display: block; width: 423.797px; height: 913px;"
                      data-engine="three.js r176"
                      width="423"
                      height="913"
                    ></canvas>
                  </div>
                </div> */}
                <Tag />
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-green-500 font-mono bg-black bg-opacity-70 p-1 rounded z-20">
                [Interactive 3D Card]
              </div>
            </div>
          </div>
          <div className="w-3/5 h-full overflow-auto relative">
            <div className="terminal-container w-full h-full overflow-y-auto bg-black text-green-500 font-mono px-4 pb-6">
              <div className="available-commands  py-4 text-sm border-b border-green-700 pb-2 md:fixed bg-black z-10 hidden md:block">
                help | about | projects | skills | experience | contact |
                education | certifications | leadership | sudo | clear
              </div>
              <div className="command-history md:pt-16 pt-2">
                <div className="mb-4">
                  <div className="command-line flex items-center">
                    <span className="text-blue-400 mr-2">
                      sanjeev@portfolio:~$
                    </span>
                    <span>welcome</span>
                  </div>
                  <div className="response mt-1 text-white whitespace-pre-wrap">
                    Hi, I'm Sanjeev , a Software &amp; AI Engineer. Welcome to
                    my interactive 'AI powered' portfolio terminal! Type 'help'
                    to see available commands.
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">sanjeev@portfolio:~$</span>
                <div className="flex-1 relative">
                  <span className="text-green-500">{typetext}</span>
                  <span className="cursor"></span>
                  <span className="text-green-500"></span>
                  <input
                    type="text"
                    onChange={handleInputChange}
                    value={typetext}
                    className="absolute top-0 left-0 w-full h-full opacity-0 m-2"
                  />
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="h-dvh w-full flex items-center justify-center bg-red-500">
       
        <div className="h-full flex flex-col items-center justify-center w-full">
          <Tag />
        </div>
        <div className="h-full flex flex-col items-center justify-center w-full">
          <Tag />
        </div>
      </div> */}
    </>
  );
}

export default App;

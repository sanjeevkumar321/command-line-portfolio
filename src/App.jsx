import { useRef, useState } from "react";
import "./App.css";
import Tag from "./tag";
import TypingText from "./TypingText";
import { ReactTyped } from "react-typed";
import { data } from "./Data";
import LiveClock from "./LiveClock";
import AiChat from "./AiChat";
function App() {
  const [isType, setIsType] = useState(false);

  const [count, setCount] = useState(0);
  const [typetext, setTypeText] = useState("");

  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const [cursorIndex, setCursorIndex] = useState(0);
  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // Get the new character added
    const newChar = newValue.length > typetext.length ? newValue.slice(-1) : "";

    // Update left text
    const newLeftText = leftText + newChar;

    setLeftText((prevLeft) => prevLeft + newChar);
    setCursorIndex((prevIndex) => prevIndex + 1);
    setTypeText(newLeftText + rightText);
  };

  const reset = () => {
    setTypeText("");
    setLeftText("");
    setRightText("");
    setCursorIndex(0);
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      if (leftText.length > 0) {
        const movedChar = leftText[leftText.length - 1]; // last character
        const newLeftText = leftText.slice(0, -1); // remove last char
        const newRightText = movedChar + rightText; // prepend to rightText

        setLeftText(newLeftText);
        setRightText(newRightText);
        setCursorIndex(cursorIndex - 1);
      }
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      if (rightText.length > 0) {
        const movedChar = rightText[0];
        const newLeftText = leftText + movedChar;
        const newRightText = rightText.slice(1);

        setLeftText(newLeftText);
        setRightText(newRightText);
        setCursorIndex(cursorIndex + 1);
      }
    } else if (e.key === "Backspace") {
      if (cursorIndex > 0) {
        // Remove last char from leftText
        const newLeftText = leftText.slice(0, -1);
        // cursor moves left by one
        const newCursorIndex = cursorIndex - 1;

        setLeftText(newLeftText);
        setCursorIndex(newCursorIndex);
        setTypeText(newLeftText + rightText);
      }
      e.preventDefault(); // Prevent default browser backspace behavior
    } else if (e.key == "Enter") {
      // alert();
      let textData = typetext.toLocaleLowerCase().trim();
      if (textData == "clear") setHistory([]);
      else {
        if (data.hasOwnProperty(textData)) {
          setHistory([
            ...history,
            { cmdText: textData, typeId: 1 },
            { cmdText: data[textData], typeId: 2 },
          ]);
        } else {
          setHistory([
            ...history,
            { cmdText: textData, typeId: 1 },
            {
              cmdText: ` <pre style='color:red'>bash: gisd: command not found</pre>`,
              typeId: 2,
            },
          ]);
        }
      }
      // const entry = data.find((d) => d.cmd === typetext);

      reset();
    }
  };
  const textFieldRef = useRef(null);

  const handleDivClick = (e) => {
    // Optional: prevent default if needed
    // e.stopPropagation();
    textFieldRef.current?.focus();
  };
  const [history, setHistory] = useState([]);
  return (
    <>
      <AiChat />
      {/* <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden font-mono cmd-text">
        <div className="w-full p-2">
          <div className="text-green-500 text-2xl font-bold">
            SANJEEV KUMAR SAHOO{" "}
          </div>
          <span className="text-lg text-gray-500">Software Engineer</span>
        </div>

        <div className="flex flex-1 overflow-hidden flex-row border-green-700 border-t border-b">
          <div className="w-2/5 h-full border-green-700 border-r relative z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 h-full w-100vh">
                <Tag />
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-green-500 font-mono bg-black bg-opacity-70 p-1 rounded z-20">
                [Interactive 3D Card]
              </div>
            </div>
          </div>
          <div className="w-3/5 h-full overflow-auto relative">
            <div
              onClick={handleDivClick}
              className="terminal-container w-full h-full overflow-y-auto bg-black text-green-500 font-mono px-4 pb-6"
            >
              <div className="cmd-text available-commands  py-4 text-sm border-b border-green-700 pb-2 md:fixed bg-black z-10 hidden md:block">
                help | about | projects | skills | experience | contact |
                education | certifications | leadership | sudo | clear
              </div>
              <div className="command-history md:pt-16 pt-2">
                <div className="mb-4">
                  <div className="command-line flex items-center">
                    <span className="text-blue-400 mr-2 cmd-text">
                      sanjeev@portfolio:~$
                    </span>
                    <span>welcome</span>
                  </div>
                  <div className="response mt-1 text-white whitespace-pre-wrap cmd-text">
                    Hi, I'm Sanjeev , a Software &amp; AI Engineer. Welcome to
                    my interactive 'AI powered' portfolio terminal! Type 'help'
                    to see available commands.
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-1 relative">
                  {history.map((item, index) => {
                    return (
                      <>
                        <div className="flex w-full" key={index}>
                          {item.typeId == 1 ? (
                            <>
                              {" "}
                              <span className="text-blue-400 mr-2 cmd-text">
                                sanjeev@portfolio:~$
                              </span>
                              <span className="text-green-500 cmd-text">
                                {item.cmdText}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="text-white text-sm cmd-text">
                                <ReactTyped
                                  startWhenVisible
                                  strings={[item.cmdText]}
                                  typeSpeed={0.5}
                                  showCursor={false}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    );
                  })}
                  <span className="text-blue-400 mr-2 cmd-text">
                    sanjeev@portfolio:~$
                  </span>
                  <span className="text-green-500 cmd-text">{leftText}</span>
                  <span className="cursor"></span>
                  <span className="text-green-500 cmd-text">{rightText}</span>
                  <input
                    autoFocus
                    ref={textFieldRef}
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    value={typetext}
                    className="absolute top-0 left-0 w-full h-full opacity-0 m-2"
                  />
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="w-full p-2 flex">
          <div className="text-green-500 text-sm w-1/2">
            sanjeev@portfolio:~$
          </div>
          <div className="text-green-500 text-sm w-1/2  text-right">
            <LiveClock />
          </div>
        </div>
      </div> */}
    </>
  );
}

export default App;

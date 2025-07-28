import { useRef, useState } from "react";
import { ReactTyped } from "react-typed";
import "./App.css";
import { data } from "./Data";
import LiveClock from "./LiveClock";
import Tag from "./Tag";

import { HfInference } from "@huggingface/inference";

function App() {
  const [isTypeAble, setIsTypeAble] = useState(true);

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
      setIsTypeAble(false);
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
          // setIsTypeAble(true);
        } else {
          setHistory([
            ...history,
            { cmdText: textData, typeId: 1 },
            {
              cmdText: ` <pre style='color:red'>[Error]: ${textData}: command not found</pre>`,
              typeId: 2,
            },
          ]);

          callAiApui(textData);
        }
      }
      // const entry = data.find((d) => d.cmd === typetext);

      reset();
    }
  };
  const textFieldRef = useRef(null);

  const [context, setContext] = useState(`
   My name is Sanjeev Kumar Sahoo. I am a backend software developer based in Bengaluru, India. I have more than 3.5 years of experience in building scalable backend systems and cloud-native services using modern technologies. My phone number is not listed publicly, but I can be reached via email at sksahoo241@gmail.com. My professional portfolio and code samples can be found on GitHub at https://github.com/sanjeevkumar321 and on LinkedIn at https://linkedin.com/in/sanjeev321.

I specialize in Java and Golang development. On the back end, I work with Java (Spring Boot) and Golang to build high-performance microservices and RESTful/GraphQL APIs. I have hands-on experience with containerization using Docker and Kubernetes, and cloud platforms like Google Cloud Platform (GCP), AWS, and Azure for deploying and managing applications. I’m skilled in working with SQL and NoSQL databases, including PostgreSQL, MySQL, and MongoDB. I follow secure coding practices and use tools such as Jaeger for tracing and Jenkins for CI/CD automation. For version control and collaborative development, I rely on Git and conduct regular code reviews as part of Agile teams.

Since October 2023, I have been working as a Senior Associate Developer at Diggibyte Technology in Bengaluru, India. In this role, I have architected and developed high-performance backend services in Java and Golang, integrated APIs with frontend systems, and implemented container orchestration with Docker and Kubernetes. I also collaborated cross-functionally with developers and stakeholders, led code reviews, and improved system observability using tracing tools.

Prior to this, I worked as a Project Engineer at Bharat Electronics Limited (BEL) from December 2022 to October 2023, where I built backend microservices using Java Spring Boot, ensured data security, and participated in Agile workflows. My journey in backend development began during my engineering studies and has grown through professional roles and hands-on projects.

In addition to my professional work, I’ve contributed to several personal and academic projects that demonstrate my backend and cloud expertise. These include developing and deploying scalable microservices, working on real-time systems, and implementing robust monitoring and alerting mechanisms using open-source tools.

I earned my Bachelor of Technology degree in Computer Science and Engineering from Gandhi Institute for Technology, Bhubaneswar, graduating in 2022. I’ve further strengthened my skills with certifications in Java, Spring Boot, and cloud development tools.

I regularly use Git, Jenkins, Docker, Postman, and JIRA, and am passionate about clean, maintainable code and learning the latest technologies in backend development. I enjoy tackling complex technical challenges, mentoring junior developers, and contributing to reliable, scalable software systems. I am currently seeking opportunities to further grow as a backend or full stack developer and contribute to impactful, cloud-native products.
  `);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize HF Inference (store token in environment variables)
  let api = import.meta.env.VITE_CMS_API_URL;
  const hf = new HfInference(api);
  const callAiApui = async (text) => {
    try {
      let textData = "Fetching information from AI assistant....";
      setHistory((prev) => [...prev, { cmdText: textData, typeId: 2 }]);
      const result = await hf.questionAnswering({
        model: "deepset/roberta-base-squad2",
        inputs: {
          question: text,
          context: context,
        },
      });
      // setAnswer(result.answer);
      let score = result.score;
      if (score > 0.9) {
        setHistory((prev) => [...prev, { cmdText: result.answer, typeId: 2 }]);
      } else if (score > 0.7) {
        setHistory((prev) => [...prev, { cmdText: result.answer, typeId: 2 }]);
      } else if (score > 0.3) {
        setHistory((prev) => [...prev, { cmdText: result.answer, typeId: 2 }]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            cmdText: `<pre>I can only provide information about Sanjeev Kumar Sahoo from his portfolio.  

Type 'help' to see available commands. </pre>`,
            typeId: 2,
          },
        ]);
      }
      // setIsTypeAble(true);
      // console.log(result);
    } catch (err) {
      // setIsTypeAble(true);
      // console.error("Error getting answer:", err);
      setError("Failed to get answer. Please try again.");
      setAnswer("");
    } finally {
      setLoading(false);
    }
  };

  const handleDivClick = (e) => {
    // Optional: prevent default if needed
    // e.stopPropagation();
    textFieldRef.current?.focus();
  };

  const typeEnd = () => {
    setCount((prev) => {
      const newCount = prev + 1;

      setIsTypeAble(true);

      console.log(newCount); // log the new value
      return newCount;
    });
  };

  const [history, setHistory] = useState([]);
  return (
    <>
      <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden font-mono cmd-text">
        <div className="w-full p-2">
          <div className="text-green-500 text-2xl font-bold">
            SANJEEV KUMAR SAHOO{" "}
          </div>
          <span className="text-lg text-gray-500">Software Engineer</span>
        </div>

        <div className="flex flex-1 overflow-hidden flex-row border-green-700 border-t border-b">
          <div className="md:w-2/5 h-full border-green-700 border-r relative z-10 hidden sm:block">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 h-full w-100vh">
                <Tag />
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-green-500 font-mono bg-black bg-opacity-70 p-1 rounded z-20">
                [Interactive 3D Card]
              </div>
            </div>
          </div>
          <div className="md:w-3/5 h-full overflow-auto relative sm:w-auto">
            <div
              onClick={handleDivClick}
              className="terminal-container w-full h-full overflow-y-auto bg-black text-green-500 font-mono px-4 pb-6"
            >
              <div className="cmd-text available-commands  py-4 text-sm border-b border-green-700 pb-2 md:fixed bg-black z-10 hidden md:block">
                help | about | projects | skills | experience | contact |
                education | certifications | leadership | clear
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
                    <pre>
                      {`Hi, I'm Sanjeev , a Software & AI Engineer. Welcome to my interactive 'AI powered' portfolio terminal! 
Type 'help' to see available commands.`}
                    </pre>
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
                                  onBegin={() => {
                                    setIsTypeAble(false);
                                  }}
                                  onStringTyped={typeEnd}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    );
                  })}

                  {isTypeAble && (
                    <>
                      <span className="text-blue-400 mr-2 cmd-text">
                        sanjeev@portfolio:~$
                      </span>
                      <span className="text-green-500 cmd-text">
                        {leftText}
                      </span>
                      <span className="cursor"></span>
                      <span className="text-green-500 cmd-text">
                        {rightText}
                      </span>
                      <input
                        autoFocus
                        ref={textFieldRef}
                        type="text"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={typetext}
                        className="absolute top-0 left-0 w-full h-full opacity-0 m-2"
                      />
                    </>
                  )}
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
      </div>
    </>
  );
}

export default App;

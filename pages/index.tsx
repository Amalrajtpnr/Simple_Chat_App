import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { VscSend } from "react-icons/vsc";
import { GoPaperclip } from "react-icons/go";
import { BsCamera } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";


import { useEffect, useState } from "react";

interface ChatMessage {
  id: string;
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
}

export default function Home() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [popUp, setPopUp] = useState<Boolean>(false)

  const fetchChatMessages = async (page: number): Promise<ChatMessage[]> => {
    try {
      const response = await fetch(
        `https://qa.corider.in/assignment/chat?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.chats;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
  };

  const loadMoreMessages = async () => {
    const newPage = currentPage + 1;
    const newMessages = await fetchChatMessages(newPage);
    setChatMessages((prevMessages) => [...prevMessages, ...newMessages]);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    // Load initial chat messages when the component mounts
    fetchChatMessages(currentPage).then((initialMessages) => {
      setChatMessages(initialMessages);
    });

    // Add a scroll event listener to trigger loading more messages
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 200 // Adjust the threshold as needed
      ) {
        loadMoreMessages();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Clean up the scroll event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
      console.log("Chat Messages:", chatMessages);
    };
  }, [currentPage]);

  return (
    <div className="h-screen flex flex-col items-center justify-start bg-white sm650:w-[40%] ">
      <div className="w-full h-[10%] flex flex-row items-center justify-between p-1  ">
        <div className="w-[40%] h-full flex flex-row items-center justify-around">
          <AiOutlineArrowLeft size={30} />

          <h1 className="text-[25px] font-semibold"> Trip 1</h1>
        </div>
        <FiEdit size={25} className="mr-[10px]" />
      </div>
      <div className="w-full h-[85%] flex flex-col items-center justify-start ">
        <div className="w-full h-[12%] flex flex-row items-center justify-start p-1 border-b-2">
          <div className="w-[55px] h-[55px] rounded-[100%] px-3  border border-black "></div>
          <div className="w-[65%] h-full  flex flex-col items-start  justify-center ml-3">
            <h1 className="text-[15px] text-gray-500 font-semibold">
              {" "}
              From &nbsp;
              <span className="text-[18px] text-black font-semibold">
                IGI Airport, T3
              </span>
            </h1>
            <h1 className="text-[15px] text-gray-500 font-semibold">
              {" "}
              To &nbsp;
              <span className="text-[18px] text-black font-semibold">
                Sector 28
              </span>
            </h1>
          </div>
          <BsThreeDotsVertical size={25} className="ml-4" />
        </div>
        <div className="w-full h-[78%] flex flex-col items-start  justify-start p-6 overflow-y-scroll scrollbar-hide">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`w-[310px] min-h-[40%] mb-8 flex flex-row items-start justify-start sm550:w-[500px] ${
                message.sender.self ? "" : "flex-row-reverse"
              }`}
            >
              <div className="w-[35px] h-[35px] rounded-[100%]    ">
                <img
                  src={message.sender.image}
                  alt="User"
                  className="w-full h-full rounded-[100%]"
                />
              </div>

              <div className={`${message.sender.self ? "rounded-r-3xl" : "rounded-l-3xl"} w-[300px] h-full flex flex-col items-start  justify-start shadow-2xl`}>
                <h1 className="text-[15px] text-gray-500 font-semibold ml-2">
                  {message.message}
                </h1>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-[10%]  flex flex-row items-center  justify-around relative p-[15px]">
          <input
            type="text"
            placeholder="Reply to @Rohit Yadav"
            className="w-[80%] h-full outline-none"
          />
          <GoPaperclip onClick={()=>setPopUp(!popUp)} size={25} />
          <VscSend size={25} />
        </div>
      </div>
      {popUp && (
        <div className="w-[30%] h-[6%] sm550:w-[10%] sm550:left-[400px] sm550:bottom-[100px]  rounded-[30px] absolute bottom-[60px] left-[230px]  flex flex-row items-center  justify-around  bg-green-600">
          <BsCamera size={20} />
          <BsCameraVideo size={20}/>
        </div>
      )}
    </div>
  );
}

import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout';
import { Avatar, Box, IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor, orange } from '../Constants/Color';
import { AttachFile as AttachFileButton, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StylesCOmponenet';
import FileMenu from '../components/dialogs/FileMenu';
import MessageCOmponent from '../components/Shared/MessageCOmponent';
import { sampleMessage } from '../Constants/SampleData';
import AvatarCard from '../components/Shared/AvatarCard';
import { getSocket } from '../socket';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../Constants/event';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScrollTop } from '6pp';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';





const Chat = ({chatId,user}) => {
 
  // const ContainerRef=useRef(null);
   
  // const socket=getSocket();
  
  // const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  // const [message,setMessage]=useState("");
  // const members = chatDetails?.data?.chat?.members;
  // // console.log(chatDetails.data);
  
 

  // const submitHandler = (e) => {
  //   e.preventDefault();

  //   if (!message.trim()) return;

  //   // Emitting the message to the server
  //   socket.emit(NEW_MESSAGE, { chatId, members, message });
  //   setMessage("");
  // };

  // useEffect(() => {
  //   console.log("hello");
  //    socket.on(NEW_MESSAGE,(data) => {
  //        console.log("hello");
  //        console.log(data);
  //    });
  // },[]);
   
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
   const [page, setPage] = useState(1);
   const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  
   const [IamTyping, setIamTyping] = useState(false);
   const [userTyping, setUserTyping] = useState(false);
   const typingTimeout = useRef(null);
  
    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
    const samnewalekichatDetails=useChatDetailsQuery({chatId:chatId,populate:true, skip: !chatId} )
   // console.log(samnewalekichatDetails)
    //console.log("user",user)
    const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
     
    //  const samnewala=samnewalekichatDetails?.data?.chat?.members?.filter((member)=>{
    //     member._id===userId
    //  })
   // console.log("old messaged",oldMessagesChunk);

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  
    const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
      socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
        socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    // if (bottomRef.current)
    //   bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
     [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

   useErrors(errors);
  
   const allMessages = [...oldMessages, ...messages];
  
  return  chatDetails.isLoading?<Skeleton/>: (

    <>   
       {/* <Box height={"100vh"} sx={{
         backgroundImage: 'url("https://images.pexels.com/photos/157757/wedding-dresses-fashion-character-bride-157757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', // Update this path to your image
         backgroundSize: 'cover', // Ensures the background image covers the entire container
         backgroundPosition: 'center', // Centers the background image
         backgroundRepeat: 'no-repeat',
         display: 'flex',
          flexDirection: 'column',
       }}> */}
       <Stack ref={containerRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{
            overflowX:"hidden",
            overflowY:"auto",
            
             backgroundImage: 'url("/wallapaper.jpeg")', 
          //  backgroundImage: 'url("https://images.unsplash.com/photo-1528459584353-5297db1a9c01?q=80&w=1799&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',// Update this path to your image
            backgroundSize: 'cover', // Ensures the background image covers the entire container
            backgroundPosition: 'center', // Centers the background image
            backgroundRepeat: 'no-repeat',
            // Prevents the background image from repeating
            '&::-webkit-scrollbar': {
              width: '8px', // Width of the scrollbar
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // Color of the scrollbar thumb
              borderRadius: '4px', // Rounded corners of the scrollbar thumb
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent', // Color of the scrollbar track
            },
          }}> 

           {
             allMessages.map((i)=>(
              <MessageCOmponent key={i._id} message={i} user={user}/>
             ))
           }
                {userTyping && <TypingLoader/>}
                <div ref={bottomRef} /> 
        </Stack>
          
          <form onSubmit={submitHandler} style={{
            height:"10%",
            
           
          }}>
               
               <Stack direction={"row"} height={"100%"} padding={"0.5rem"} alignItems={"center"} position={"relative"}>

                    <Box position={"absolute"} left={"1rem"} >
                        <Avatar/>
                    </Box>

                    <IconButton sx={
                      {
                        position:"absolute",
                        left:"3.2rem",
                        rotate:"30deg",
                      }

                    }
                  
                    onClick={handleFileOpen}
                    >
                       <AttachFileButton/>
                    </IconButton>

                    <InputBox sx={{paddingLeft:"5rem"}} value={message} onChange={messageOnChange}  placeholder='Type Message Here...'/>

                    <IconButton 
                      sx={{
                        rotate:"-30deg",
                        backgroundColor: orange,
                        color:"white",
                        marginLeft:"1rem",
                        padding:"0.5rem",
                        "&:hover":{
                          bgcolor:"error.dark"
                        }
                      }}
                     onClick={submitHandler}
                    >
                        <SendIcon/>
                    </IconButton>
               </Stack>
          </form>

          <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
          {/* </Box> */}
       
    </>
   
  )
}
export default AppLayout()(Chat);

import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { Manager} from "socket.io-client"


const manager = new Manager("http://localhost:3000", {
  transports: ["websocket"]
});

const socket = manager.socket("/");

manager.open((err) => {
  if (err) {
    // an error has occurred
    console.error("Connection error:", err);
  } else {
    // the connection was successfully established
    console.log("Connected to socket server");
  }
});


export const EditorPage = ()=> {
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("hi", (...args) => {
      console.log("hi", ...args);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
    };
  }
    , []);
  
  const ref = useRef<HTMLDivElement>(null);
  
  const onPageClick = () => {
    ref.current?.focus();
  }

  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleInput = () => {
    if (ref.current) {
      const isEmpty = ref.current.innerText.trim().length === 0;
      setShowPlaceholder(isEmpty);
    }
  };

  return (
    <Box className="App">

      <Box className={"page"} onClick={onPageClick}>
        <span className={`placeholder ${showPlaceholder? 'show' : 'hide'}`}>Type here...</span>
        <div ref={ref} onInput={handleInput} className='text-area' contentEditable={true} suppressContentEditableWarning={true}/>
      </Box>

    </Box>
  )
}

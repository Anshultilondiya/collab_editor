import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useSelector } from 'react-redux';
import { Manager } from "socket.io-client";
import type { TRootState } from '../redux/store';


const manager = new Manager("http://localhost:3000", {
  transports: ["websocket"]
});

const socket = manager.socket("/documents");

manager.open((err) => {
  if (err) {
    // an error has occurred
    console.error("Connection error:", err);
  } else {
    // the connection was successfully established
    console.log("Connected to socket server");
  }
});

type TMainEditorProps = {
    doc: any
    }


export const MainEditor: FC<TMainEditorProps> = ({ doc }) => {
    
    const {userSession} = useSelector((state: TRootState) => state.user)
    
    const documentId = doc.id;

    const creds = useMemo(() => {
        return {
            userId: userSession?.user?.id,
            docId: documentId
        }
    }
    , [userSession, documentId])

useEffect(() => {
  socket.on("connect", () => {
      console.log("Connected to server");
       
  });
    
     
  socket.emit("join-document", creds);

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
    socket.off("hi");
  };
}, []);

    
  
  const ref = useRef<HTMLDivElement>(null);
  
  const onPageClick = () => {
    ref.current?.focus();
  }

    const [showPlaceholder, setShowPlaceholder] = useState(true);
    
    
    const [content, setContent] = useState<string>(doc.content);
    const contentRef = useRef<String>(null);

  const handleInput = () => {
    if (ref.current) {
        const isEmpty = ref.current.innerText.trim().length === 0;
        setShowPlaceholder(isEmpty);
        contentRef.current = ref.current.innerText;
        setContent(ref.current.innerText);
    }
  };
    
    useEffect(() => {
        if (ref.current) {
            ref.current.innerText = content;
            contentRef.current = content;
            const isEmpty = ref.current.innerText.trim().length === 0;
            setShowPlaceholder(isEmpty);
        }
    },[])
    
    
    
    
    
    
    

  return (
    <Box className="main-editor">
      <Box className={"page"} onClick={onPageClick}>
        <span className={`placeholder ${showPlaceholder? 'show' : 'hide'}`}>Type here...</span>
        <div ref={ref} onInput={handleInput} className='text-area' contentEditable={true} suppressContentEditableWarning={true}/>
      </Box>

    </Box>
  )
}

import { Box, Input } from '@mui/material'
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { Manager} from "socket.io-client"
import { getDocById, shareDoc, updateDocName } from '../services/docs.service';
import { useParams } from 'react-router';
import { MainEditor } from '../components/MainEditor';


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


export const EditorPage = () => {
  
  const {documentId} = useParams<{ documentId: string }>();
  
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

  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [docTitle, setDocTitle] = useState<string>("");


  const getDocumentById = useCallback(async (docId: string) => {
    setLoading(true);
    const data = await getDocById(docId);
    setTimeout(() => {
      setDoc(data);
      setLoading(false);
      setDocTitle(data.title);
    }
    , 1000);
  }, [])

  useEffect(() => {
    if (documentId) {
      getDocumentById(documentId);
    }
  }, [documentId, getDocumentById]);


  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const debouncedHandleInput = (val: string) => {
    
      // Clear any existing timeout
      if (updateTimeout.current) {
        abortControllerRef.current?.abort();
        clearTimeout(updateTimeout.current);
      }
      
      // Set new timeout
      const timeout = setTimeout(async () => {
        try {
          abortControllerRef.current = new AbortController();
          const signal = abortControllerRef.current.signal;
          const data = await updateDocName(doc.id, val, signal);
          console.log(data);
          setDoc((prev: any) => ({ ...prev, title: val }));
        } catch (error) {
          console.error("Failed to update document name:", error);
        }
      }, 3000);
      
      updateTimeout.current = timeout;
    
  };

  const handleTitleChange = (val: string) => {
    setDocTitle(val);
    if (val.length > 3) {
        debouncedHandleInput(val)
    }
  }

  const [shareEmail, setShareEmail] = useState<string>("");
  const handleShareEmailChange = (val: string) => {
    setShareEmail(val);
  }

  const handleShare = async () => {
    if (doc && shareEmail) {
      const data = await shareDoc(doc.id, shareEmail);
      console.log(data);
    }
  }
  

  return (
    <Box className="App">

      <Box className={"heading"}>
        {loading && <p>Loading...</p>}
        {doc && <Input className='title-input' value={docTitle} onChange={(e) => handleTitleChange(e.target.value)} />}
        {!loading && !doc && <p>No document found</p>}
      </Box>

      <Box>
        <h4>Share</h4>
        <Input placeholder='Email' className='email-input' onChange={(e)=>handleShareEmailChange(e.target.value)} />
        <button className='share-btn' onClick={handleShare} >Share</button>
      </Box>

      {/* <Box className={"page"} onClick={onPageClick}>
        <span className={`placeholder ${showPlaceholder? 'show' : 'hide'}`}>Type here...</span>
        <div ref={ref} onInput={handleInput} className='text-area' contentEditable={true} suppressContentEditableWarning={true}/>
      </Box> */}
      {doc && doc.id ?(<MainEditor doc={doc} />): null}

    </Box>
  )
}

import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useSelector } from 'react-redux';
import { Manager } from "socket.io-client";
import type { TRootState } from '../redux/store';
import { saveDocument } from '../services/docs.service';


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
    
    const documentId = doc.id;
    
    const [text, setText] = useState('');
    const [revision, setRevision] = useState(0);

    const [showPlaceholder, setShowPlaceholder] = useState(true);
    
    const [content, setContent] = useState<string>(doc.content);
    const contentRef = useRef<string>(null);

useEffect(() => {
    socket.emit('join', documentId);
    console.log("Joining document: ", documentId)

    socket.on('init', ({ text, revision }) => {
      setText(text);
      setRevision(revision);
    });

    socket.on('remoteOperation', ({ operation }) => {
        setText(prevText => {
            const val = applyOperation(prevText, operation)
            if (ref.current) {
                ref.current.innerText = val;
            }
            return val;
        });
    });

    return () => {
      socket.off('init');
      socket.off('remoteOperation');
    };
  }, [documentId]);

    // const handleChange = (e: any) => {
    //     const newText = e.target.value;
    //     const ops = getTextOperations(text, newText);
        
    //     ops.forEach(op => {
    //     socket.emit('operation', {
    //         operation: op,
    //         revision
    //     });
    //     });
        
    //     setText(newText);
    // };

    const handleInput = () => {
    if (ref.current) {
        const isEmpty = ref.current.innerText.trim().length === 0;
        setShowPlaceholder(isEmpty);
        contentRef.current = ref.current.innerText;
        setContent(ref.current.innerText);
        const newText = contentRef.current;
        const ops = getTextOperations(text, newText);
        
        ops.forEach(op => {
        socket.emit('operation', {
            operation: op,
            revision
        });
        });
        
        setText(newText);


    }
    };
    
    const saveContent = useCallback(async (content: string, signal: AbortSignal) => {
        try {
            await saveDocument(documentId, content, signal);
            console.log('Document saved successfully');
        } catch (error) {
            console.error('Error saving document:', error);
        }
    }, [documentId]);

    const debounceSave = useCallback(() => {
        const controller = new AbortController();
        let timeout: NodeJS.Timeout | null = null;
        
        return {
            save: (content: string) => {
                if (timeout) {
                    clearTimeout(timeout);
                    controller.abort();
                }
                
                timeout = setTimeout(async () => {
                    const newController = new AbortController();
                    await saveContent(content, newController.signal);
                    timeout = null;
                }, 3000); // 1 second debounce
            },
            cancelPending: () => {
                if (timeout) {
                    clearTimeout(timeout);
                    controller.abort();
                    timeout = null;
                }
            }
        };
    }, [saveContent]);

    const { save, cancelPending } = useMemo(() => debounceSave(), [debounceSave]);

    useEffect(() => {
        if (text) {
            save(text);
        }
        
        return () => {
            cancelPending();
        };
    }, [text, save, cancelPending]);

  // Helper functions
    function applyOperation(text: string, operation: any) {
        if (operation.type === 'insert') {
        return text.slice(0, operation.position) + 
                operation.text + 
                text.slice(operation.position);
        } else if (operation.type === 'delete') {
        return text.slice(0, operation.position) + 
                text.slice(operation.position + operation.length);
        }
        return text;
    }

    function getTextOperations(oldText: string, newText: string) {
        // Simple diff implementation - replace with a better one in production
        if (newText.length > oldText.length) {
        // Assume text was inserted at the end
        return [{
            type: 'insert',
            position: oldText.length,
            text: newText.slice(oldText.length)
        }];
        } else if (newText.length < oldText.length) {
        // Assume text was deleted from the end
        return [{
            type: 'delete',
            position: newText.length,
            length: oldText.length - newText.length
        }];
        }
        return [];
    }

    
  
  const ref = useRef<HTMLDivElement>(null);
  
  const onPageClick = () => {
    ref.current?.focus();
  }
    
    
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

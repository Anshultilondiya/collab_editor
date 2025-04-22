import { Button } from "@mui/material"
import { useCallback, useState } from "react"
import { createDocs, getAllDocs } from "../services/docs.service"
import { useSelector } from "react-redux"
import type { TRootState } from "../redux/store"
import { Link } from "react-router"

export const DashboardPage = () => {

    const { userSession } = useSelector((state: TRootState) => state.user)
    
    const [docList, setDocList] = useState<Record<string, any[]>>({})
    const [loading, setLoading] = useState(false)

    const handleCreateDocs = useCallback(async () => {
        const data = await createDocs()
        console.log(data)
    }, [])
    
    const handleGetAllDocs = useCallback(async () => {
        console.log(userSession)
        setLoading(true)
        const userId = (userSession?.user?.id as string) || ""
        const data = await getAllDocs(userId)
        console.log(data)
        setDocList(data)
        setTimeout(() => { setLoading(false) }, 1000)
    }
    , [userSession])



    return (
        <div className={"dashboard-page"}>
            <Button onClick={handleCreateDocs}>Create Docs</Button>
            <Button onClick={handleGetAllDocs}>Get All Docs</Button>

            <ul>
                <li>Documents</li>
                {loading && <li>Loading...</li>}
                <h4>Owned</h4>
                {docList?.owned?.map((doc) => (
                    <li key={doc.id}>
                        <Link to={`/editor/${doc.id}`}>
                            {doc.title}
                        </Link>
                    </li>
                ))}
                <h4>Shared</h4>
                {docList?.shared?.map((doc) => (
                    <li key={doc.id}>
                        <Link to={`/editor/${doc.id}`}>
                            {doc.title}
                        </Link>
                    </li>
                ))}
                {/* {docList.length === 0 && !loading && <li>No documents found</li>} */}
            </ul>
        </div>
    )
}
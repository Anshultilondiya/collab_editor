import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useEffect } from "react"
import supabase from "../supabase"
import { Navigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { UserActions } from "../redux/users/users.slice"
import { Box } from "@mui/material"
import type { TRootState } from "../redux/store"

export const AuthPage = () => {

    const {userSession} = useSelector((state: TRootState) => state.user)
    
    const dispatch = useDispatch()


    useEffect(() => {

      supabase.auth.getSession().then(({ data: { session } }) => {
        dispatch(UserActions.setUserSession(session))
        console.log("session", session)
      })
        
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        dispatch(UserActions.setUserSession(session))
        console.log("session", session)
      })
        
      return () => subscription.unsubscribe()
    }, [dispatch])

    
    if (!userSession) {
      return (
        <Box className="auth-page">
          <h3>Welcome to collab-editor</h3>
        <Auth supabaseClient={supabase}
            providers={[]}
          appearance={{
            theme: ThemeSupa,
            extend: true,
            className: {
                input: "input-field",
              }
            }} />
          
          </Box>
      )
    }
    else {
      return (<Navigate to={"/"} />)
    }
}
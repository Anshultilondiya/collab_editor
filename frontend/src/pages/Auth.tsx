import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useEffect, useState } from "react"
import supabase from "../supabase"
import { Navigate } from "react-router"
import { useDispatch } from "react-redux"
import { UserActions } from "../redux/users/users.slice"

export const AuthPage = () => {

    const [session, setSession] = useState<unknown>(null)
    
    const dispatch = useDispatch()


    useEffect(() => {

      supabase.auth.getSession().then(({ data: { session } }) => {
        dispatch(UserActions.setUserSession(session))
      })
        
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
        
      return () => subscription.unsubscribe()
    }, [dispatch])

    
    if (!session) {
        return (<Auth supabaseClient={supabase}
            providers={[]}
            appearance={{ theme: ThemeSupa }} />)
    }
    else {
      return (<Navigate to={"/dashboard"} />)
    }
}
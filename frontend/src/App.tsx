import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.scss';
import { UserActions } from './redux/users/users.slice';
import { AppRouter } from './router';
import './styles/style.scss';
import supabase from './supabase';
import { loginUser } from './services/user.service'; 


function App() {

    const dispatch = useDispatch()


    useEffect(() => {
      dispatch(UserActions.setUserSessionLoading(true))
      supabase.auth.getSession().then(({ data: { session } }) => {
        dispatch(UserActions.setUserSession(session))
      })
        
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        dispatch(UserActions.setUserSession(session))
        void loginUser(session?.user?.email as string)
      })

      return () => subscription.unsubscribe()
    }, [dispatch])

  
  
  return (
    <Box className="App">
      <AppRouter/>
    </Box>
  )
}

export default App

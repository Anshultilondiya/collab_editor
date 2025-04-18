import { createSlice } from '@reduxjs/toolkit'
import type { UserState } from './users.type'


const initialState: UserState = {
    isAuthenticated: false,
    user: null,
    userSession: null,
}

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserSession: (state, action) => {
      state.userSession = action.payload
      state.isAuthenticated = !!action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const UserActions = userSlice.actions

export const UserReducer =  userSlice.reducer
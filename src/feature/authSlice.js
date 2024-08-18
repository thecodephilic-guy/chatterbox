import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    authStatus: false,
    user: null,
    error: "",
    dbUpdated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setAuthStatus: (state, action) => {
        state.authStatus = action.payload;
      },
  
      setUser: (state, action) => {
        state.user = action.payload;
      },

      setError: (state, action) => {
        state.error = action.payload;
      },
  
      clearError: (state) => {
        state.error = "";
      },
  
      clearUser: (state) => {
        state.authStatus = false,
        state.user = null,
        state.error = ""
      },
      
      setDbUpdated: (state, action) => {
        state.dbUpdated = action.payload;
      }
    },
});

export const {setAuthStatus, setUser, setError, clearError, clearUser, setDbUpdated} = authSlice.actions;

export default authSlice.reducer;
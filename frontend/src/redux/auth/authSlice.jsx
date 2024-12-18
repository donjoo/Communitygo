import {createSlice} from '@reduxjs/toolkit'


const initialState = {

    user : null,
    token:null,
    isAuthenticated:false,

};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData(state,action){
            
            state.user =action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },


        clearAuthData(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});



export const {setAuthData, clearAuthData} = authSlice.actions;
export default authSlice.reducer;


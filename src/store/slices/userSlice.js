import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    email: null,
    nickname: null,
    photoURL: null,
    timer: 30,
    effect: true,
    token: null,
    uid: null,
};

const userSlice  = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser(state, action) {
            state.email = action.payload.email;
            state.nickname = action.payload.nickname;
            state.photoURL = action.payload.photoURL;
            state.timer = action.payload.timer;
            state.effect = action.payload.effect;
            state.token = action.payload.token;
            state.uid = action.payload.uid;
        },
        clearUser(state){
            state.email = null;
            state.nickname = null;
            state.photoURL = null;
            state.timer = null;
            state.effect = null;
            state.token = null;
            state.uid = null;
        },
    }
});

export const {setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
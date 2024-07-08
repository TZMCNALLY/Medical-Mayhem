import { useContext, useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom'
import AuthContext, { UserRoleType } from "../auth";
import {
    LoginScreen,
    AboutScreen,
    SettingsScreen,
    SocialScreen,
    ForumScreen,
    CharacterSearchScreen,
    CharacterBuilderScreen,
    ProfileScreen,
    GameScreen,
    PostScreen,
    NewThreadScreen,
    LeaderboardScreen,
    RegisterScreen,
    HomeWrapper,
    Sidebar,
    InviteModal,
    ForgotPasswordScreen,
    ResetPasswordScreen,
    MessagesDrawer
} from '.'
import GlobalStoreContext from "../store";
import MUIErrorModal from "./MUIErrorModal";
import homeMusic from "../assets/Close_To_Gray.mp3";

export const audio = new Audio(homeMusic);

export default function MainLayout() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [displayInviteModal, setDisplayInviteModal] = useState(false)
    const [displayErrorModal, setDisplayErrorModal] = useState(false)
    const [displaySidebar, setDisplaySidebar] = useState(false)
    const [displayMessages, setDisplayMessages] = useState(false)
    const [inGame, setInGame] = useState(false)

    useEffect(() => {
        console.log(store)
        console.log(store.players)
        setDisplaySidebar(
            auth.loggedIn && // must be logged in
            auth.role !== UserRoleType.GUEST && // can't be a guest
            store.settings.toggles.party && // has the party toggled on
            !inGame && // is not in a game with other players (assumes that once we leave a game this will be cleared)
            !window.location.href.includes('resetPassword')
        )
        setDisplayMessages(
            auth.loggedIn && // must be logged in
            auth.role !== UserRoleType.GUEST && // can't be a guest
            store.settings.toggles.messages && // has the party toggled on
            !inGame && // is not in a game with other players (assumes that once we leave a game this will be cleared)
            !window.location.href.includes('resetPassword')
        )

        if (auth.errorMessage !== "" || store.errorMessage !== "") setDisplayErrorModal(true)
        //eslint-disable-next-line
    }, [auth, store.settings.toggles.party, store.playerList])

    useEffect(() => {
        setInGame(store.players.length > 0)
    }, [store.players])

    useEffect(() => {
        audio.volume = 0.1;
        const playAudio = () => { audio.play(); };
        document.addEventListener('click', playAudio);

        return () => {
            document.removeEventListener('click', playAudio);
        };
    }, []);

    console.log(store)
    return (
        <div id='main-content'>
            <div id='body'>
                <audio loop src={homeMusic}/>
                <Routes>
                    <Route path="/" exact element={<HomeWrapper />} />
                    <Route path="/login/" exact element={<LoginScreen />} />
                    <Route path="/register/" exact element={<RegisterScreen />} />
                    <Route path="/forgotPassword/" exact element={<ForgotPasswordScreen />} />
                    <Route path="/resetPassword/:token" exact element={<ResetPasswordScreen />} />
                    <Route path="/about/" exact element={<AboutScreen />} />
                    <Route path="/settings/" exact element={<SettingsScreen />} />
                    <Route path="/social/" exact element={<SocialScreen />} />
                    <Route path="/forum/" exact element={<ForumScreen />} />
                    <Route path="/charactersearch/" exact element={<CharacterSearchScreen />} />
                    <Route path="/characterbuilder/" exact element={<CharacterBuilderScreen />} />
                    <Route path="/profile/" exact element={<ProfileScreen />} />
                    <Route path="/game/" exact element={<GameScreen />} />
                    <Route path="/post/" exact element={<PostScreen />} />
                    <Route path="/newthread/" exact element={<NewThreadScreen />} />
                    <Route path="/leaderboard/" exact element={<LeaderboardScreen />} />
                </Routes>
                {displayMessages && <MessagesDrawer />}
                <InviteModal displayInviteModal={displayInviteModal} setDisplayInviteModal= {setDisplayInviteModal} inviter={store.inviter} />
                <MUIErrorModal displayErrorModal={displayErrorModal} setDisplayErrorModal= {setDisplayErrorModal} />
            </div>
            {displaySidebar && <Sidebar />}
        </div>
    )
}
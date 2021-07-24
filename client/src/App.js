import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css";
import './App.css';

import {Container, Row, Toast} from "react-bootstrap";
import {BrowserRouter as Router } from "react-router-dom";
import { Route, Switch, Redirect } from 'react-router-dom';
import {useEffect, useState} from "react";

/* Components: */
import MyNavbar from "./components/MyNavbar";
import PublicPage from "./components/PublicPage";
import PrivatePage from "./components/PrivatePage";
import { LoginForm } from "./components/Login";

/* APIs */
import API from "./api/API";
import NewMeme from "./components/NewMeme";

function App() {
    const [memeList, setMemeList] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [activeVisibility, setActiveVisibility] = useState("public");

    const [message, setMessage] = useState('');

    const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
    const [user, setUser] = useState(null);

    const [imagesList, setImagesList] = useState([]);
    const [newMeme, setNewMeme] = useState(false);  // flag

    const defaultFonts = [
        {
            name: "Sans Serif",
            value: "sansserif",
        },
        {
            name: "Cursive",
            value: "cursive"
        },
        {
            name: "Fantasy",
            value: "fantasy"
        },
    ];


    // check whether user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // here you have the user info, if already logged in
                const user = await API.getUserInfo();
                setUser(user);  // { id: ..., username: ..., name: ... }
                setLoggedIn(true);
            } catch (err) {
                console.log(err.error); // mostly unauthenticated user
            }
        };
        checkAuth();
    }, []);


    useEffect(() => {
        if(loggedIn && newMeme) {
            /* retrieve images only for logged-in users */
            API.getImages()
                .then(images =>
                        setImagesList(images)
                ).catch(e => handleErrors(e));
        }
        setNewMeme(false);
    }, [newMeme, loggedIn]);

    // to keep visibility on "private" after a refresh of the web page done by a logged-in user
    useEffect(() => {
        loggedIn ? setActiveVisibility("private") : setActiveVisibility("public");
    }, [loggedIn, dirty]);

    // set dirty to true only if activeVisibility changes, if not dirty = false avoids triggering a new fetch
    useEffect(() => {
        setDirty(true);
    }, [activeVisibility]);

    const findMeme = (id) => {
        return memeList.find(t => t.mID === id);
    }

    const deleteMeme = (memeID) => {
        const meme = findMeme(memeID);

        API.deleteMeme(meme)
            .then(() => setDirty(true))
            .catch(e => handleErrors(e))
    }

    // show error message in toast
    const handleErrors = (err) => {
        setMessage({ msg: err.error, type: 'danger' });
        console.log(err);
    }

    useEffect( () => {
        if (dirty) {
            API.getMemes(activeVisibility)
                .then(memes => {
                        setMemeList(memes);
                        setDirty(false);
                    }
                ).catch(e => handleErrors(e));
        }
    }, [activeVisibility, dirty]);


    const handleMemeInsertionOrCopy = (toBeHandled) => {
        const meme = toBeHandled.find(o => o.description === "newMeme");
        const sentence = toBeHandled.find(o => o.description === "newSentence");

        const handleSentenceInsertion = (sentence) => {
            API.addSentence(sentence).then(s => {
                // God Save The Closure:
                meme[ "sID" ] = s.sID;
                meme[ "uID" ] = user.id;
                meme[ "creator" ] = user.name;
                meme[ "uname" ] = user.username;
                setDirty(true);
            }).then(() => {
                API.addMeme(meme).then(() =>
                    setDirty(true)
                ).catch(e => handleErrors(e));
            }).catch(e => handleErrors(e));
        }

        handleSentenceInsertion(sentence);

    }

    const doLogIn = async (credentials) => {
        try {
            const user = await API.logIn(credentials);
            setUser(user);
            setLoggedIn(true);
        }
        catch (err) {
            // error is handled and visualized in the login form, do not manage error, throw it
            // handleErrors(err)
            throw err;
        }
    }

    const handleLogOut = async () => {
        await API.logOut()
        // clean up everything
        setLoggedIn(false);
        setUser(null);
        setMemeList([]);
        setImagesList([]);
        setDirty(true);
    }

    return (
        <Router>
            <Container fluid>
                <Row>
                    <MyNavbar  loggedIn={loggedIn} onLogOut={handleLogOut} user={user} />
                </Row>

                <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
                    <Toast.Body>{message?.msg}</Toast.Body>
                </Toast>

                <div className="below-nav" />

                <Switch>
                    <Route path="/login">
                        { loggedIn ? <Redirect to="/private" />
                            : <LoginForm login={doLogIn} setDirty={setDirty}
                                         setPrivacy={setActiveVisibility} /> }
                    </Route>

                    <Route path="/public" >
                        { loggedIn ? <Redirect to="/private" />
                            : <PublicPage memeList={memeList}/> }
                    </Route>

                    <Route path="/private">
                        { loggedIn ? <PrivatePage memeList={memeList} fonts={defaultFonts} user={user}
                                                  onSave={handleMemeInsertionOrCopy}
                                                  setNewMeme={setNewMeme} deleteMeme={deleteMeme} />
                            : <Redirect to="/public"/> }
                    </Route>

                    <Route path="/add">
                        { loggedIn ? <NewMeme className="below-nav" imagesList={imagesList}
                                       onSave={handleMemeInsertionOrCopy} fonts={defaultFonts} />
                            : <Redirect to="/public"/> }
                    </Route>

                    <Route>
                        <Redirect to="/public"/>
                    </Route>
                </Switch>

            </Container>
        </Router>
    );
}

export default App;

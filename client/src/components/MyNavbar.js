import { Navbar, Nav } from "react-bootstrap";
import ICON from "../icons/icons";
import {LoginButton, LogoutButton} from "./Login";
import {Link} from "react-router-dom";

function MyNavbar(props) {

    return(
        <Navbar bg="dark" expand="sm" variant="dark" fixed="top">
            <Navbar.Toggle aria-controls="left-sidebar"/>
            <Nav>
                <Navbar.Brand className="mr-auto">
                    <Link to="/public">
                        {ICON.doggoNavbar}
                    </Link>
                </Navbar.Brand>
            </Nav>
            <Nav className="ml-md-auto">
                <Navbar.Brand className="mr-auto">
                    <Link to="/public">
                        <Navbar.Brand className="nav-title" style={{color: "#dbd500"}}>
                            Meme Generator
                        </Navbar.Brand>
                    </Link>
                </Navbar.Brand>
            </Nav>
            <Nav className="ml-md-auto">
                <Nav.Link>
                    { props.loggedIn ?
                        <>
                            <i><b style={{color: "#dbd500"}}>
                                {props.user.name}
                            </b></i>
                            &nbsp;
                            <LogoutButton logout={props.onLogOut} />
                        </>
                        : <LoginButton /> }
                </Nav.Link>
            </Nav>

        </Navbar>

    );
}

export default MyNavbar;
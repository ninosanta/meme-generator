import {Form, Button, Alert, Modal, InputGroup} from 'react-bootstrap';
import {useState} from "react";
import {Link} from "react-router-dom";
import ICON from "../icons/icons"

export function LoginForm(props) {
    const [username, setUsername] = useState("john.doe@polito.it");
    const [password, setPassword] = useState("password");
    const [show, setShow] = useState(false);  // for the modal
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        // basic validation
        let valid = true;
        if (username === '' || password === '' || password.length < 6) {
            valid = false;
            setErrorMessage('Email cannot be empty and password must be at least six character long.');
            setShow(true);
        }

        if(valid)
        {
            props.login(credentials)
                .catch( (err) => { setErrorMessage(err); setShow(true); } );
            props.setPrivacy("private");
            props.setDirty();
        }
    };


    return (
        <Modal centered show animation={false}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant="danger">
                        {errorMessage}
                    </Alert>
                    <Form.Group controlId="username">
                        <Form.Label>email</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control
                                type="email"
                                placeholder="email@example.com"
                                aria-describedby="inputGroupPrepend"
                                required
                                value={username}
                                onChange={(ev) => setUsername(ev.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>password</Form.Label>
                        <InputGroup hasValidation>
                                <Button id="password-addon" onClick={ () => setShowPassword(old => !old) }>
                                    { showPassword ? ICON.showPwd : ICON.hidePwd }
                                </Button>
                                <Form.Control
                                    type={ showPassword ? "text" : "password" }
                                    placeholder="password"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                    value={password}
                                    onChange={(ev) => setPassword(ev.target.value)}
                                />
                        </InputGroup>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Login</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}


export function LoginButton(props) {
    return (
        <Link to="/login">
            <Button variant="primary" >
                Login
            </Button>
        </Link>
    );
}

export function LogoutButton(props) {
    return (
        <Button variant="danger" onClick={props.logout}>Logout</Button>
    );
}
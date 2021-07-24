import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import {Redirect} from "react-router-dom";


const ModalAddOrCopy = (props) => {
    const {meme, image, onSave, onHide, show, fonts, user} = props;

    /* Variables that depend on meme as a prop */
    const top = (meme ? meme.top : image.top);
    const middle = (meme ? meme.middle : image.middle);
    const bottom = (meme ? meme.bottom : image.bottom);
    const iID = (meme ? meme.iID : image.iID);
    const name = (meme ? meme.name : image.name);
    const disabled = ((meme && meme.visibility === "private"  && meme.uname !== user.username) ? "disabled" : "" );

    const [title, setTitle] = useState(meme ? meme.title : "");
    const [topText, setTopText] = useState(meme ? meme.text1 : "");
    const [middleText, setMiddleText] = useState(meme ? meme.text2 : "");
    const [bottomText, setBottomText] = useState(meme ? meme.text3 : "");
    const [isPrivate, setIsPrivate] = useState(meme && meme.visibility === "private");
    const [font, setFont] = useState(meme ? meme.font : "");
    const [color, setColor] = useState(meme ? meme.color : "#6800FF");  // if meme.color is not a hex color the default value of the color picker will be black

    // enables / disables react-bootstrap validation report
    const [validated, setValidated] = useState(false);

    // error message shows if at least a text field is not compiled
    const [showError, setShowError] = useState(false);
    const handleClose = () => setShowError(false);
    const handleShow = () => setShowError(true);

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        // stop event default and propagation
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // check if form is valid using HTML constraints
        if (!form.checkValidity()) {
            setValidated(true); // enables bootstrap validation error report
        } else {
            // we must re-compose the task object from its separated fields
            // deadline propery must be created from the form date and time fields
            // id must be created if already present (edit) not if the task is new

            if (topText || middleText || bottomText) {

                const toBeMerged = [
                    {
                        description: "newMeme",
                        // mID -> assigned by the DB
                        iID: iID,
                        // sID -> assigned after the sentence insertion
                        // uID -> assigned by the handler function
                        // creator -> assigned by the handler function
                        // uname -> assigned by the handler function
                        title: title,
                        visibility: isPrivate ? "private" : "public",
                    },
                    {
                        description: "newSentence",
                        // sID -> assigned by the DB
                        iID: iID,
                        text1: topText,
                        text2: middleText,
                        text3: bottomText,
                        font: font,
                        color: color,
                    },
                ];

                onSave(toBeMerged);
                onHide();  // useless
                setSubmitted(true);
            } else {
                handleShow();
            }
        }
    }

    // noValidate: You can disable the default UI by adding the HTML noValidate attribute to your <Form> or <form> element.
    // Form.Control.Feedback : reports feedback in react-bootstrap style
    // since the modal is added to the page only when needed the show flag can be always true
    return (
        <>
            { submitted && <Redirect to="/private" /> }
            <Modal show={show} onHide={onHide} animation={true} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new meme</Modal.Title>
                </Modal.Header>
                <Modal.Title>
                    You have selected <font color="red"> {name} </font> as a meme template!
                    Let's complete the other properties.<br />
                    { validated ? <font color="red"> At least  a text field must be filled! </font>
                        : <></> }
                </Modal.Title>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group controlId="meme-title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" placeholder="Enter the title of the meme"
                                          value={title}
                                          onChange={(ev) => setTitle(ev.target.value)}
                                          required autoFocus />
                            <Form.Control.Feedback type="invalid">
                                Please, provide a title.
                            </Form.Control.Feedback>
                        </Form.Group>

                        { (top === 1) ?
                            <Form.Group controlId="meme-top-text">
                                <Form.Label>Top text</Form.Label>
                                <Form.Control type="text" name="top-text" placeholder="Enter the top text"
                                              value={topText}
                                              onChange={(ev) =>
                                                  setTopText(ev.target.value)} autoFocus />
                            </Form.Group>
                            :   <></> }

                        { (middle === 1) ?
                            <Form.Group controlId="meme-middle-text">
                                <Form.Label>Middle text</Form.Label>
                                <Form.Control type="text" name="middle-text" placeholder="Enter the middle text"
                                              value={middleText}
                                              onChange={(ev) =>
                                                  setMiddleText(ev.target.value)} autoFocus />
                            </Form.Group>
                            : <></> }

                        { (bottom === 1) ?
                            <Form.Group controlId="meme-bottom-text">
                                <Form.Label>Bottom text</Form.Label>
                                <Form.Control type="text" name="bottom-text" placeholder="Enter the bottom text"
                                              value={bottomText}
                                              onChange={(ev) =>
                                                  setBottomText(ev.target.value)} autoFocus />
                            </Form.Group>
                            : <></> }

                        <Form.Group controlId="form-is-private">
                            {
                                    <Form.Check custom type="switch" label="Private" name="isPrivate"
                                                checked={isPrivate}
                                                disabled={disabled}
                                                onChange={(ev) => setIsPrivate(ev.target.checked)} />
                            }
                        </Form.Group>

                        <Form.Group controlId="form-font">
                            <Form.Label>Font</Form.Label>
                            <Form.Control as="select" defaultValue={font}
                                          onChange={ev => setFont(ev.target.value)}
                                          required >
                                <option value="" disabled hidden> Choose a font... </option>
                                { fonts.map(font => <option key={font.value} value={font.value}>
                                    {font.name}
                                </option>) }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="form-color">
                            <Form.Label htmlFor="exampleColorInput">Pick a color</Form.Label>
                            <Form.Control
                                type="color"
                                id="exampleColorInput"
                                defaultValue={color}
                                title="Choose your color"
                                onChange={ev => setColor(ev.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide} > Close </Button>
                        <Button variant="primary" type="submit"> Save </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <ModalError show={showError} handleClose={handleClose} />
        </>
    );
}

function ModalError(props) {
    const { show, handleClose } = props;
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Form not valid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3><font color="red" > Fill at least one of the text field </font></h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default ModalAddOrCopy;

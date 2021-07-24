import {Button, ListGroup, Modal} from "react-bootstrap";


function ShowProperties(props) {
    return (
        <>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Meme's properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup variant="flush" >
                        <ListGroup.Item variant="info">Title: {props.title}</ListGroup.Item>
                        <ListGroup.Item variant="info">Created by: {props.creator}</ListGroup.Item>
                        <ListGroup.Item variant="info">Username: {props.uname}</ListGroup.Item>
                        <ListGroup.Item variant="info">Visibility: {props.visibility}</ListGroup.Item>
                        <ListGroup.Item variant="info">Used font: {props.font}</ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ShowProperties;
import {Button, Col, Container, Row} from "react-bootstrap";
import ModalAddOrCopy from "./ModalAddOrCopy";
import {useState} from "react";
import ShowProperties from "./ShowProperties";

function PrivateMeme(props) {

    const {meme, user, fonts, onSave, deleteMeme} = props;

    const [modalShow, setModalShow] = useState(false);  // modal-form

    const onShow = () => setModalShow(true);
    const onHide = () => setModalShow(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <>
            <div className="container">

                <h2 className="padding-meme memeTitle" style={{fontFamily: `${meme.font}`, color: `${meme.color}`}} >
                    <Container>
                        <Row>
                            <Col sm={2}>
                                {
                                    (meme.uname === user.username) ?
                                        <Button variant="danger" size="md" active style={{position: "absolute", left: 15}}
                                                onClick={ () => deleteMeme(meme.mID) }
                                        >
                                            Delete
                                        </Button> :
                                        <Button variant="secondary" size="md" disabled
                                                style={{position: "absolute", left: 15}}
                                        >
                                            Delete
                                        </Button>
                                }
                            </Col>
                            <Col >
                                {meme.title}
                            </Col>
                            <Col sm={2}>
                                <Button variant="primary" size="md" active style={{position: "absolute", right: 15}}
                                        onClick={onShow}
                                >
                                    Copy
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </h2>

                <div className="container">
                    <img src={meme.path} className="img-show" alt={`Meme titled ${meme.title}`} onClick={handleShow} />
                    <div className={`${meme.position}-top-${meme.top}`} >
                        <h3 style={{fontFamily: `${meme.font}`, color: `${meme.color}`}}>
                            {
                                meme.text1 || undefined
                            }
                        </h3>
                    </div>

                    <div className={`${meme.position}-middle-${meme.middle}`} >
                        <h3 style={{fontFamily: `${meme.font}`, color: `${meme.color}`}}>
                            {
                                meme.text2 || undefined
                            }
                        </h3>
                    </div>

                    <div className={`${meme.position}-bottom-${meme.bottom}`} >
                        <h3 style={{fontFamily: `${meme.font}`, color: `${meme.color}`}}>
                            {
                                meme.text3 || undefined
                            }
                        </h3>
                    </div>

                </div>

                <ModalAddOrCopy meme={meme} onSave={onSave} show={modalShow} onHide={onHide}
                                fonts={fonts} user={user} />

                <ShowProperties show={show} handleClose={handleClose}
                                title={meme.title} visibility={meme.visibility} creator={meme.creator}
                                font={meme.font} uname={meme.uname}
                />
            </div>
        </>
    );
}

export default PrivateMeme;
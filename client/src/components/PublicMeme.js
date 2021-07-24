import ShowProperties from "./ShowProperties";
import {useState} from "react";

function PublicMeme(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <h1 className="padding-meme memeTitle" style={{fontFamily: `${props.font}`, color: `${props.color}`}} >
                {props.title}
            </h1>
            <div className="container">
                <img src={props.path} className="img-show" alt={`Meme titled ${props.title}`} onClick={handleShow}/>
                <div className={`${props.position}-top-${props.top}`} >
                    <h3 style={{fontFamily: `${props.font}`, color: `${props.color}`}}>
                        {
                            props.text1 || undefined
                        }
                    </h3>
                </div>

                <div className={`${props.position}-middle-${props.middle}`} >
                    <h3 style={{fontFamily: `${props.font}`, color: `${props.color}`}}>
                        {
                            props.text2 || undefined
                        }
                    </h3>
                </div>
                <div className={`${props.position}-bottom-${props.bottom}`} >
                    <h3 style={{fontFamily: `${props.font}`, color: `${props.color}`}}>
                        {
                            props.text3 || undefined
                        }
                    </h3>
                </div>

                <ShowProperties show={show} handleClose={handleClose}
                                title={props.title} visibility={props.visibility} creator={props.creator}
                                font={props.font} uname={props.uname}
                />

            </div>
        </>
    );
}

export default PublicMeme;
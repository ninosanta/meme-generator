import ModalAddOrCopy from "./ModalAddOrCopy";
import {useState} from "react";

function NewMeme(props) {

    const { onSave, imagesList, fonts } = props;

    return (
        <>
            <h1 style={{textAlign: "center"}}> Select a template to start with: </h1>
            <br />
            {
                imagesList.map( (i) =>
                    <ClickableImage key={`${i.iID}+${i.name}`} image={i}
                        onSave={onSave} fonts={fonts} /> )
            }

        </>
    );
}

function ClickableImage(props) {
    const { image, onSave, fonts } = props;

    const [modalShow, setModalShow] = useState(false);  // modal-form

    const onShow = () => setModalShow(true);
    const onHide = () => setModalShow(false);

    return (
        <div className="container padding-meme">
            <img src={image.path} className="img-show" alt={`Meme template at ${image.path}`}
                 onClick={onShow} />

            <ModalAddOrCopy onSave={onSave} show={modalShow} onHide={onHide}
                            image={image}
                            fonts={fonts} />
        </div>
    );

}

export default NewMeme;
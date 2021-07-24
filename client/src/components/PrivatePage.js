import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

import PrivateMeme from "./PrivateMeme";


function PrivatePage(props) {

    return(
        <>
            <h1 style={{textAlign: "center"}}> Click on an empty meme's spot to see its proprieties </h1>
            <br/>
            {
                props.memeList.map( (m) =>
                    <PrivateMeme key={m.mID} deleteMeme={props.deleteMeme} user={props.user}
                                 meme={m} fonts={props.fonts} onSave={props.onSave} />
                )
            }

            <Link to="/add">
                <Button variant="primary" size="lg" className="fixed-right-bottom"
                 onClick={() => props.setNewMeme(true)}> + </Button>
            </Link>
        </>
    );
}

export default PrivatePage;
import PublicMeme from "./PublicMeme"

function PublicPage(props) {
    return(
        <>
            <h1 className="h-center"> Click on a meme to see its properties </h1>
            <br/>
            {
               props.memeList.map( (m) =>
                    <PublicMeme key={m.mID} mID={m.mID} title={m.title} visibility={m.visibility} text1={m.text1}
                          text2={m.text2} text3={m.text3} font={m.font} color={m.color}
                          path={m.path} creator={m.creator} box_count={m.box_count} position={m.position}
                          top={m.top} middle={m.middle} bottom={m.bottom} uname={m.uname} />
               )
            }
        </>
    );
}

export default PublicPage;
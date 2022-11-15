import React from 'react';


const PopUpResponseMessage = ({ statusCode, message }) => {
    function decideColor() {
        if (200 <= statusCode && statusCode < 300)
            return "success"
        if (400 <= statusCode && statusCode < 600)
            return "danger"
    }
    
    return (
        <div className={`alert alert-${decideColor()}`} role="alert">
            <div style={{ fontSize: "30px", fontWeight: 900, textAlign: "center"  }}> {statusCode}</div> <br />
            <div style={{ fontSize: "17px", textAlign: "justify"} } dangerouslySetInnerHTML={{ __html:message }}>
                </div>
        </div>
    )
}
export default PopUpResponseMessage;

/*className = {`alert alert-${decideColor()}`}*/
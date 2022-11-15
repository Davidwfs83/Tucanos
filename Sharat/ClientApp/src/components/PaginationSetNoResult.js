import React from 'react';


const PaginationSetNoResult = () => {
    return (
        <div style={{ fontSize:"30px", textAlign:"center" }}>
            <span style={{ paddingRight:"25px", fontSize:"50px" }} >&#9785;</span>
            No Results For This Query, Try Another!
            <span style={{ paddingLeft:"25px", fontSize:"50px" }} >&#9785;</span>
        </div>
    )
}

export default PaginationSetNoResult;
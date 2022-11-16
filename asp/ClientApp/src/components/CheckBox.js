import React from 'react';

const CheckBox = ({name, onChange, imgLink, value}) => {
    return (
        <div className="checkbox">
            <label>
                <input type="checkbox" checked={value} onChange={onChange} />
                {
                    (imgLink === null || imgLink === undefined) ?
                        null :
                        (<img alt="" src={imgLink} style={{ marginRight: "15px", width: "17px", height: "10px" }} />)
                }
                <span>{name}</span>
                
            </label>
        </div>
    )
}
export default CheckBox
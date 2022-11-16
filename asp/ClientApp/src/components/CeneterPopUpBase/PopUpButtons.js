import React from 'react';

const PopUpButtons = ({positiveOnClick, positiveText, negativeOnClick, negativeText }) => {
    return (
        <div className="control text-center">
            <a onClick={positiveOnClick} className="button button-brand">{positiveText}</a>
            <a href={negativeOnClick} className="button button-danger">{negativeText}</a>
        </div>
    )
}
export default PopUpButtons;
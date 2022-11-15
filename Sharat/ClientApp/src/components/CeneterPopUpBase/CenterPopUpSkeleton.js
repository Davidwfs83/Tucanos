import React from 'react';

// High Order Component
const CenterPopUpSkeleton = (PopUpContent, popUpId) => {
   
    return () => {
        return (
            <div className='modal' id={popUpId}>
                <div className="modal-dialog modal-dialog-centered max500">
                    <div className="modal-content">
                        <div className="modal-create">
                            <div className="close-modal" data-dismiss="modal" aria-label="Close"></div>
                            <div className="mm-box">
                                <div className="mm-content">
                                    <PopUpContent />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default CenterPopUpSkeleton;
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ResetPopUpData } from '../../redux/CenterPopUp/ceneterpopup.actions';
import $ from 'jquery';

const PopUpCleaner = ({popUpId }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        window.$(`#${popUpId}`).on('hidden.bs.modal', () => {
            dispatch(ResetPopUpData());
        });

    }, []);
    return (
        <div>
        </div>
        )
}
export default PopUpCleaner;
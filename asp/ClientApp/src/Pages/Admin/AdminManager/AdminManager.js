import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import PageTitle from '../../../components/PageTitle';
import AdminManagerQueryGen from './AdminManagerQueryGen';
import AdminEntity from '../../../components/EntityComponent/AdminEntity';
import PaginationSetNavigtaion from '../../../components/PaginationSetNavigation';
import { LoadPopUpData, ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { SetDisplayingEntity, ResetPaginationSet } from '../../../redux/PaginationSet/paginationset.actions';

const AdminManager = (props) => {


    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - Admin Manager'
    }, []);

    // Intialize Pagination and clean up for pagination and pop up
    useEffect(() => {
        props.SetAdminsAsDisplayingEntitiy();
        return () => {
            props.ResetPaginationSet();
            props.ResetPopUp();
        }
    }, []);



    // Reset Center Pop Up section in redux store when bootstrap modal go backs into hiding
    useEffect(() => {
        window.$('#admin4AdminManagerAdd').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
        window.$('#admin2AdminManUpdateAdmin').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
    }, []);
 
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="Airline Manager" />
                </div>
                <div>
                    {
                        props.level > 3 ?
                            (
                                <div className="field mb-0">
                                    <div className="field-wrap">
                                        <button className="button button-brand" data-toggle="modal" data-target="#admin4AdminManagerAdd" >
                                            <i className="fa fa-solid fa-plus-circle mr-2"></i>
                        Add Admin</button>
                                    </div>
                                </div>
                            )
                            : null
                    }
                </div>
            </div>
            <AdminManagerQueryGen level={props.level} />
            <div className="block">
                {props.admins.map(admin => (
                    <div key={admin.adminId} onClick={() => {
                        props.LoadUpdatePopUpData(admin);
                        window.$('#admin2AdminManUpdateAdmin').modal('show');
                    }} >
                        <AdminEntity  {...admin} />
                    </div>
                )
                )}
            </div>
            <PaginationSetNavigtaion />
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    admins: paginationSet.CurrentEntities.EntityData
});

const mapDispatchToProps = dispatch => ({
    ResetPaginationSet: () => dispatch(ResetPaginationSet()),
    SetAdminsAsDisplayingEntitiy: () => dispatch(SetDisplayingEntity("Admins")),
    LoadUpdatePopUpData: airline => dispatch(LoadPopUpData(airline)),
    ResetPopUp: () => dispatch(ResetPopUpData())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminManager);



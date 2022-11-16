import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../../../components/PageTitle';
import CustomerManagerQueryGen from './CustomerManagerQueryGen';
import CustomerEntity from '../../../components/EntityComponent/CustomerEntity';
import PaginationSetNavigtaion from '../../../components/PaginationSetNavigation';
import { LoadPopUpData, ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { SetDisplayingEntity, ResetPaginationSet } from '../../../redux/PaginationSet/paginationset.actions';
import { isEmptyArr, isEmptyObject } from '../../../services/Utility';
import PaginationSetNoResult from '../../../components/PaginationSetNoResult';

const CustomerManager = (props) => {

    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - Customer Manager'
    }, []);

    useEffect(() => {
        props.SetCustomersAsDisplayingEntitiy();
    }, []);

    // Reset Pagination Set section in redux store
    useEffect(() => {
        return () => {
            props.ResetPaginationSet();
            
        }
    }, []);
    const renderAddButtonDecider = () => {
        return props.level >= 2 ?
            (<div className="field mb-0">
                <div className="field-wrap">
                    <button className="button button-brand" data-toggle="modal" data-target="#admin2CustomerManagerAdd" >
                        <i className="fa fa-solid fa-plus-circle mr-2"></i>
                        Add Customer</button>
                </div>
            </div>
            ) :
            (
                <div className="field mb-0">
                </div>
            )
    }
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="Customer Manager" />
                </div>
                <div>
                    {renderAddButtonDecider()}
                </div>
            </div>
            <CustomerManagerQueryGen />
            <div className="block">
                {
                    (isEmptyArr(props.customers) && (!isEmptyObject(props.query))) ?
                        (<PaginationSetNoResult />) : (
                            props.customers.map(customer => (
                                <div key={customer.id} onClick={() => {
                                    props.LoadUpdatePopUpData({ ...customer });
                                    window.$('#admin2CusManUpdateCus').modal('show');
                                }} >
                                    <CustomerEntity  {...customer} />
                                </div>
                            )
                            ))
                }
            </div>
            <PaginationSetNavigtaion />
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    customers: paginationSet.CurrentEntities.EntityData,
    query: paginationSet.Query
});

const mapDispatchToProps = dispatch => ({
    ResetPaginationSet: () => dispatch(ResetPaginationSet()),
    SetCustomersAsDisplayingEntitiy: () => dispatch(SetDisplayingEntity("Customers")),
    LoadUpdatePopUpData: customer => dispatch(LoadPopUpData(customer, "Customer")),
    ResetPopUp: () => dispatch(ResetPopUpData())
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerManager);



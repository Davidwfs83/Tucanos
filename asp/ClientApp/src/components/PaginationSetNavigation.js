import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { EntitiesPerPage } from '../redux/PaginationSet/paginationset.reducer';
import { PrevPage, NextPage } from '../redux/PaginationSet/paginationset.actions';

const PaginationSetNavigtaion = (props) => {
    const transperentButton = () => {
        return (<div
            className=" button-brand w-100"
        ></div>)
    }
    return (
        <div className="pt-2">
            <div className="d-flex justify-content-between">

                <div>
                    {
                        props.pageNumber === 1 ?
                            transperentButton() :
                            (
                                <button
                                    className="button button-brand w-100"
                                    onClick={props.prevPage}
                                >
                                    <i className="fa fa-solid fa-angle-left mr-2"></i>
									Back</button>
                            )
                    }

                </div>
                <div>
                    <div className="paging">
                        <Link to="#">{props.pageNumber}</Link>
                    </div>
                </div>
                <div>
                    {
                        props.pageNumber * EntitiesPerPage > props.presentingEntitiesCount ?
                            transperentButton() :
                            (
                                <button
                                    className="button button-brand w-100"
                                    onClick={props.nextPage}
                                    
                                >
                                    Next <i className="fa fa-solid fa-angle-right ml-2"></i></button>
                            )
                    }                    
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
        pageNumber: paginationSet.PageNumber,
        presentingEntitiesCount: paginationSet.CurrentEntities.EntityType === "" ? 0 :
            paginationSet.Entities[paginationSet.CurrentEntities.EntityType].length
    })
;
const mapDispatchToProps = dispatch => ({
    prevPage: () => dispatch(PrevPage()),
    nextPage: () => dispatch(NextPage())
});
export default connect(mapStateToProps, mapDispatchToProps)(PaginationSetNavigtaion);

﻿import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import {
    AddEntity,
    SetDisplayingEntity
} from '../../redux/PaginationSet/paginationset.actions';
import { LoadPopUpData } from '../../redux/CenterPopUp/ceneterpopup.actions';
import { ResetPaginationSet  } from '../../redux/PaginationSet/paginationset.actions';
import { GetActiveTickets } from '../../services/ApiServices/CustomerApi';
import TicketEntity from '../../components/EntityComponent/TicketEntity';
import PaginationSetNavigtaion from '../../components/PaginationSetNavigation';
import PageTitle from '../../components/PageTitle';



const CustomerActiveTickets = (props) => {

    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - Active Tickets'
    }, []);

    useEffect(() => {
        props.SetTicketsAsDisplayingEntity();
        GetActiveTickets().then(response => {
            props.AddTickets(response.data.info)
        });
        return () => {
            props.ResetPaginationSet();
        }
    }, []);
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="Active Tickets" />
                </div>
                <div>
                    
                </div>
            </div>            
            <div className="block">
                {props.tickets.map(ticket => (
                    <div key={ticket.ticketId} onClick={() => {
                        props.LoadUpdatePopUpData(ticket);
                        window.$('#customerTicketDetails').modal('show');
                    }}                                        
                    >
                        <TicketEntity   {...ticket} />
                    </div>
                )
                )}
            </div>
            <PaginationSetNavigtaion />
        </div>
        )
}

const mapStateToProps = ({ paginationSet }) => ({
    tickets: paginationSet.CurrentEntities.EntityData
});

const mapDispatchToProps = dispatch => ({
    AddTickets: tickets => dispatch(AddEntity(tickets, "Tickets")),
    SetTicketsAsDisplayingEntity: () => dispatch(SetDisplayingEntity("Tickets")),
    LoadUpdatePopUpData: ticket => dispatch(LoadPopUpData(ticket)),
    ResetPaginationSet: () => dispatch(ResetPaginationSet())
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerActiveTickets);
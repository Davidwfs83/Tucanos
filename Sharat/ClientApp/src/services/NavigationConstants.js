export const AnonymousNavigation = {
    RootUrl: "/",
    Homgepage: { title: "Homgepage", Url: "/" },
    FlightSearch: { title: "Flight Search", Url: "/FlightSearchEngine" },
    SingleFlight: { Url: "/Flight/:flightId", CalcUrl: flightId => `/Flight/${flightId}`},
    TechnicalOverview: {  Url: "/TechnicalOverview" },
    ErrorPage:{Url: "/ErrorPage"},
    RegisterPage: {title: "Register Page", Url: "/Register"}
}

export const DashboardNavigation = {
    RootUrl: "/Dashboard",
    Default: "/Dashboard/MyDetails",
    Customer: {
        MyDetails: { title: "My Details", Url: "/Dashboard/MyDetails" },
        ActiveTickets: { title: "Active Tickets", Url: "/Dashboard/ActiveTickets" },
        TicketHistory: { title: "Ticket History", Url: "/Dashboard/TicketHistory" }
    },
    Airline: {
        MyDetails: { title: "My Details", Url: "/Dashboard/mydetails" },
        MyFlights: { title: "My Flights", Url: "/Dashboard/MyFlights" },
        MyReviews: { title: "My Reviews", Url: "/Dashboard/myreviews" }
    },
    AdminLevelOne: {
        MyDetails: { title: "My Details", Url: "/Dashboard/Mydetails" },
        CustomerManager: { title: "Customer Manager", Url: "/Dashboard/CustomerManager" },
        AirlineManager: { title: "Airline Manager", Url: "/Dashboard/AirlineManager" }
    },
    AdminLevelTwo: {
        
    },
    AdminLevelThree: {
        AdminManager: { title: "Admin Manager", Url: "/Dashboard/AdminManager" },
        CountryManager: { title: "Country Manager", Url: "/Dashboard/CountryManager" }
    },
    AdminLevelFour: {
        DataGenerator: { title: "Data Generator", Url: "/Dashboard/DataGenerator" },
        FlightManager: { title: "Flight Manager", Url: "/Dashboard/FlightManager" },
        ReviewManager: { title: "Review Manager", Url: "/Dashboard/ReviewManager" },
        TicketManager: { title: "Ticket Manager", Url: "/Dashboard/TicketManager" }
    }
}

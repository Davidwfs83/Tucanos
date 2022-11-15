import React from 'react';
import ErrorPage from '../Pages/Anonymous/ErrorPage';






class ErrBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false};
    }

    

    componentDidCatch(error, errorInfo) {       
        this.setState({ hasError: true });
        
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
            console.log("---------------------------------------------------");
            console.log(errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (<div><ErrorPage/></div>);
        }

        return this.props.children;
    }
}


export default ErrBoundary;
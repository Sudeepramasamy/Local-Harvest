import React from "react";
import { Link } from "react-router-dom";

const Footer=()=>{
    return(
        <footer className="footer">
            <nav className="footer-nav">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/feedback">Feedback</Link>
            </nav>
        </footer>
    );
};
export default Footer;
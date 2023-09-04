import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import catgorieSeed from './config/seed'

const navBar = () => {
    const categories = categorieSeed
    
    return (
        <nav className="navbar">
            <div className="navbar-logo">         
                <Link to="/">
                    <img src="public/img/logo.png" alt="logo" />
                </Link>
            </div> 
            <div className="navbar-search">
                <input type="text" placeholder="Search for products..." />
            </div>
            <div className="navbar-categories">
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>
                            <Link to={`/category/${category.name}`}>{category.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-icons">
                <Link to="/favorites">
                    <div>
                        <i className="heart"></i>
                        <img src="public/img/Favorite Heart.png" alt="heart" />
                     </div>    
                </Link>
                <Link to="/cart">
                    <div>
                        <i className="cart"></i>
                        <img src="public/img/Cart Icon.png" alt="cart" />
                    </div> 
                </Link>
                <Link to="/store">
                    <div>
                        <i className="store"></i>
                        <img src="public/img/Store Icon.png" alt="store" />
                    </div> 
                </Link>
                <div className="navbar-user">
                    {isloggedIn ? (
                        //Display user profile info if logged in
                        <>
                            <img src={user.profileImage} alt="Profile" />
                            <span>{user.name}</span>
                            <Link to="/logout">Logout</Link>
                        </>
                    ) : (
                        //Display "log in" if not logged in 
                        <>
                        <img src="public/img/User Icon.png" alt="user" />
                        <Link to="/login"></Link>
                        </>
    
                    )}
                </div>
            </div>
        </nav>
    )
}

export default navBar 
import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header/Header';
import response from "../locals/products.json";
import { CartProvider } from '../context/CartContext';
export default class MainLayout extends Component {

    render() {
        const param = window.location.pathname.split("/")[2];



        return (
            <>

                <Header items={response.data.categories} params={param} />

                <Outlet />
            </>
        )
    }
}

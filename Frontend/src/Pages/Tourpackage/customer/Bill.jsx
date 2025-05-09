import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Bill.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

const Bill = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { formData, packagePrice: basePrice } = location.state || {};

    const [customerDetails, setCustomerDetails] = useState({
        customerName: formData?.customerName || '',
        email: formData?.email || '',
        contactNumber: formData?.contactNumber || '',
        numberOfPeople: formData?.numberOfPeople ? Number(formData.numberOfPeople) : 1,
        address: formData?.address || '',
        startDate: formData?.startDate || '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [updatedTotalPrice, setUpdatedTotalPrice] = useState(0);

    const calculateTotalPrice = (details) => {
        return basePrice * (details.numberOfPeople || 1);
    };

    useEffect(() => {
        setUpdatedTotalPrice(calculateTotalPrice(customerDetails));
    }, [customerDetails]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === 'numberOfPeople') {
            updatedValue = parseInt(updatedValue, 10);
            if (isNaN(updatedValue) || updatedValue < 1) {
                alert('Number of people must be at least 1.');
                return;
            }
        }

        if (name === 'customerName' && /[^a-zA-Z\s]/.test(updatedValue)) {
            alert('Name should contain only letters and spaces.');
            return;
        }

        if (name === 'contactNumber') {
            if (!/^\d*$/.test(updatedValue)) {
                alert('Contact number should contain only digits.');
                return;
            }
            if (updatedValue.length > 10) {
                alert('Contact number should not exceed 10 digits.');
                return;
            }
        }

        setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: updatedValue,
        }));
    };

    const handlePay = async () => {
        try {
            const response = await axios.post('https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/api/book', {
                customerName: customerDetails.customerName,
                email: customerDetails.email,
                contactNumber: customerDetails.contactNumber,
                numberOfPeople: customerDetails.numberOfPeople,
                address: customerDetails.address,
                totalPrice: updatedTotalPrice,
                cardName: formData?.cardName || 'Unknown',
                startDate: customerDetails.startDate,
            });

            alert(response.data.message);
            navigate('/packages');
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            alert('Error saving booking: ' + message);
        }
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
        if (confirmDelete) {
            alert('Booking deleted successfully!');
            navigate('/');
        }
    };

    const today = new Date();
    const billingDate = today.toLocaleDateString();
    const billingTime = today.toLocaleTimeString();

    return (
        <div className="bill-container">
            <button className="bill-back-button" onClick={() => window.history.back()}>
                Back
            </button>
            <h1>Booking Details</h1>
            <div className="bill-details">
                <h2>Customer Details</h2>
                {isEditing ? (
                    <>
                        <div className="bill-form-group">
                            <label>Name:</label>
                            <input 
                                type="text" 
                                name="customerName" 
                                value={customerDetails.customerName} 
                                onChange={handleChange} 
                                className="bill-input"
                            />
                        </div>
                        <div className="bill-form-group">
                            <label>Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={customerDetails.email} 
                                onChange={handleChange} 
                                className="bill-input"
                            />
                        </div>
                        <div className="bill-form-group">
                            <label>Contact Number:</label>
                            <input 
                                type="tel" 
                                name="contactNumber" 
                                value={customerDetails.contactNumber} 
                                onChange={handleChange} 
                                className="bill-input"
                            />
                        </div>
                        <div className="bill-form-group">
                            <label>Number of People:</label>
                            <input 
                                type="number" 
                                name="numberOfPeople" 
                                value={customerDetails.numberOfPeople} 
                                onChange={handleChange} 
                                min="1" 
                                className="bill-input"
                            />
                        </div>
                        <div className="bill-form-group">
                            <label>Address:</label>
                            <textarea 
                                name="address" 
                                value={customerDetails.address} 
                                onChange={handleChange}
                                className="bill-input"
                            ></textarea>
                        </div>
                        <div className="bill-form-group">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={customerDetails.startDate}
                                onChange={handleChange}
                                className="bill-input"
                                required
                            />
                        </div>
                    </>
                ) : (
                    <div className="bill-details-display">
                        <p><strong>Name:</strong> {customerDetails.customerName}</p>
                        <p><strong>Email:</strong> {customerDetails.email}</p>
                        <p><strong>Contact Number:</strong> {customerDetails.contactNumber}</p>
                        <p><strong>Number of People:</strong> {customerDetails.numberOfPeople}</p>
                        <p><strong>Address:</strong> {customerDetails.address}</p>
                        <p><strong>Start Date:</strong> {customerDetails.startDate}</p>
                    </div>
                )}
                <h2>Price Breakdown</h2>
                <p><strong>Price per Person:</strong> Rs {basePrice}</p>
                <p><strong>Number of People:</strong> {customerDetails.numberOfPeople}</p>
                <p><strong>Total Price for People:</strong> Rs {basePrice * customerDetails.numberOfPeople}</p>
                <h2>Total Price: Rs {updatedTotalPrice}</h2>
                <p><strong>Booking Date:</strong> {billingDate}</p>
                <p><strong>Booking Time:</strong> {billingTime}</p>
                <div className="bill-button-group">
                    <button className="bill-edit-button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faEdit} /> {isEditing ? 'Done' : 'Edit'}
                    </button>
                    <button className="bill-pay-button" onClick={handlePay}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default Bill;
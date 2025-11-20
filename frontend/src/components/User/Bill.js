// Bill Component
// Displays and downloads order bill after payment confirmation

import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './User.css';

const Bill = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const billRef = useRef(null);

    // Get bill data from navigation state
    const billData = location.state || {};
    const {
        orderId = 'N/A',
        orderTime = new Date().toISOString(),
        items = [],
        totalAmount = 0,
        splitCount = 1,
        perPersonAmount = 0,
        tableNumber = null,
        customerName = 'Customer',
        customerPhone = ''
    } = billData;

    const handleDownloadBill = () => {
        const printContent = billRef.current;
        const originalContents = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '', 'height=800,width=600');

        printWindow.document.write('<html><head><title>Bill - Order #' + orderId.slice(-6) + '</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .bill-print { max-width: 400px; margin: 0 auto; background: white; }
            .bill-header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 15px; }
            .bill-header h1 { font-size: 24px; margin-bottom: 5px; }
            .bill-header p { font-size: 12px; color: #666; }
            .bill-info { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px dashed #333; }
            .bill-info-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; }
            .bill-info-row strong { color: #333; }
            .bill-items { margin-bottom: 15px; }
            .bill-items h3 { font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .bill-item { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
            .item-details { flex: 1; }
            .item-name { font-weight: 600; }
            .item-qty { color: #666; font-size: 12px; }
            .item-price { font-weight: bold; }
            .bill-summary { border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            .summary-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; }
            .summary-row.total { font-size: 18px; font-weight: bold; margin-top: 10px; border-top: 2px dashed #333; padding-top: 10px; }
            .bill-footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #333; }
            .bill-footer p { font-size: 12px; color: #666; margin: 5px 0; }
            .thank-you { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px; }
            @media print {
                body { padding: 0; }
                .no-print { display: none; }
            }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    if (!orderId || items.length === 0) {
        return (
            <div className="bill-container">
                <div className="empty-state">
                    <h2>No bill data available</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/home')}>
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const finalTotal = subtotal + tax;

    return (
        <div className="bill-container">
            <div className="bill-success-message">
                <div className="success-icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>Your order has been confirmed</p>
            </div>

            <div className="bill-card" ref={billRef}>
                <div className="bill-print">
                    {/* Header */}
                    <div className="bill-header">
                        <h1>🍽️ College Canteen</h1>
                        <p>Fresh Food, Great Taste</p>
                        <p>Ground Floor, Main Building</p>
                    </div>

                    {/* Order Info */}
                    <div className="bill-info">
                        <div className="bill-info-row">
                            <span><strong>Order No:</strong></span>
                            <span>#{orderId.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="bill-info-row">
                            <span><strong>Date:</strong></span>
                            <span>{formatDate(orderTime)}</span>
                        </div>
                        <div className="bill-info-row">
                            <span><strong>Time:</strong></span>
                            <span>{formatTime(orderTime)}</span>
                        </div>
                        {tableNumber && (
                            <div className="bill-info-row">
                                <span><strong>Table No:</strong></span>
                                <span>{tableNumber}</span>
                            </div>
                        )}
                        <div className="bill-info-row">
                            <span><strong>Customer:</strong></span>
                            <span>{customerName}</span>
                        </div>
                        {splitCount > 1 && (
                            <div className="bill-info-row">
                                <span><strong>No. of People:</strong></span>
                                <span>{splitCount}</span>
                            </div>
                        )}
                    </div>

                    {/* Items List */}
                    <div className="bill-items">
                        <h3>Order Items</h3>
                        {items.map((item, index) => (
                            <div key={index} className="bill-item">
                                <div className="item-details">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-qty">Qty: {item.quantity} × ₹{item.price}</div>
                                </div>
                                <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bill-summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5%):</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        {splitCount > 1 && (
                            <div className="summary-row">
                                <span>Per Person:</span>
                                <span>₹{perPersonAmount}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>₹{totalAmount || finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bill-footer">
                        <p className="thank-you">Thank You! Visit Again! 😊</p>
                        <p>Enjoy your meal!</p>
                        <p>For any queries, contact: 1800-XXX-XXXX</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bill-actions no-print">
                <button className="btn-download" onClick={handleDownloadBill}>
                    📄 Download / Print Bill
                </button>
                <button className="btn-primary" onClick={() => navigate('/my-orders')}>
                    📋 View My Orders
                </button>
                <button className="btn-secondary" onClick={() => navigate('/home')}>
                    🏠 Go to Home
                </button>
            </div>
        </div>
    );
};

export default Bill;

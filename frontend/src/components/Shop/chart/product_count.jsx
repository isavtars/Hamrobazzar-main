import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    XYPlot,
    VerticalBarSeries,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    Hint,
} from 'react-vis';
import './ProductStockChart.css'; // Ensure this path is correct

const ProductStockChart = () => {
    const { products } = useSelector((state) => state.products);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    if (!Array.isArray(products)) {
        return <div>Loading...</div>;
    }

    const stockData = getStockData(products);
    const barData = stockData.map(item => ({
        x: item.name,
        y: item.totalStock,
        color: getColorForProduct(item.name),
    }));

    if (barData.length === 0) {
        return <div>No products available.</div>;
    }

    return (
        <div className="chart-container" style={{ textAlign: 'center' }}>
            <h3 className="text-[22px] font-Poppins pb-2">Total Stock Count by Product</h3>
            <ul className="product-list">
                {stockData.map((item) => (
                    <li key={item.name} className='text-blue-700 font-Poppins pb-2'>
                        {item.name}: <span className='text-red-500 font-Poppins pb-2'>{item.totalStock} items</span>
                    </li>
                ))}
            </ul>

            <XYPlot height={500} width={1000} xType="ordinal">
                <VerticalGridLines style={{ stroke: '#e0e0e0' }} />
                <HorizontalGridLines style={{ stroke: '#e0e0e0' }} />
                <XAxis title="Products" />
                <YAxis title="Stock Count" />
                <VerticalBarSeries
                    data={barData}
                    colorType="literal"
                    onValueMouseOver={(value, e) => {
                        setHoveredItem(value);
                        const tooltipY = e.pageY - 50; // Adjust as necessary for vertical positioning
                        const tooltipX = e.pageX; // Center tooltip horizontally
                        setTooltipPosition({ top: tooltipY, left: tooltipX });
                    }}
                    onValueMouseOut={() => setHoveredItem(null)}
                />
                {hoveredItem && (
                    <Hint value={hoveredItem} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                        <div className="tooltip">
                            <div>{hoveredItem.x}: {hoveredItem.y} items</div>
                            {hoveredItem.y < 10 && <div style={{ color: 'red' }}>Your stock is low!</div>}
                        </div>
                    </Hint>
                )}
            </XYPlot>
        </div>
    );
};

const getStockData = (products) => {
    const productCounts = products.reduce((acc, product) => {
        if (product.name) {
            acc[product.name] = (acc[product.name] || 0) + (product.stock || 0);
        }
        return acc;
    }, {});

    return Object.entries(productCounts).map(([name, totalStock]) => ({
        name,
        totalStock,
    }));
};

const dataAggregationAlgo = (products) => {
    const productCounts = products.reduce((acc, product) => {
        if (product.name) {
            acc[product.name] = (acc[product.name] || 0) + (product.stock || 0);
        }
        return acc;
    }, {});

    return Object.entries(productCounts).map(([name, totalStock]) => ({
        name,
        totalStock,
    }));
};

const getColorForProduct = (productName) => {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FFC300', '#1AF7A6', 
        '#C70039', '#900C3F', '#DAF7A6', '#581845', '#FFC300'
    ];
    
    const index = Array.from(productName).reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
};

export default ProductStockChart;

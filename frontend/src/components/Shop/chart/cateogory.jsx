import React from 'react';
import { useSelector } from 'react-redux';
import {
    XYPlot,
    VerticalBarSeries,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
} from 'react-vis';

// Define a color map for different categories
const categoryColors = {
    "Computers and Laptops": '#FF5733', // Red
    "Mobile and Tablets": '#33FF57',      // Green
    "Shoes": '#3357FF',                   // Blue
    "Accessories": '#FFC300',             // Yellow
    "Cloths": '#1AF7A6',               // Light Green
    "Software": '#C70039',                // Dark Red
    "Others": '#900C3F'                   // Dark Purple
};

const CategoryBarChart = () => {
    const { products } = useSelector((state) => state.products);

    if (!Array.isArray(products)) {
        return <div>Loading...</div>; 
    }

    const categoryData = getCategoryData(products);

    const barData = categoryData.map(item => ({
        x: item.category,
        y: item.count,
        color: categoryColors[item.category] || '#000000',
    }));

    if (barData.length === 0) {
        return <div>No product categories available.</div>; 
    }

    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <h2 style={{ color: '#333', fontWeight: 'bold', fontSize: '24px', marginBottom: '15px' }}>
  
</h2>
 <h3 className="text-[22px] font-Poppins pb-2">  Product Count by Category</h3>
<ul style={{
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
    maxWidth: '400px', // Set a max width for better readability
    margin: '0 auto' // Center the list
}}>
    {categoryData.map((item) => (
        <li key={item.category} className='text-blue-700 font-Poppins pb-2'>
            {item.category}: <span className='text-red-500 font-Poppins pb-2'>{item.count} items</span>
        </li>
    ))}
</ul>

            <XYPlot height={500} width={1000} xType="ordinal">
                <VerticalGridLines style={{ stroke: '#e0e0e0' }} />
                <HorizontalGridLines style={{ stroke: '#e0e0e0' }} />
                <XAxis   />
                <YAxis />
                <VerticalBarSeries
                    data={barData}
                    colorType="literal" 
                />
            </XYPlot>
        </div>
    );
};

const getCategoryData = (products) => {
    const categoryCounts = products.reduce((acc, product) => {
        if (product.category) {
            acc[product.category] = (acc[product.category] || 0) + 1;
        }
        return acc;
    }, {});

    return Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
    }));
};

export default CategoryBarChart;

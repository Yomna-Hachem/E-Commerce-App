import React from 'react';

const AddProduct = () => {
    return (
        <div>
            <h1>Add Product</h1>
            <form>
                <label>
                    Product Name:
                    <input type="text" name="productName" />
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" name="price" />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description"></textarea>
                </label>
                <br />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
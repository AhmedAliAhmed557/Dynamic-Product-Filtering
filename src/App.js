import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [category, setCategory] = useState("");
	const [priceRange, setPriceRange] = useState([0, 2000]);
	const [brand, setBrand] = useState("");
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [sortOption, setSortOption] = useState("default"); // State for sort option

	useEffect(() => {
		fetch("/data.json")
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
				setFilteredProducts(data);
				setCategories([...new Set(data.map((product) => product.category))]);
				setBrands([...new Set(data.map((product) => product.brand))]);
			});
	}, []);

	useEffect(() => {
		filterProducts();
	}, [category, priceRange, brand]);

	const filterProducts = () => {
		let filtered = products;

		if (category) {
			filtered = filtered.filter((product) => product.category === category);
		}

		if (priceRange) {
			filtered = filtered.filter(
				(product) =>
					product.price >= priceRange[0] && product.price <= priceRange[1]
			);
		}

		if (brand) {
			filtered = filtered.filter((product) => product.brand === brand);
		}

		// Sorting logic
		if (sortOption === "priceAsc") {
			filtered.sort((a, b) => a.price - b.price);
		} else if (sortOption === "priceDesc") {
			filtered.sort((a, b) => b.price - a.price);
		} else if (sortOption === "alphaAsc") {
			filtered.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortOption === "alphaDesc") {
			filtered.sort((a, b) => b.name.localeCompare(a.name));
		}

		setFilteredProducts(filtered);
	};

	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
	};

	const handlePriceRangeChange = (e) => {
		const value = e.target.value.split(",");
		setPriceRange([parseInt(value[0]), parseInt(value[1])]);
	};

	const handleBrandChange = (e) => {
		setBrand(e.target.value);
	};

	const handleSortChange = (e) => {
		setSortOption(e.target.value);
		filterProducts(); // Re-filter when sort changes
	};

	const clearFilters = () => {
		setCategory("");
		setPriceRange([0, 2000]);
		setBrand("");
		setSortOption("default"); // Reset sort option
	};

	return (
		<div className='App container'>
			<div className='filters d-flex justify-content-center align-items-center flex-wrap'>
				<div className='form-group'>
					<label>Category:</label>
					<select
						className='form-control'
						value={category}
						onChange={handleCategoryChange}
					>
						<option value=''>All</option>
						{categories.map((cat, index) => (
							<option key={index} value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>

				<div className='form-group'>
					<label>Price Range:</label>
					<input
						type='text'
						className='form-control'
						value={priceRange.join(",")}
						onChange={handlePriceRangeChange}
						placeholder='min,max'
					/>
				</div>

				<div className='form-group'>
					<label>Brand:</label>
					<select
						className='form-control'
						value={brand}
						onChange={handleBrandChange}
					>
						<option value=''>All</option>
						{brands.map((br, index) => (
							<option key={index} value={br}>
								{br}
							</option>
						))}
					</select>
				</div>

				<div className='form-group'>
					<label>Sort By:</label>
					<select
						className='form-control'
						value={sortOption}
						onChange={handleSortChange}
					>
						<option value='default'>Default</option>
						<option value='priceAsc'>Price: Low to High</option>
						<option value='priceDesc'>Price: High to Low</option>
						<option value='alphaAsc'>Alphabetical Z-A</option>
						<option value='alphaDesc'>Alphabetical A-Z</option>
					</select>
				</div>

				<button className='btn h-100 btn-primary' onClick={clearFilters}>
					Clear Filters
				</button>
			</div>

			<div className='product-list row d-flex justify-content-center'>
				{filteredProducts.length > 0 ? (
					filteredProducts.map((product) => (
						<div key={product.id} className='col-lg-3 col-md-4 col-sm-6 mb-4'>
							<div className='card h-100'>
								<img
									src={product.image}
									className='card-img-top'
									alt={product.name}
									style={{
										height: "200px",
										objectFit: "cover",
										borderRadius: "8px 8px 0 0",
									}}
								/>
								<div className='card-body'>
									<h5 className='card-title'>{product.name}</h5>
									<p className='card-text'>Category: {product.category}</p>
									<p className='card-text'>
										Price: ${product.price.toFixed(2)}
									</p>
									<p className='card-text'>Brand: {product.brand}</p>
								</div>
							</div>
						</div>
					))
				) : (
					<div className='d-flex justify-content-center align-items-center'>
						<div
							className='card text-center'
							style={{
								width: "18rem",
								padding: "20px",
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
							}}
						>
							<div className='card-body'>
								<h5 className='card-title'>No Results Found</h5>
								<p className='card-text'>
									Try adjusting your filters to find what you are looking for.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;

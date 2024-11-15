import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    // Filter products based on search, selected categories, and types
    const filtered = products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(product.type);
      const searchMatch =
        product.name.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && typeMatch && searchMatch;
    });

    setFilterProducts(filtered);
  }, [selectedCategories, selectedTypes, products, search]); // Watch for changes in search

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
        </p>
        <img
          className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
          src={assets.dropdown_icon}
          alt="dropdown"
        />

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Men', 'Women', 'Kids'].map((category) => (
              <label key={category} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={category}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
              <label key={type} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={type}
                  onChange={handleTypeChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product Display */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          
          {/* Sort Option */}
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => {
              const sortOption = e.target.value;
              const sortedProducts = [...filterProducts].sort((a, b) => {
                if (sortOption === 'low-high') return a.price - b.price;
                if (sortOption === 'high-low') return b.price - a.price;
                return 0; // Default: no sorting
              });
              setFilterProducts(sortedProducts);
            }}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;

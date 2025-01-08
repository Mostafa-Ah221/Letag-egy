import { useContext, useState, useEffect } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useParams } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import { useLanguage } from '../../context/LanguageContextPro';
import { useCart } from '../../context/CartContext';
import Modal from '../Modal/Modal';
import ProductCard from '../CartProduct/CardProduct';
import FilterProducts from '../FilterProducts/FilterProducts';
import axios from 'axios';

export default function CategoryDetails() {
  const { currencyData } = useContext(ContextData);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    categories_id: [],
    brands_id: [],
    section: '',
    order_by_date: ''
  });
  const [sortOption, setSortOption] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    nextPage: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, handleAddToWish, wishList, cart, updateQuantity,removeFromCart  } = useCart();
  const { id } = useParams();
  const { language } = useLanguage();

  const fetchProducts = async (page = 1, filters = null, shouldResetPage = false) => {
    setIsLoading(true);
    const formData = new FormData();
    
    const currentFilters = filters || activeFilters;

    // إضافة الفئات المحددة
    if (currentFilters.categories_id && currentFilters.categories_id.length > 0) {
      currentFilters.categories_id.forEach((catId, index) => {
        formData.append(`categories_id[${index}]`, catId);
      });
    }

    // إضافة الماركات المحددة
    if (currentFilters.brands_id && currentFilters.brands_id.length > 0) {
      currentFilters.brands_id.forEach((brandId, index) => {
        formData.append(`brands_id[${index}]`, brandId);
      });
    }

    // إضافة معايير الترتيب - مهم: نضيف الترتيب دائماً
    if (currentFilters.order_by_date) {
      formData.append('order_by_date', currentFilters.order_by_date);
    }

    // إضافة معيار الأكثر مبيعاً
    if (currentFilters.section === 'best_selling') {
      formData.append('section', 'best_selling');
    }

    try {
      const response = await axios.post(
        `https://tarshulah.com/api/products?page=${shouldResetPage ? 1 : page}`,
        formData,
        {
          headers: { 
            lang: language,
            'Accept': 'application/json'
          }
        }
      );

      const { data, meta } = response.data;

      if (data && data.products) {
        setProducts(data.products);
        setPagination({
          currentPage: meta.current_page,
          lastPage: meta.last_page,
          nextPage: meta.next_page
        });
        
        if (shouldResetPage) {
          setCurrentPage(1);
        }
      } else {
        setProducts([]);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          nextPage: null
        });
      }
      
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
      setProducts([]);
      setPagination({
        currentPage: 1,
        lastPage: 1,
        nextPage: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const initialFilters = {
        categories_id: [id],
        brands_id: [],
        section: '',
        order_by_date: 'desc' // نبدأ بالترتيب من الأحدث افتراضياً
      };
      setActiveFilters(initialFilters);
      setSortOption('desc');
      fetchProducts(1, initialFilters, true);
    }
  }, [id, language]);

  const handleFilterChange = async (filters) => {
    const newFilters = { 
      ...filters,
      order_by_date: activeFilters.order_by_date,
      section: activeFilters.section
    };
    setActiveFilters(newFilters);
    await fetchProducts(1, newFilters, true);
  };

  const handleSortChange = async (e) => {
    const value = e.target.value;
    setSortOption(value);
    
    let newFilters = { ...activeFilters };
    
    if (value === 'best_selling') {
      newFilters = {
        ...newFilters,
        section: 'best_selling',
        order_by_date: ''
      };
    } else {
      newFilters = {
        ...newFilters,
        section: '',
        order_by_date: value
      };
    }
    
    setActiveFilters(newFilters);
    // نستخدم currentPage بدل 1 للحفاظ على نفس الصفحة
    // ونضع false بدل true عشان ما يرجعش لأول صفحة
    await fetchProducts(currentPage, newFilters, false);
};
  const handlePageChange = async ({ selected }) => {
    const newPage = selected + 1;
    setCurrentPage(newPage);
    // نمرر الفلترز الحالية مع الترتيب لكل صفحة
    await fetchProducts(newPage, activeFilters, false);
  };

   const handleProductClick = (product) => {
        const cartItem = cart.find((item) => item.id === product.id); 
        setSelectedProduct({ ...product, cartItem });
        setQuantity(cartItem?.quantity || 1); // Ensure quantity is set correctly
        setShowModal(true);
    };

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  return (
    <div className='px-2 my-5'>
      <div className='flex justify-between items-center'>
        <h2 className="my-7 font-semibold text-2xl">{language ==="ar"? "تفاصيل الفئة":"Category Details"} </h2>
        <div className={`md:w-64 ${language === "ar" ? "md:ml-32 ml-5":"md:mr-32 mr-5"}`}>
          <select 
            name="sort" 
            id="sort" 
            className='w-full p-2 border rounded' 
            onChange={handleSortChange}
            value={sortOption}
          >
            <option value="">
              {language === "ar" ? "ترتيب حسب :" : "Sort by:"}
            </option>
            <option value="desc">
              {language === "ar" ? "حسب الأحدث" : "Newest"}
            </option>
            <option value="asc">
              {language === "ar" ? "حسب الأقدم" : "Oldest"}
            </option>
            <option value="best_selling">
              {language === "ar" ? "حسب الأكثر مبيعاً" : "Best Selling"}
            </option>
          </select>

        </div>
      </div>

      <div className="grid grid-cols-11 gap-5">
        <div className="col-span-12 md:col-span-3 order-2 md:order-1">
          <FilterProducts onFilterChange={handleFilterChange} />
        </div>

        <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 order-1 md:order-2">
          {isLoading ? (
            <div className="col-span-full text-center">جاري التحميل...</div>
          ) : products.length > 0 ? (
            products.map((product) => {
               const cartItem = cart.find((item) => item.id === product.id);   
               return(                     
              <ProductCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
                handleProductClick={handleProductClick}
                handleAddToWish={handleAddToWish}
                wishList={wishList}
                updateQuantity={updateQuantity}
                currencyData={currencyData}
                cartItem={cartItem} 
                isInCart={!!cartItem}
                deleteProduct={removeFromCart}
              />
               )
})
          ) : (
            <div className="col-span-full text-center">لا توجد منتجات</div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          product={selectedProduct}
          handleAddToCart={handleAddToCart}
          language={language}
          currency={currencyData}
          handleAddToWish={handleAddToWish}
          wishList={wishList}
          setQuantity={setQuantity}
          quantity={quantity}
        />
      )}

      {products.length > 0 && pagination.lastPage > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            pageCount={pagination.lastPage}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName="flex gap-2"
            activeClassName="text-white bg-primary"
            pageClassName="px-3 py-2 bg-gray-200 rounded cursor-pointer"
            previousClassName="px-3 py-2 bg-gray-200 rounded cursor-pointer"
            nextClassName="px-3 py-2 bg-gray-200 rounded cursor-pointer"
            previousLabel="السابق"
            nextLabel="التالي"
            breakLabel="..."
            forcePage={currentPage - 1}
          />
        </div>
      )}
    </div>
  );
}
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { GiBeachBag } from "react-icons/gi";
import { FaStar } from "react-icons/fa";

const ProductCard = ({
  product,
  handleAddToCart,
  handleProductClick,
  handleAddToWish,
  wishList,
  currencyData,
}) => {
  const isInWishList = wishList.some(
    (wishItem) => wishItem && wishItem.id === product.id
  );

  return (
    <div key={product.id} className="group ">
      <Link
        to={`/productDetails/${product.id}`}
        className=" bg-white group-hover:translate-y-[-0.5rem] group-hover:shadow-lg transform transition-transform duration-300 rounded-lg shadow-md h-full flex flex-col"
      >
        <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg ">
          {product.photo && (
            <div className="group h-48 overflow-hidden">
              <img
                src={product?.photo}
                alt={product.name}
                className="w-full h-full object-contain transform transition-transform duration-300 "
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="z-20"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                >
                  <GiBeachBag className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                </button>
                <button
                  className="z-20"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProductClick(product);
                  }}
                >
                  <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                </button>
                <div className="z-20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToWish(product, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {isInWishList ? (
                      <IoIosHeart className="text-primary text-[2.2rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-sm mt-3 mb-2 px-2 text-primary">
          {product?.category[0]?.name}
        </h3>
        <div className="flex flex-col flex-grow px-2 mb-2">
          <h2 className="text-right text-lg font-medium duration-300 line-clamp-1 pb-2 group-hover:text-primary">
            {product.title.length > 20
              ? `${product.title.split(" ").slice(0, 4).join(" ")} ...`
              : product.title}
          </h2>
          <hr />
        </div>
        <div className="flex items-center flex-row-reverse justify-between px-5 pb-3">
            <div className="flex">
              <p className="text-xl">{product.price}</p>
              <p className="text-xl">{currencyData}</p>
            </div>
             <p className='text-gray-700'>
                  {product.reviews_count ? product.reviews_count : 0}
                  <FaStar className='text-yellow-500 inline-block'/>
                </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

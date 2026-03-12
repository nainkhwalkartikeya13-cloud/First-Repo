import {
  useGetNewProductsQuery,
} from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetNewProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className="text-base lg:text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            Featured Products
          </h1>

          <Slider
            {...settings}
            className="w-[80vw] md:w-[40rem] 2xl:w-[50rem] mx-auto"
          >
            {products.map(
              ({
                image,
                _id,
                name,
                price,
                description,
              }) => (
                <div key={_id} className="mx-auto h-[450px] md:h-[700px]">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-xl object-cover h-[80%] shadow-sm dark:shadow-none"
                  />

                  <div className="mt-4 flex border border-gray-200 dark:border-[#444444] bg-white dark:bg-transparent rounded-lg px-2 p-3 text-gray-600 dark:text-[#d8e2f2c3] overflow-hidden shadow-sm dark:shadow-none transition-colors">
                    <div className="one w-full">
                      <div className="flex gap-8 justify-between items-center w-full">
                        <h2 className="text-base md:text-lg font-medium text-gray-900 dark:text-white/80 mb-2">
                          {name.substring(0, 50)}...
                        </h2>
                        <p className="text-gray-900 dark:text-indigo-400 font-bold text-sm md:text-base hidden md:flex">
                          {" "}
                          ₹ {price}
                        </p>
                      </div>
                      <p className="md:flex text-sm hidden">
                        {description.substring(0, 120)} ...
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </Slider>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;

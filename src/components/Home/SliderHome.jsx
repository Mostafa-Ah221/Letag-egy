import { useQuery } from "@tanstack/react-query";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ContextData } from "../../context/ContextApis";
import { useContext } from "react";

export default function SliderHome() {
    const { getApiHome } = useContext(ContextData);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    customPaging: () => (
      <div className="w-3 h-3 rounded-full mx-1 bg-white opacity-70 hover:opacity-100"></div>
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

 

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getApiHome'],
    queryFn: getApiHome,
     staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  // console.log(data?.data);
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error occurred while fetching data.</p>;

  return (
    <div className="relative">
      <Slider {...settings}>
        {data?.data?.sliders.map((item) => (
          <div key={item.id} className="relative">
            <img src={item.photo} alt="" style={{ width: '100%', height: '23em' }} />
          </div>
        ))}
      </Slider>
      <style>
        {`
          .custom-dots {
            position: absolute;
            bottom: 10px; /* Adjust to your liking */
            left: 50%;
            transform: translateX(-50%);
            display: flex !important;
            justify-content: center;
            align-items: center;
            z-index: 10; /* Ensure dots are on top */
          }

          .custom-dots li {
            transition: transform 0.3s ease;
          }

          .custom-dots li.slick-active div {
            background-color: orange; /* Active dot color */
            transform: scale(1.5); /* Make the active dot bigger */
          }

          .custom-dots li:not(.slick-active) div {
            background-color: white; /* Inactive dot color */
            transform: scale(0.8); /* Default size for inactive dots */
          }

          .custom-dots li.slick-active + li div {
            transform: scale(1.1); /* Slightly bigger size for next dot */
          }

          .custom-dots li.slick-active ~ li div {
            transform: scale(0.7); /* Even smaller for dots further away */
          }
        `}
      </style>
    </div>
  );
}

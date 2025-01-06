import { useQuery } from "@tanstack/react-query";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ContextData } from "../../context/ContextApis";
import { useContext } from "react";
import LoadingIndicator from "../Loading/LoadingIndicator";
import { Link } from "react-router-dom";

export default function SliderHome() {
    const { getApiHome } = useContext(ContextData);

    // إعدادات السلايدر
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

    // الحصول على البيانات باستخدام React Query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['getApiHome'],
        queryFn: getApiHome,
        staleTime: 1000 * 60 * 30,
        cacheTime: 1000 * 60 * 40,
    });

    // التحقق ما إذا كان الرابط خارجيًا
    const isExternalLink = (url) => {
        return /^https?:\/\//.test(url);
    };

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <p>Error occurred while fetching data.</p>;

    return (
        <div>
            <div className="relative z-0">
                <Slider {...settings}>
                    {data?.data?.sliders.map((item) => (
                        <div key={item.id} className="relative">
                            {isExternalLink(item.link) ? (
                                <a
                                    href={item.link}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                >
                                    <img
                                        src={item.photo}
                                        alt=""
                                        className="w-full h-full lg:h-[25em] lg:object-fill object-contain"
                                    />
                                </a>
                            ) : (
                                <Link to={item.link}>
                                    <img
                                        src={item.photo}
                                        alt=""
                                        className="w-full h-full lg:h-[25em] lg:object-fill object-contain"
                                    />
                                </Link>
                            )}
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
                            background-color: var(--primary-color); 
                            transform: scale(1.5); 
                        }

                        .custom-dots li:not(.slick-active) div {
                            background-color: white;
                            transform: scale(0.8); 
                        }

                        .custom-dots li.slick-active + li div {
                            transform: scale(1.1); 
                        }

                        .custom-dots li.slick-active ~ li div {
                            transform: scale(0.7); 
                        }
                    `}
                </style>
            </div>
        </div>
    );
}

import React, { useState, useContext } from 'react';
import { ContextData } from "../../context/ContextApis";
import ReactPlayer from 'react-player';
import Slider from 'react-slick';
import { useQuery } from '@tanstack/react-query';

function Videos() {
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

    const [selectedVideo, setSelectedVideo] = useState(0);
    const { getApiHome } = useContext(ContextData);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getApiHome'],
        queryFn: getApiHome,
        staleTime: 1000 * 60 * 30,
        cacheTime: 1000 * 60 * 40,
    });

    // if (isLoading) {
    //     return <div>Loading videos...</div>;
    // }

    // if (isError) {
    //     return <div>Error loading videos.</div>;
    // }

    return (
        <>
            {data?.data?.videos?.length > 0 ? (
                <>
                    <div className='flex justify-center items-center'>
                        <ReactPlayer
                            controls={true}
                            url={data.data.videos[selectedVideo]?.link || ""}
                            width="200"
                            height="150"
                        />
                    </div>
                    <br />
                    <div>
                        <Slider {...settings}>
                            {data.data.videos.map((v, index) => (
                                <div
                                    className=''
                                    key={v.id || index}
                                    onClick={() => setSelectedVideo(index)}
                                >
                                    <ReactPlayer
                                        controls={true}
                                        url={v.link || ""}
                                        width="80"
                                        height="50"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </>
            ) : (
                ""
            )}
        </>
    );
}

export default Videos;

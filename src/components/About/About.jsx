import { useContext } from 'react';
import { ContextData } from '../../context/ContextApis';

const About = () => {
    const { shop_description,nameWebSite } = useContext(ContextData);
  
  return (
    <div className='my-11 '>
      <div className='w-full h-80'>
        <img src='https://images.pexels.com/photos/5624998/pexels-photo-5624998.jpeg?auto=compress&cs=tinysrgb&w=600' className='w-full h-full transition-transform duration-300 hover:scale-105' alt="About-Leetag" />
      </div>
      <div className="w-[90%] m-auto bg-white my-11 relative bottom-28 shadow-2xl z-10 p-6 md:p-12 text-center md:text-right">
        <h2 className="text-3xl font-bold mb-4 text-primary"> {nameWebSite}</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {shop_description}
        </p>
        
      </div>
    </div>
  );
};

export default About;

import aboutImg from '../../assets/imgs/about-2.jpg';

const About = () => {
  return (
    <div className='my-11 '>
      <div className='w-full h-80'>
        <img src='https://images.pexels.com/photos/5624998/pexels-photo-5624998.jpeg?auto=compress&cs=tinysrgb&w=600' className='w-full h-full transition-transform duration-300 hover:scale-105' alt="About-Leetag" />
      </div>
      <div className="w-[90%] m-auto bg-white my-11 relative bottom-28 shadow-2xl z-10 p-6 md:p-12 text-center md:text-right">
        <h2 className="text-3xl font-bold mb-4 text-primary">عن ليتاج</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          مرحبًا بكم في <strong>ليتاج</strong>، وجهتك الأولى لمجموعة واسعة من المنتجات عالية الجودة! نقدم كل شيء من الخضروات والفواكه الطازجة إلى الألعاب المثيرة واحتياجات المنزل وغيرها الكثير. هدفنا هو توفير تجربة تسوق سهلة وممتعة تضمن لكم الأمان والتنوع في الاختيار.
        </p>
        <p className="text-gray-700 leading-relaxed">
          سواء كنت تبحث عن أساسيات المطبخ أو أنشطة ترفيهية، يوفر متجرنا حلاً موثوقًا لجميع احتياجات التسوق الخاصة بك. شكرًا لاختياركم لنا!
        </p>
      </div>
    </div>
  );
};

export default About;

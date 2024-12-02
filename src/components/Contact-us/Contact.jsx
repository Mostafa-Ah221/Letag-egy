
export default function Contact() {
  return (
      <div className=" p-6">
        <h2 className="text-2xl font-semibold text-center  ml-96 mb-7 ">تواصل معنا</h2>
        <div className='grid grid-cols-12 gap-5'>
            <form className="md:col-span-6 order-2 col-span-12">
             <div className='grid grid-cols-12 gap-3'>
               <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="base-input" className="block mb-2 text-sm text-right ">
                *الأسم الأخير
                </label>
                <input
                type="text"
                id="base-input"
                className=" border border-orange-500 text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
                />
             </div>
             <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="base-input" className="block mb-2 text-sm text-right ">
                *الأسم الأول
                </label>
                <input
                type="text"
                id="base-input"
                className=" border border-orange-500 text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
                />
            </div>
             </div>
             <div className='grid grid-cols-12 gap-3'>
             <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="base-input" className="block mb-2 text-sm text-right ">
               *التليفون
                </label>
                <input
                type="number"
                id="base-input"
                className=" border border-orange-500 text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
                />
            </div>
             <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="base-input" className="block mb-2 text-sm text-right ">
                *الايمال
                </label>
                <input
                type="email"
                id="base-input"
                className=" border border-orange-500 text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
                />
            </div>
        </div>
        <div className="col-span-12 md:col-span-6 ">
             <label htmlFor="base-input" className="block mb-2 text-sm text-right ">
                *الرسالة
                </label>
            <textarea className='border border-orange-500 text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right mb-5 h-32' name="" id=""></textarea>
        </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 duration-300 hover:tracking-widest px-3 py-1 text-white block m-auto rounded-sm"
          >
            ارسال
          </button>
        </form>
        <div className='col-span-5 bg-orange-500 order-1 hidden md:flex'>

        </div>
        </div>
        
      </div>
  );
}

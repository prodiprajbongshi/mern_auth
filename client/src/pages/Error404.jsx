import React from "react";

const Error404 = () => {
  return (
    <div className='h-screen w-screen bg-[url("./assets/bg_img.png")] bg-cover bg-center flex items-center justify-center'>
      <div className="text-center max-w-xl">
       
        <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-red-400 to-red-900 text-transparent bg-clip-text drop-shadow-lg">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-3xl md:text-4xl font-bold">Page Not Found</h2>

        {/* Description */}
        <p className="mt-4 text-gray-400 text-lg">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-300 to-blue-500  transition-all duration-300 shadow-lg"
          >
            Go Home
          </a>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800  hover:text-white cursor-pointer transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
      </div>
    </div>
  );
};

export default Error404;

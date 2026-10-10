
const NotFound = ({title='',subTitle=''}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      {/* Icon */}
      <div className="bg-gray-100 rounded-full p-4 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10m-12 6h14M5 21h14a2 2 0 002-2V7a2 
        2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Message */}
      <h1 className="text-lg font-semibold text-gray-600">
        {title}
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        {subTitle}
      </p>
    </div>
  );
};

export default NotFound;


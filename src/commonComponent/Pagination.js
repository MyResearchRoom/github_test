import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({ currentPage, setCurrentPage, totalPages,goToPage }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
      // setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage !== totalPages) {
      goToPage(currentPage + 1);
      // setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
  };

  return (
    <div className="flex justify-end items-center">
      <div className=" flex justify-end items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className="border h-6 w-6 lg:h-8 lg:w-8 rounded-full  flex justify-center items-center"
        >
          <MdKeyboardArrowLeft />
        </button>
        {getPageNumbers().map((page, index) => (
          <button
            key={typeof page === "number" ? page : `ellipsis-${index}`}
            onClick={() => { goToPage(page)}}
            className={`${
              page === currentPage
                ? "bg-[#e1c0fd]  text-black"
                : "bg-[#f8f8f8]  text-black border border-[#e7e1e1]"
            } px-2 lg:px-3 py-0.5 lg:py-1 rounded-md text-sm lg:text-base`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="border h-6 w-6 lg:h-8 lg:w-8 rounded-full   flex justify-center items-center"
        >
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

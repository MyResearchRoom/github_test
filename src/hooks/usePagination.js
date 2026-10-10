import { useCallback, useState } from "react";

export const usePagination=(initialPage=1)=>{
    const [currentPage,setCurrentPage]=useState(initialPage);
    const [totalPages,setTotalPages] = useState(0);

    const goToPage =useCallback((pageNumber)=>{
        setCurrentPage(pageNumber);
    },[])

    return {
        currentPage,
        totalPages,
        goToPage,
        setTotalPages
    }
}
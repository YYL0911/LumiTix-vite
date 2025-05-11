import { useState } from "react";

function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  const [visiblePages, setVisiblePages] = useState([]);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const handleClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleChangeOnePage = (idx) => {
    onPageChange(currentPage+idx);
  };

  return (
    <nav>
      <ul className="pagination justify-content-center mt-5">


        <li className={`page-item mx-1 ${1 === currentPage? "disabled" : ""}`}>
            <button
                className="page-link rounded-circle"
                onClick={(e) => {
                    handleChangeOnePage(-1)
                    e.currentTarget.blur();
                }}
                disabled={currentPage === 1}
            >
                {/* &laquo; */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
            </button>
        </li>

        {getPageNumbers().map((page, index) => (
            <li 
              key={index}
              className={`page-item mx-1 ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
            >
                <button
                    className="page-link rounded-circle"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      handleClick(page)
                    }}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            </li>
        ))}

        <li className={`page-item mx-1 ${totalPages === currentPage? "disabled" : ""}`}>
            <button
                className="page-link rounded-circle"
                onClick={(e) => {
                    handleChangeOnePage(1)
                    e.currentTarget.blur();
                }}
                disabled={currentPage === totalPages}
            >
                {/* &raquo; */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
            </button>
        </li>

      </ul>
    </nav>
  );
}

export default PaginationComponent;

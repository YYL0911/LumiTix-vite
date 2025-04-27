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


        <li className={`page-item ${1 === currentPage? "disabled" : ""}`}>
            <button
                className="page-link"
                onClick={(e) => {
                    handleChangeOnePage(-1)
                    e.currentTarget.blur();
                }}
                disabled={currentPage === 1}
            >
                &laquo;
            </button>
        </li>

        {getPageNumbers().map((page, index) => (
            <li 
              key={index}
              className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
            >
                <button
                    className="page-link"
                    onClick={() => handleClick(page)}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            </li>
        ))}

        <li className={`page-item ${totalPages === currentPage? "disabled" : ""}`}>
            <button
                className="page-link"
                onClick={(e) => {
                    handleChangeOnePage(1)
                    e.currentTarget.blur();
                }}
                disabled={currentPage === totalPages}
            >
                &raquo;
            </button>
        </li>

        
        {/* <li
            className={`page-item ${1 === currentPage? "disabled" : ""}`}
            style={currentPage === 1 ? { pointerEvents: "none" } : {}}
            onClick={() => handleChangeOnePage(-1)}
        >
            <span className="page-link">上一頁</span>
        </li>

        {getPageNumbers().map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
            onClick={() => handleClick(page)}
          >
            <span className="page-link">{page}</span>
          </li>
        ))}

        <li
            className={`page-item ${totalPages === currentPage? "disabled" : ""}`}
            onClick={() => handleChangeOnePage(1)}
        >
            <span className="page-link">下一頁</span>
        </li> */}
      </ul>
    </nav>
  );
}

export default PaginationComponent;

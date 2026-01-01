interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 mb-6 text-white">
      <ul className="flex items-center gap-2">
        {/* Anterior */}
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 rounded-md text-sm bg-one disabled:opacity-50"
          >
            ‹
          </button>
        </li>

        {/* Páginas */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm transition
                  ${
                    currentPage === page
                      ? "bg-one text-white font-semibold"
                      : "bg-four hover:bg-zinc-200 text-black"
                  }
                `}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Siguiente */}
        <li>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 rounded-md text-sm bg-one disabled:opacity-50"
          >
            ›
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;

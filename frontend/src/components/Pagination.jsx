<div className="flex gap-2">
  <button
    disabled={page === 0}
    onClick={() => setPage(page - 1)}
  >
    Prev
  </button>

  <span>Page {page + 1}</span>

  <button
    disabled={page + 1 === totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>
{loading ? (
  <div className="flex justify-center p-6">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
) : (
  <CustomerTable customers={customers} />
)}
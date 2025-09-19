const TestPage = () => {
  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 gradient-text">
          CSS & DaisyUI Test Page
        </h1>
        
        {/* Test DaisyUI Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Test */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card Component</h2>
              <p>This is a DaisyUI card component.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>

          {/* Button Tests */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Button Variants</h2>
              <div className="space-y-2">
                <button className="btn btn-primary w-full">Primary</button>
                <button className="btn btn-secondary w-full">Secondary</button>
                <button className="btn btn-accent w-full">Accent</button>
                <button className="btn btn-outline w-full">Outline</button>
              </div>
            </div>
          </div>

          {/* Form Test */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Form Elements</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" className="input input-bordered" placeholder="test@example.com" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select</span>
                </label>
                <select className="select select-bordered">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Test */}
        <div className="mt-8 space-y-4">
          <div className="alert alert-info">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Info alert - DaisyUI is working!</span>
          </div>
          
          <div className="alert alert-success">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Success! Tailwind CSS and DaisyUI are properly configured.</span>
          </div>
        </div>

        {/* Stats Test */}
        <div className="stats shadow mt-8 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg className="inline-block w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="stat-title">Total Likes</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg className="inline-block w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="stat-title">Page Views</div>
            <div className="stat-value text-secondary">2.6M</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
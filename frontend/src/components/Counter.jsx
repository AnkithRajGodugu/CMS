
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../features/counter/counterSlice';

function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen bg-base-100 p-8">
            <div className="max-w-md mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center text-2xl mb-6">Redux Counter Test</h2>
                        
                        <div className="text-6xl font-bold text-primary mb-6">
                            {count}
                        </div>
                        
                        <div className="flex gap-4 justify-center mb-6">
                            <button 
                                className="btn btn-primary"
                                onClick={() => dispatch(decrement())}
                            >
                                -1
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => dispatch(increment())}
                            >
                                +1
                            </button>
                        </div>
                        
                        <div className="flex gap-2 justify-center">
                            <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => dispatch(incrementByAmount(5))}
                            >
                                +5
                            </button>
                            <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => dispatch(incrementByAmount(10))}
                            >
                                +10
                            </button>
                            <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => dispatch(incrementByAmount(-5))}
                            >
                                -5
                            </button>
                        </div>
                        
                        <div className="mt-6 text-sm text-base-content/70">
                            <p>✅ Redux is working!</p>
                            <p>Open Redux DevTools to see state changes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Counter;

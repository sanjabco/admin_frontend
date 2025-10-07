import {useNavigate} from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-gray-100"
            style={{
                backgroundImage: 'url("/images/404-background.svg")',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-6xl font-extrabold text-red-500">404</h1>
                <p className="text-xl mt-4 text-gray-700">صفحه‌ای که به دنبال آن هستید یافت نشد!</p>
                <p className="text-gray-500 mt-2">
                    ممکن است لینک اشتباه باشد یا این صفحه دیگر وجود نداشته باشد.
                </p>

                <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        بازگشت به صفحه اصلی
                    </button>
                    <button
                        onClick={() => navigate('/contact')}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        تماس با پشتیبانی
                    </button>
                </div>
            </div>

            <img
                src="/images/404-illustration.svg"
                alt="404 Illustration"
                className="w-1/2 max-w-lg mt-8"
            />
        </div>
    );
};

export default NotFound;

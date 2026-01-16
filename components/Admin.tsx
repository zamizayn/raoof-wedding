
import React, { useState } from 'react';


const Admin: React.FC = () => {
    const [tab, setTab] = useState<'compliment' | 'gallery'>('compliment');
    const [name, setName] = useState('');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            setStatus('Please provide an image.');
            return;
        }

        if (tab === 'compliment' && !name) {
            setStatus('Please provide a name for the compliment.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        const endpoint = tab === 'compliment' ? 'https://raoof-wedding-api.akshikrm.com/api/upload' : 'https://raoof-wedding-api.akshikrm.com/api/gallery/upload';

        if (tab === 'compliment') {
            formData.append('name', name);
        } else {
            formData.append('caption', caption);
        }

        try {
            setIsUploading(true);
            setStatus('Uploading...');
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setStatus('Success! Uploaded successfully.');
                setName('');
                setCaption('');
                setImage(null);
                setPreview(null);
                if (preview) URL.revokeObjectURL(preview);
            } else {
                setStatus('Error uploading image.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error connecting to server. Ensure you are running locally.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
                <h2 className="text-3xl font-serif text-emerald-900 mb-6 text-center">Admin Panel</h2>

                <div className="flex mb-8 bg-emerald-50 p-1 rounded-xl">
                    <button
                        onClick={() => { setTab('compliment'); setStatus(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'compliment' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900'}`}
                    >
                        Compliments
                    </button>
                    <button
                        onClick={() => { setTab('gallery'); setStatus(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'gallery' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900'}`}
                    >
                        Gallery
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {tab === 'compliment' ? (
                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isUploading}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                placeholder="Enter name"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Caption (Optional)</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                disabled={isUploading}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                placeholder="Enter photo caption"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-2">Image</label>
                        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#D4AF37] transition-colors cursor-pointer relative ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="Preview" className="mx-auto h-32 object-contain rounded-md" />
                                    <p className="text-xs text-gray-500 mt-2">Click to change</p>
                                </div>
                            ) : (
                                <div className="text-gray-400">
                                    <span className="block text-2xl mb-1">📷</span>
                                    <span className="text-sm">Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b5952f] transition-colors shadow-md flex justify-center items-center ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : tab === 'compliment' ? 'Add Compliment' : 'Add to Gallery'}
                    </button>

                    {status && (
                        <div className={`text-center text-sm p-3 rounded bg-gray-50 ${status.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
                            {status}
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-emerald-700 hover:text-[#D4AF37] text-sm underline">Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default Admin;

import React, { useState, useEffect, useRef } from 'react';


const Admin: React.FC = () => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const [tab, setTab] = useState<'compliment' | 'gallery' | 'guestbook'>('compliment');
    const [name, setName] = useState('');
    const [tag, setTag] = useState('Family');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const uploadingRef = useRef(false);
    const [guestMessages, setGuestMessages] = useState<any[]>([]);
    const [compliments, setCompliments] = useState<any[]>([]);
    const [galleryItems, setGalleryItems] = useState<any[]>([]);

    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (tab === 'guestbook') {
            fetchGuestbook();
        } else if (tab === 'compliment') {
            fetchCompliments();
        } else if (tab === 'gallery') {
            fetchGallery();
        }
    }, [tab]);

    const fetchGuestbook = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/guestbook`);
            const data = await res.json();
            setGuestMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCompliments = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/compliments`);
            const data = await res.json();
            setCompliments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGallery = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/gallery`);
            const data = await res.json();
            setGalleryItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/guestbook/${id}`, { method: 'DELETE' });
            if (res.ok) fetchGuestbook();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCompliment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this compliment?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/compliments/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCompliments();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteGalleryItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gallery image?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/gallery/${id}`, { method: 'DELETE' });
            if (res.ok) fetchGallery();
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUploading || uploadingRef.current) return;

        uploadingRef.current = true;

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

        const endpoint = tab === 'compliment' ? `${API_BASE}/api/upload` : `${API_BASE}/api/gallery/upload`;

        if (tab === 'compliment') {
            formData.append('name', name);
            formData.append('tag', tag);
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
                // Refresh list
                if (tab === 'compliment') fetchCompliments();
                else if (tab === 'gallery') fetchGallery();
            } else {
                setStatus('Error uploading image.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error connecting to server. Ensure you are running locally.');
        } finally {
            setIsUploading(false);
            uploadingRef.current = false;
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctUser = import.meta.env.VITE_ADMIN_USER;
        const correctPass = import.meta.env.VITE_ADMIN_PASS;

        if (usernameInput === correctUser && passwordInput === correctPass) {
            setIsLoggedIn(true);
            setLoginError('');
        } else {
            setLoginError('Invalid username or password');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
                    <h2 className="text-3xl font-serif text-emerald-900 mb-6 text-center">Admin Login</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Username</label>
                            <input
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Password</label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        {loginError && (
                            <p className="text-red-500 text-sm text-center">{loginError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-950 transition-colors shadow-md"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <a href="/" className="text-emerald-700 hover:text-[#D4AF37] text-sm underline">Back to Home</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-6">
            <div className={`w-full bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 transition-all ${tab === 'guestbook' ? 'max-w-4xl' : 'max-w-md'}`}>
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
                    <button
                        onClick={() => { setTab('guestbook'); setStatus(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'guestbook' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900'}`}
                    >
                        Guestbook
                    </button>
                </div>

                {tab === 'guestbook' ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-serif text-emerald-900 mb-4">Manage Messages</h3>
                        <div className="overflow-hidden rounded-xl border border-emerald-100">
                            <table className="w-full text-left">
                                <thead className="bg-emerald-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-emerald-900 uppercase tracking-widest">Guest</th>
                                        <th className="px-6 py-3 text-xs font-bold text-emerald-900 uppercase tracking-widest">Message</th>
                                        <th className="px-6 py-3 text-xs font-bold text-emerald-900 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-50">
                                    {guestMessages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-emerald-50/30">
                                            <td className="px-6 py-4 font-medium text-emerald-900">{msg.name}</td>
                                            <td className="px-6 py-4 text-emerald-800/70 text-sm">{msg.message}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {guestMessages.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-emerald-800/40 italic">No messages found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
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
                        ) : null}

                        {tab === 'compliment' && (
                            <div>
                                <label className="block text-sm font-medium text-emerald-800 mb-2">Tag</label>
                                <div className="flex gap-4">
                                    {['Family', 'Friend'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTag(t)}
                                            className={`flex-1 py-2 px-4 rounded-lg border transition-all ${tag === t ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' : 'bg-white text-emerald-900 border-emerald-100 hover:border-[#D4AF37]'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === 'gallery' && (
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
                )}

                {/* Management Sections */}
                {tab === 'compliment' && (
                    <div className="mt-12 pt-8 border-t border-emerald-100">
                        <h3 className="text-xl font-serif text-emerald-900 mb-6 text-center">Manage Compliments</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {compliments.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 group">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-100 flex-shrink-0">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-emerald-900 truncate">{item.name}</p>
                                        <p className="text-xs text-[#D4AF37] uppercase tracking-widest">{item.tag}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteCompliment(item.id)}
                                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {compliments.length === 0 && (
                                <p className="col-span-2 text-center text-emerald-800/40 italic py-4">No compliments found.</p>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'gallery' && (
                    <div className="mt-12 pt-8 border-t border-emerald-100">
                        <h3 className="text-xl font-serif text-emerald-900 mb-6 text-center">Manage Gallery</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {galleryItems.map((item) => (
                                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-100 group">
                                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => deleteGalleryItem(item.id)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    {item.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                            <p className="text-[8px] text-white truncate text-center">{item.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {galleryItems.length === 0 && (
                                <p className="col-span-full text-center text-emerald-800/40 italic py-4">No gallery images found.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <a href="/" className="text-emerald-700 hover:text-[#D4AF37] text-sm underline">Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default Admin;

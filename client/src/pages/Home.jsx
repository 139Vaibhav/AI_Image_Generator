import React, { useState, useEffect } from 'react';
import { Loader, Card, FormField } from '../components';
import { Link } from 'react-router-dom';

const RenderCards = ({ data, title }) => {
    if (data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />)
    }
    return (
        <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>
            {title}
        </h2>
    )
}

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://ai-image-generator-p9kk.onrender.com/api/v1/post', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (response.ok) {
                    console.log("response in get is ", response);
                    const result = await response.json();
                    setAllPosts(result.data.reverse());
                }
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);
        setSearchTimeout(
            setTimeout(() => {
                const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

                setSearchResults(searchResults);
            }, 500)
        );
    }

    return (
        <section className='max-w-7xl mx-auto'>
            <div className='flex justify-between'>
                <div>
                    <h1 className='font-extrabold text-[32px]'>The Community Showcase</h1>
                    <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Browse through a collection of imaginative and visually stunning images generated by AI</p>
                </div>
                <div className='box-border md:box-content p-4 border-4 rounded-lg px-5 py-5'>
                    <h1 className='font-extrabold text-[32px]'>Create Your Own Photos</h1>
                    <p className='mt-5 text-[#666e75] text-[16px] w-full'>
                        <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-3 rounded-md">
                            Create
                        </Link>
                    </p>
                </div>
            </div>
            <div className='mt-16'>
                <FormField
                    labelName="Search Posts"
                    type="text"
                    name="text"
                    placeholder="Search Posts"
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>
            <div className='mt-10'>
                {loading ? (
                    <div className='flex justify-center items-center'>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                                Showing results for
                                <span className='text-[#222328]'>
                                    {searchText}
                                </span>
                            </h2>
                        )
                        }
                        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                            {searchText ? (
                                <RenderCards
                                    data={searchResults}
                                    title="No search results found"
                                />
                            ) : (
                                <RenderCards
                                    data={allPosts}
                                    title="No posts found"
                                />
                            )}
                        </div>
                    </>)}
            </div>
        </section>
    )
}

export default Home
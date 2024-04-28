import React, { useEffect, useRef, useState } from 'react'
import { Checkbox, Pagination, Table, Tag, Input } from "antd";
import type { PaginationProps, TableProps } from 'antd';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFilter } from "react-icons/fa";

interface DataType {
    key: string;
    title: string;
    body: string;
    address: string;
    tags: string[];
}


const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Body',
        dataIndex: 'body',
        key: 'body',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = 'geekblue';
                    if (tag === 'crime') {
                        color = 'volcano';
                    } else if (tag === 'love') {
                        color = 'pink'
                    } else if (tag === 'mystery') {
                        color = 'purple'
                    } else if (tag === 'history') {
                        color = 'black'
                    } else if (tag === 'mystery') {
                        color = 'green'
                    } else if (tag === 'fiction') {
                        color = 'orange'
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Reactions',
        dataIndex: 'reactions',
        key: 'reactions',
    },
];

const Home = (): React.JSX.Element => {
    const [data, setData] = useState([] as DataType[]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPost, setTotalPost] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filterRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const skip = params.get('skip');
    const limit = params.get('limit');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const apiUrl = `https://dummyjson.com/posts?skip=${skip || 0}&limit=${limit || 10}${searchQuery ? `&search=${searchQuery}` : ''}`;
            const res = await fetch(apiUrl, {
                method: 'GET',
                mode: 'cors',

            });
            let jsonData = await res.json();
            if (searchQuery) {
                console.log(true, 'search');
                let filteredData = jsonData.posts.filter((post: DataType) =>
                    post.body.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setData(filteredData);
                setTotalPost(filteredData.length);
                setIsLoading(false);
            } else {
                setData(jsonData.posts);
                setTotalPost(jsonData.total);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Some Error Occurred', error);
            toast.error('Some Error Occurred');
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const selectedTagsParam = selectedTags.join(',');
        navigate(`/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}&tags=${selectedTagsParam}`);
    }, [currentPage, pageSize, selectedTags, navigate]);

    useEffect(() => {
        fetchData();
    }, [location.search, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [skip, limit, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [selectedTags, searchQuery]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        navigate(`/?skip=${skip || 0}&limit=${limit || 10}&search=${value}`);
    };

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const onPageChange: PaginationProps['onChange'] = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTagChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    const renderTagsCheckbox = () => {
        const allTags = data.reduce<string[]>((acc, post) => {
            post.tags.forEach((tag) => {
                if (!acc.includes(tag)) {
                    acc.push(tag);
                }
            });
            return acc;
        }, []);

        return allTags.map((tag) => (
            <Checkbox
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={(e) => handleTagChange(tag, e.target.checked)}
            >
                {tag}
            </Checkbox>
        ));
    };

    const filteredData = selectedTags.length > 0
        ? data.filter(post => post.tags.some(tag => selectedTags.includes(tag)))
        : data;

    const toggleFilter = () => {
        if (filterRef.current) {
            filterRef.current.classList.toggle('hidden');
        }
    }

    return (
        <>
            <div className="mx-6 p-6 mt-24 ">
                <div className="flex items-center justify-around mb-6 ">
                    <Input.Search
                        placeholder="Search in body"
                        onSearch={handleSearch}
                        style={{ width: 300, }}
                    />
                    <span className="mx-2 p-4 lg:hidden">
                        <FaFilter onClick={toggleFilter} />
                    </span>
                </div>
                <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row">
                    <div ref={filterRef} className="mb-6 lg:w-1/5 sm:px-1 md:px-2 px-4 mx-auto border-gray-400  border h-fit py-4 rounded-md">
                        <div className='font-semibold'>Filter by Tags:</div>
                        {renderTagsCheckbox()}
                    </div>
                    <div className="px-2 lg:w-4/5 overflow-x-scroll">
                        <Table dataSource={filteredData} columns={columns} bordered loading={isLoading} pagination={false} />
                    </div>
                </div>
                <div className="p-2 my-6 item-center justify-center flex">
                    <Pagination
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        defaultCurrent={1}
                        total={totalPost}
                        onChange={onPageChange}
                    />
                </div>
            </div>
        </>
    );
}

export default Home;

'use client'
// BlogContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Blog {
  id: number;
  slug: string;
  heading: string;
  cover: string;
  date: string;
  content: string;
}

interface BlogContextProps {
  blogs: Blog[];
  fetchBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const data = await Promise.resolve([
      { id: 1, slug: 'e1-musthave-overview', heading: 'E1:MUSTHAVE OVERVIEW', cover: '/images/gunawarman_cover.png', date: '21 January, 2022', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
      { id: 2, slug: 'e2-musthave-overview', heading: 'E2:MUSTHAVE OVERVIEW', cover: '/images/sudirman_cover.png', date: '21 January, 2022', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
      { id: 3, slug: 'e3-musthave-overview', heading: 'E3:MUSTHAVE OVERVIEW', cover: '/images/kemang_cover.png', date: '21 January, 2022', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
    ]);
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, fetchBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = (): BlogContextProps => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

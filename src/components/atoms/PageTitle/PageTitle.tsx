import React from 'react';
import './pageTitle.css';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <>
      {title && (
        <div className='title-container'>
          <h1>{`${title}`}</h1>
        </div>
      )}
    </>
  );
};

export default PageTitle;

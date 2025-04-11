import React, { useState } from 'react';
import { Pagination } from './pagination';
import FadeIn from 'react-fade-in';

export const PaginationContainer = ({ pageSize, numberOfTroves, totalPages, setPage, page, clampedPage }) => {

  const handlePages = (updatePage: number) => setPage(updatePage);

  const nextPage = () => {
    if (clampedPage < totalPages) {
      setPage(clampedPage + 1);
    }
  };

  const previousPage = () => {
    if (clampedPage > 0) {
      setPage(clampedPage - 1);
    }
  };

  return (
    <div className="container">
      <FadeIn>
        <Pagination
          numberOfTroves={numberOfTroves}
          page={page}
          totalPages={totalPages}
          handlePagination={handlePages}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </FadeIn>
    </div>
  );
};
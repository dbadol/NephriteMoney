import React from 'react';
import {
  PaginationWrapper,
  PageItem,
  Separator
} from './Pagination.styles';

import FadeIn from 'react-fade-in';

export interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}

export const Pagination: React.FC<Props & any> = ({
  page,
  totalPages,
  handlePagination,
  previousPage,
  nextPage
}) => {

  return (
    <div>
      <PaginationWrapper>
            <PageItem
              onClick={previousPage}
              type="button"
              isActive={page !== 1}
              disabled={page === 1}
            >
              <span>Prev</span>
            </PageItem>
        <PageItem
          onClick={() => handlePagination(1)}
          type="button"
          isActive={page === 1}
        >
          {1}
        </PageItem>
        {page > 3 && totalPages > 4 && <Separator>...</Separator>}
        {page === totalPages && totalPages > 3 && (
          <PageItem
            onClick={() => handlePagination(page - 2)}
            type="button"
            isActive={false}
          >
            {page - 2}
          </PageItem>
        )}

        {page > 2 && (
          <PageItem
            onClick={() => handlePagination(page - 1)}
            type="button"
            isActive={false}
          >
            {page - 1}
          </PageItem>
        )}

        {page !== 1 && page !== totalPages && (
          <PageItem
            onClick={() => handlePagination(page)}
            type="button"
            isActive={true}
          >
            {page}
          </PageItem>
        )}

        {page < totalPages - 1 && (
          <PageItem
            onClick={() => handlePagination(page + 1)}
            type="button"
            isActive={false}
          >
            {page + 1}
          </PageItem>
        )}

        {page === 1 && totalPages > 3 && (
          <PageItem
            onClick={() => handlePagination(page + 2)}
            type="button"
            isActive={false}
          >
            {page + 2}
          </PageItem>
        )}

        {page < totalPages - 2 && totalPages > 4 && <Separator>...</Separator>}
        <PageItem
          onClick={() => handlePagination(totalPages)}
          type="button"
          isActive={page === totalPages}
        >
          {totalPages}
        </PageItem>

            <PageItem
              onClick={nextPage}
              type="button"
              isActive={page !== totalPages}
              disabled={page === totalPages}
            >
              <span>Next</span>
            </PageItem>
      </PaginationWrapper>
    </div>
  );
};


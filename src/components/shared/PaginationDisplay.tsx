"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC, useMemo } from "react";
import { Pagination } from "react-bootstrap";

interface IPaginationProps {
  metadata: {
    total?: number;
    limit?: number;
    skip?: number;
    pages?: number;
  };
}
const PaginationDisplay: FC<IPaginationProps> = ({ metadata }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(() => {
    return metadata?.skip !== undefined && metadata?.limit
      ? Math.floor(metadata.skip / metadata.limit) + 1
      : 1;
  }, [metadata]);

  const totalPages = metadata?.pages ?? 1;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());

    router.push(`/products?${newParams.toString()}`);
  };

  return (
    <>
      <Pagination className="float-end mt-3">
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => goToPage(1)}
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        />

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => goToPage(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        />
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => goToPage(totalPages)}
        />
      </Pagination>
      <div className="row h-100">
        <div className="col-sm-12 my-auto">
          <div className="text-end text-primary fs-6">
            Showing {Math.min(metadata?.limit || 0, metadata?.total || 0)} of{" "}
            {metadata?.total || 0} products
          </div>
        </div>
      </div>
    </>
  );
};

export default PaginationDisplay;

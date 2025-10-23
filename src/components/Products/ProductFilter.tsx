"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC, Suspense, useEffect, useMemo, useState } from "react";
import { Card, Dropdown, DropdownButton, ListGroup } from "react-bootstrap";

interface ProductFilterProps {
  platformsTypes: string[];
  categories: string[];
}

const ProductFilter: FC<ProductFilterProps> = ({
  platformsTypes,
  categories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = useMemo(
    () => searchParams.get("category") || "Category",
    [searchParams]
  );
  const currentPlatform = useMemo(
    () => searchParams.get("platformType") || "Platform",
    [searchParams]
  );

  const [filterCatText, setFilterCatText] = useState(currentCategory);
  const [filterPlatformText, setFilterPlatformText] = useState(currentPlatform);

  useEffect(() => {
    setFilterCatText(currentCategory);
    setFilterPlatformText(currentPlatform);
  }, [currentCategory, currentPlatform]);

  const handleCategorySelect = (e: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (e) {
      setFilterCatText(e);
      newParams.set("category", e);
    } else {
      setFilterCatText("Category");
      newParams.delete("category");
    }

    router.push(`?${newParams.toString()}`);
  };

  const handlePlatformSelect = (e: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (e) {
      setFilterPlatformText(e);
      newParams.set("platformType", e);
    } else {
      setFilterPlatformText("Platform");
      newParams.delete("platformType");
    }
    router.push(`?${newParams.toString()}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Card className="mb-3">
      <Card.Header>Filter By</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <DropdownButton
            variant="outline-secondary"
            title={filterCatText}
            id="input-group-dropdown-1"
            aria-label="Select category"
            onSelect={handleCategorySelect}
          >
            <Dropdown.Item eventKey="">Select category</Dropdown.Item>
            {categories.map((category) => (
              <Dropdown.Item key={category} eventKey={category}>
                {category}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </ListGroup.Item>
        <ListGroup.Item>
          <DropdownButton
            variant="outline-secondary"
            title={filterPlatformText}
            id="input-group-dropdown-1"
            aria-label="Select platform"
            onSelect={handlePlatformSelect}
          >
            <Dropdown.Item eventKey="">Select platform</Dropdown.Item>
            {platformsTypes.map((platformType) => (
              <Dropdown.Item key={platformType} eventKey={platformType}>
                {platformType}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </ListGroup.Item>
      </ListGroup>
    </Card>
    </Suspense>
  );
};

export default ProductFilter;

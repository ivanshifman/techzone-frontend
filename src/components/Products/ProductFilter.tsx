import { useRouter, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { Card, Dropdown, DropdownButton, ListGroup } from "react-bootstrap";
// import styles from '../../styles/Product.module.css';

interface ProductFilterProps {
  plataformsTypes: string[];
  categories: string[];
}

const ProductFilter: FC<ProductFilterProps> = ({
  plataformsTypes,
  categories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterCatText, setFilterCatText] = useState("Category");
  const [filterPlatformText, setFilterPlatformText] = useState("Platform");

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
      newParams.delete("platformType");
    }
    router.push(`?${newParams.toString()}`);
  };

  return (
    <Card className="mb-3">
      <Card.Header>Filter By</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <DropdownButton
            variant="outline-secondary"
            title={filterCatText}
            id="input-group-dropdown-1"
            // className={styles.dropdownFilterBtn}
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
            // className={styles.dropdownFilterBtn}
            onSelect={handlePlatformSelect}
          >
            <Dropdown.Item eventKey="">Select platform</Dropdown.Item>
            {plataformsTypes.map((plataformType) => (
              <Dropdown.Item key={plataformType} eventKey={plataformType}>
                {plataformType}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default ProductFilter;

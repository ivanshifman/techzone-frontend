import { useRouter } from "next/navigation";
import { FC, memo } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { IPropsBreadcrumb } from "../../interfaces/breadcrumbItem.interface";

const BreadcrumbDisplay: FC<IPropsBreadcrumb> = memo(({ childrens = [] }) => {
  const router = useRouter();

  return (
    <Breadcrumb className="mt-3">
      {childrens?.map(({ active, href, text }) => (
        <Breadcrumb.Item
          key={text}
          active={active}
          onClick={() => !active && router.push(href)}
          className={!active ? "cursor-pointer" : ""}
        >
          {text}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
});

export default BreadcrumbDisplay;

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button, Container } from "react-bootstrap";

interface ErrorTemplateProps {
  title: string;
  message: string;
}

const ErrorTemplate = ({ title, message }: ErrorTemplateProps) => {
  const router = useRouter();

  return (
    <Suspense fallback={null}>
    <Container className="text-center mt-5">
      <h2 className="text-danger fs-2">{title}</h2>
      <p className="text-muted">{message}</p>
      <Button variant="outline-primary" onClick={() => router.push("/")}>
        Go Back Home
      </Button>
    </Container>
    </Suspense>
    
  );
};

export default ErrorTemplate;

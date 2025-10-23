/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { useAppContext } from "../../context";
import { Products } from "../../services/product.service";
import {
  AddReview,
  AddReviewDetails,
  IReviewProps,
} from "../../interfaces/addReview.interface";
import { Controller, useForm } from "react-hook-form";
import { Button, Card, Form } from "react-bootstrap";
import { ArrowClockwise, PersonFill } from "react-bootstrap-icons";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { Rating } from "react-simple-star-rating";

const initialState: AddReview = {
  rating: 1,
  review: "",
};

const ReviewSection: FC<IReviewProps> = ({ reviews, productId }) => {
  const { state } = useAppContext();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
  });
  const [filteredReviews, setFilteredReviews] = useState<
    AddReviewDetails[] | []
  >(reviews);
  const [allReviews, setAllReviews] = useState<AddReviewDetails[] | []>(
    reviews
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState(0);
  const [formShown, setFormShown] = useState(false);

  const user = state?.user;

  const userHasReview =
    user && allReviews.some((review) => review.customerName === user?.name);

  const onSubmit = async (data: AddReview) => {
    setIsLoading(true);
    try {
      if (!data.review || !data.rating) {
        showErrorToast("Invalid data, please fill rating and review");
        return false;
      }

      const { result, success, message } = await Products.addReview(
        productId,
        data
      );
      if (success) {
        showSuccessToast(message);
      }
      setAllReviews(result?.feedbackDetails);
      setFilteredReviews(result?.feedbackDetails);
      reset(initialState);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.errorResponse?.message || error?.message
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { result, message } = await Products.deleteReview(productId, id);
      showSuccessToast(message);
      setAllReviews(result?.feedbackDetails);
      setFilteredReviews(result?.feedbackDetails);
      reset(initialState);
      if (result?.feedbackDetails.length === 0) {
        setFormShown(false);
      }
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.errorResponse?.message || error?.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {user &&
        user.type.toLocaleLowerCase() === "customer" &&
        !userHasReview && (
          <div>
            {!formShown ? (
              <Button
                variant="info"
                className="border-1 border-dark rounded-3"
                onClick={() => {
                  setFormShown(true);
                }}
              >
                Add review
              </Button>
            ) : (
              <div className="reviewInputZone">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Your Rating</Form.Label>
                    <br />
                    <Controller
                      name="rating"
                      control={control}
                      rules={{ required: "Rating is required" }}
                      render={({ field }) => (
                        <Rating
                          {...field}
                          initialValue={field.value}
                          allowHover={false}
                          size={20}
                          onClick={(nextValue) => setValue("rating", nextValue)}
                        />
                      )}
                    />
                    {errors.rating && (
                      <p className="text-danger">{errors.rating.message}</p>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                      className="form-control-no-focus resize-none"
                      as="textarea"
                      rows={3}
                      {...control.register("review", {
                        required: "Review is required",
                        minLength: {
                          value: 10,
                          message: "Review must be at least 10 characters",
                        },
                      })}
                    />
                    {errors.review && (
                      <p className="text-danger">{errors.review.message}</p>
                    )}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicCheckbox"
                  ></Form.Group>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      reset(initialState);
                      setFormShown(false);
                    }}
                  >
                    Cancel
                  </Button>{" "}
                  {""}
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            )}
            <hr />
          </div>
        )}

      <div className="filterRating">
        <h5>Filter By - </h5>
        <Rating
          initialValue={filterValue}
          allowHover={false}
          onClick={(number: number) => {
            setFilteredReviews(
              number === 0
                ? allReviews
                : allReviews.filter((value) => value.rating === number)
            );
            setFilterValue(number);
          }}
        />

        <Button
          className="reloadBtn"
          variant="outline-secondary"
          onClick={() => {
            setFilteredReviews(allReviews);
            setFilterValue(0);
          }}
        >
          <ArrowClockwise />
        </Button>
      </div>
      <div className="reviewZone">
        {" "}
        {filteredReviews.map((review, index) => (
          <Card bg="light" key={index} text="dark" className="mb-2 w-100">
            <Card.Header className="reviewHeader">
              <PersonFill className="personReview" />
              <Card.Text className="mt-1 me-1">{review.customerName}</Card.Text>
              <Rating initialValue={review.rating} size={20} readonly />
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <span className="reviewDt me-1">{review.updatedAt}</span>
                {review.feedbackMsg}
              </Card.Text>
              {userHasReview && (
                <Button
                  variant="danger"
                  onClick={(e) => handleDelete(e, review._id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
        {filteredReviews.length < 1 && <h5>No reviews</h5>}
      </div>
    </div>
  );
};

export default ReviewSection;

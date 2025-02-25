export interface AddReview {
  review: string;
  rating: number;
}

export interface AddReviewDetails {
  createdAt: string;
  customerId: string;
  customerName: string;
  feedbackMsg: string;
  _id: string;
  rating: number;
  updatedAt: string;
}

export interface IReviewProps {
  reviews: AddReviewDetails[];
  productId: string;
}

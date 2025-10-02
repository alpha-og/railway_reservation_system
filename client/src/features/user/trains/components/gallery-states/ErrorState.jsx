import { GalleryContainer } from "../GalleryContainer";
import { XCircle } from "lucide-react";

export const ErrorState = ({ error }) => (
  <GalleryContainer>
    <div className="alert alert-error">
      <XCircle className="stroke-current shrink-0 h-6 w-6" />
      <span>Error loading trains: {error.message}</span>
    </div>
  </GalleryContainer>
);
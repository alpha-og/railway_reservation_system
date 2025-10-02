export const GalleryContainer = ({ children, className = "" }) => (
  <div className={`card w-full h-max md:h-full p-4 flex-3 flex flex-col shadow-2xl bg-base-100 lg:w-11/12 ${className}`}>
    {children}
  </div>
);
import { LoaderFive } from "@/components/ui/loader";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <LoaderFive text="Searching" />
    </div>
  );
};

export default LoadingState;

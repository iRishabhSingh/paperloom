import "@/styles/animations/loading.css";
import ThemedText from "@/components/ThemedText";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-100">
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          {[..."paperloom"].map((char, index) => (
            <div
              key={index + char}
              className="animate-letter-bounce"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <ThemedText
                text={char}
                className="inline-block text-5xl text-base-content"
              />
            </div>
          ))}
        </div>

        <div className="mx-auto h-1 w-64 overflow-hidden rounded-full bg-base-200">
          <div className="animate-progress-sweep h-full rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

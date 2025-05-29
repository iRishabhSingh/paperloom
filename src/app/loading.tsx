import "@/styles/animations/loading.css";
import ThemedText from "@/components/ThemedText";

const Loading = () => {
  return (
    <div
      className="h-screen w-full bg-base-100 flex items-center justify-center"
      data-theme="dark"
    >
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          {[..."paperloom"].map((char, index) => (
            <div
              key={index + char}
              className="animate-letter-bounce"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <ThemedText
                text={char}
                className="text-5xl text-base-content inline-block"
              />
            </div>
          ))}
        </div>

        <div className="w-64 bg-base-200 rounded-full h-1 overflow-hidden mx-auto">
          <div className="animate-progress-sweep h-full bg-primary rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

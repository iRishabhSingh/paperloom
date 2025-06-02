import StatsCards from "@/components/dashboard/StatsCards";
import RecentPDFs from "@/components/dashboard/RecentPDFs";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-base-content/70">
          Welcome back! Here&apos;s what&apos;s happening with your documents.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentPDFs />

        {/* Activity Feed - Placeholder */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start">
                <div className="mr-3 mt-1 rounded-full bg-primary/10 p-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <p className="font-medium">
                    Alex Johnson commented on Product Roadmap
                  </p>
                  <p className="mt-1 text-sm text-base-content/60">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shared with me - Placeholder */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Shared with You</h2>
        <div className="py-8 text-center text-base-content/60">
          <p>No files shared with you yet</p>
          <p className="mt-2 text-sm">
            When someone shares a PDF with you, it will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

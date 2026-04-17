import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NewsFeedFilters } from "@/features/news/components/news-feed-filters";
import { newsApi } from "@/features/news/api/news-api";
import { NewsCard } from "@/features/news/components/news-card";
import { StatusState } from "@/shared/components/status-state";

export function DashboardPage() {
  const [filters, setFilters] = useState({});

  const query = useQuery({
    queryKey: ["news", filters.sector ?? null, filters.impact ?? null],
    queryFn: () => newsApi.list(filters),
  });

  return (
    <div className="stack">
      <NewsFeedFilters sector={filters.sector} impact={filters.impact} onChange={setFilters} />
      {query.isLoading ? <StatusState title="Loading feed..." /> : null}
      {query.isError ? <StatusState title="Failed to load feed" description={query.error.response?.data?.message ?? "Try again shortly."} /> : null}
      {query.data && query.data.length === 0 ? (
        <StatusState title="No matching articles" description="Adjust filters or wait for the next fetch cycle." />
      ) : null}
      <section className="grid">
        {query.data?.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { impacts, sectors } from "@/app/types/domain";
import { subscriptionsApi } from "@/features/subscriptions/api/subscriptions-api";
import { StatusState } from "@/shared/components/status-state";

function SubscriptionRow({ subscription, onUpdate, onDelete }) {
  const form = useForm({
    defaultValues: { sector: subscription.sector, minImpact: subscription.minImpact },
  });

  return (
    <form className="card form-row" onSubmit={form.handleSubmit((values) => onUpdate(values))}>
      <label className="label">
        <span>Sector</span>
        <select {...form.register("sector")}>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </label>
      <label className="label">
        <span>Minimum impact</span>
        <select {...form.register("minImpact")}>
          {impacts.map((impact) => (
            <option key={impact} value={impact}>
              {impact}
            </option>
          ))}
        </select>
      </label>
      <div className="row">
        <button className="button button-outline" type="submit">
          Update
        </button>
        <button className="button button-danger" type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </form>
  );
}

export function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["subscriptions"], queryFn: subscriptionsApi.list });

  const form = useForm({
    defaultValues: { sector: "GENERAL", minImpact: "MEDIUM" },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => subscriptionsApi.create(payload),
    onSuccess: () => {
      toast.success("Subscription created.");
      form.reset({ sector: "GENERAL", minImpact: "MEDIUM" });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Unable to create subscription.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => subscriptionsApi.update(id, payload),
    onSuccess: () => {
      toast.success("Subscription updated.");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: () => toast.error("Unable to update subscription."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => subscriptionsApi.remove(id),
    onSuccess: () => {
      toast.success("Subscription deleted.");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: () => toast.error("Unable to delete subscription."),
  });

  return (
    <div className="stack">
      <form className="card form-row" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
        <label className="label">
          <span>Sector</span>
          <select {...form.register("sector")}>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          <span>Minimum impact</span>
          <select {...form.register("minImpact")}>
            {impacts.map((impact) => (
              <option key={impact} value={impact}>
                {impact}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit" disabled={createMutation.isPending}>
          Add subscription
        </button>
      </form>

      {query.isLoading ? <StatusState title="Loading subscriptions..." /> : null}
      {query.isError ? <StatusState title="Failed to load subscriptions" /> : null}
      {query.data && query.data.length === 0 ? <StatusState title="No subscriptions yet" description="Add your first sector preference above." /> : null}

      <div className="stack">
        {query.data?.map((subscription) => (
          <SubscriptionRow
            key={subscription.id}
            subscription={subscription}
            onUpdate={(payload) => updateMutation.mutate({ id: subscription.id, payload })}
            onDelete={() => deleteMutation.mutate(subscription.id)}
          />
        ))}
      </div>
    </div>
  );
}

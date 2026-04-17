import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { sectors } from "@/app/types/domain";
import { adminApi } from "@/features/admin/api/admin-api";
import { StatusState } from "@/shared/components/status-state";
import { formatDateTime } from "@/shared/utils/format";

function KeywordRuleRow({ rule, onDelete, onUpdate }) {
  const form = useForm({
    defaultValues: {
      sector: rule.sector,
      keyword: rule.keyword,
      enabled: rule.enabled,
    },
  });

  return (
    <form className="subtle-card stack" onSubmit={form.handleSubmit((values) => onUpdate(values))}>
      <div className="form-row">
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
          <span>Keyword</span>
          <input type="text" {...form.register("keyword", { required: true })} />
        </label>
        <label className="checkbox">
          <input type="checkbox" {...form.register("enabled")} />
          <span>Enabled</span>
        </label>
      </div>
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

export function AdminPage() {
  const queryClient = useQueryClient();

  const logsQuery = useQuery({
    queryKey: ["admin", "fetchLogs"],
    queryFn: adminApi.fetchLogs,
  });
  const rulesQuery = useQuery({
    queryKey: ["admin", "keywordRules"],
    queryFn: adminApi.listKeywordRules,
  });

  const triggerMutation = useMutation({
    mutationFn: adminApi.triggerFetch,
    onSuccess: () => {
      toast.success("Manual fetch triggered.");
      queryClient.invalidateQueries({ queryKey: ["admin", "fetchLogs"] });
    },
    onError: () => toast.error("Unable to trigger fetch."),
  });

  const form = useForm({
    defaultValues: { sector: "GENERAL", keyword: "", enabled: true },
  });

  const createRuleMutation = useMutation({
    mutationFn: (payload) => adminApi.createKeywordRule(payload),
    onSuccess: () => {
      toast.success("Keyword rule created.");
      form.reset({ sector: "GENERAL", keyword: "", enabled: true });
      queryClient.invalidateQueries({ queryKey: ["admin", "keywordRules"] });
    },
    onError: () => toast.error("Unable to create keyword rule."),
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id) => adminApi.deleteKeywordRule(id),
    onSuccess: () => {
      toast.success("Keyword rule deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin", "keywordRules"] });
    },
    onError: () => toast.error("Unable to delete keyword rule."),
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateKeywordRule(id, payload),
    onSuccess: () => {
      toast.success("Keyword rule updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "keywordRules"] });
    },
    onError: () => toast.error("Unable to update keyword rule."),
  });

  return (
    <div className="stack">
      <section className="card">
        <div className="row space-between">
          <div>
            <h3>Manual News Fetch</h3>
            <p className="muted">Trigger immediate ingestion from NewsAPI.</p>
          </div>
          <button className="button" onClick={() => triggerMutation.mutate()} disabled={triggerMutation.isPending}>
            Trigger fetch
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Fetch Logs</h3>
        {logsQuery.isLoading ? <p className="muted">Loading logs...</p> : null}
        {logsQuery.isError ? <StatusState title="Failed to load fetch logs." /> : null}
        <div className="stack">
          {logsQuery.data?.map((log) => (
            <article className="subtle-card" key={log.id}>
              <div className="row space-between">
                <strong>{log.status}</strong>
                <small className="muted">{formatDateTime(log.startedAt)}</small>
              </div>
              <p className="muted">
                fetched={log.fetchedCount} processed={log.processedCount}
              </p>
              {log.message ? <small>{log.message}</small> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Keyword Rules</h3>
        <form className="form-row" onSubmit={form.handleSubmit((values) => createRuleMutation.mutate(values))}>
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
            <span>Keyword</span>
            <input type="text" {...form.register("keyword", { required: true })} />
          </label>
          <label className="checkbox">
            <input type="checkbox" {...form.register("enabled")} />
            <span>Enabled</span>
          </label>
          <button className="button" type="submit">
            Add rule
          </button>
        </form>

        <div className="stack">
          {rulesQuery.data?.map((rule) => (
            <KeywordRuleRow
              key={rule.id}
              rule={rule}
              onDelete={() => deleteRuleMutation.mutate(rule.id)}
              onUpdate={(payload) => updateRuleMutation.mutate({ id: rule.id, payload })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
